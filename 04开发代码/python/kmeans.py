import torch
import random
import sys
import numpy as np
import io
import json

device_gpu = torch.device('cuda')
device_cpu = torch.device('cpu')
dev = device_cpu


def find_closest_centroids(x_norms, x, centroids):
    centroids_t = centroids.t()
    centroids_t_norm = torch.sum(centroids_t ** 2, 0).view(1, -1)
    _, idx = torch.min(-2 * torch.mm(x, centroids_t) + x_norms + centroids_t_norm, 1)
    return idx.view(-1, 1)


def update_centroids(idx, x, num_centroids):
    m, dimension = x.size()
    centroids = torch.zeros(num_centroids, dimension, dtype=torch.float, device=dev)
    count = torch.zeros(num_centroids, 1, device=dev)
    centroids.scatter_add_(0, idx.view(-1, 1).expand(-1, dimension), x)
    count.scatter_add_(0, idx.view(-1, 1), torch.ones(m, 1, device=dev))
    centroids /= count.view(-1, 1)
    return centroids, count.int()


def k_means(x, k=2):
    indexs = torch.tensor(random.sample(range(0, len(x)), k), device=dev)
    centroids = torch.index_select(x, 0, indexs)
    x_norm = torch.sum(x ** 2, 1).view(-1, 1)
    while True:
        idx = find_closest_centroids(x_norm, x, centroids)
        ncentroids, count = update_centroids(idx, x, k)
        nidx = find_closest_centroids(x_norm, x, ncentroids)
        if torch.equal(idx, nidx):
            return ncentroids, idx, count
        else:
            centroids = ncentroids


def feature_scaling(X):
    return (X - X.mean(0))/(X.std(0)+1)


if __name__ == '__main__':
    max_cluster = int(sys.argv[1])
    data = json.loads(sys.argv[2])
    #max_cluster = 2
    #data = json.loads('''{ "id": [ "1", "2", "3"], "headers": ["A", "B", "C"], "data": [ [1.0, 2.0, 3.0], [4.0, 5.0, 6.0], [7.0, 8.0, 9.0]] }''')
    ids, x, headers = data['id'], data['data'], data['headers']
    X = torch.tensor(x, dtype=torch.float)
    X = feature_scaling(X)
    centroids, idx, count = k_means(X, max_cluster)
    idxWithId = {}
    for id, index in map(lambda x, y: (x, y), ids, idx.tolist()):
        idxWithId[id] = index[0]
    count, index = count.sort(0, True)
    centroids = centroids.gather(0, index[:, 0].view(-1, 1).expand(-1, centroids.size(1)))
    print(json.dumps({'centroids': centroids.tolist(), 'headers': headers, 'count': count.tolist(), 'idx': idxWithId}))
