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
    return centroids


def k_means(x, k=2):
    indexs = torch.tensor(random.sample(range(0, len(x)), k), device=dev)
    centroids = torch.index_select(x, 0, indexs)
    x_norm = torch.sum(x ** 2, 1).view(-1, 1)
    while True:
        idx = find_closest_centroids(x_norm, x, centroids)
        ncentroids = update_centroids(idx, x, k)
        nidx = find_closest_centroids(x_norm, x, ncentroids)
        if torch.equal(idx, nidx):
            return ncentroids, idx
        else:
            centroids = ncentroids


def feature_scaling(X):
    return (X - X.mean(0))/(X.std(0)+1)



if __name__ == '__main__':
    max_cluster = int(sys.argv[1])
    data = np.loadtxt(io.StringIO(sys.argv[2]), dtype='f', delimiter=',')
    X = torch.from_numpy(data).to(dev)
    #X = torch.tensor([[144552912,9.3498486,56.7408757,17.0527715677876], [144552912,9.3501884,56.7406785,17.614840244389]]).to(dev)
    X = feature_scaling(X)
    centroids, idx = k_means(X, max_cluster)

    print(json.dumps({'centroids': centroids.tolist(), 'idx': idx.tolist()}))
