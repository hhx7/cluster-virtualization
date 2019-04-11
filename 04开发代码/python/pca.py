import torch
import numpy as np
import sys
import io
import json


device_gpu = torch.device('cuda')
device_cpu = torch.device('cpu')
def pca(x, k=2):
    x_mean = torch.mean(x, 0)
    x = x - x_mean.expand_as(x)
    r = torch.mm(torch.transpose(x, 0, 1), x)
    u, s, v = torch.svd(r)
    return u[:, 0:k]

def feature_scaling(X):
    mean, std = X.mean(0), X.std(0)
    return mean, std, (X - mean)/(std+1)


if __name__ == '__main__':
    # { id: [], data: [[], []]}
    data = json.loads(sys.argv[1])
    ids, x = data['id'], data['data']
    # data = np.loadtxt(io.StringIO(sys.argv[1]), dtype='f', delimiter=',')
    X = torch.tensor(x, dtype=torch.float)
    mean, std, X = feature_scaling(X)
    U = pca(X)
    lowDimensionsRows = torch.mm(X, U)
    rows = list(map(lambda id, row: ({'id': id, 'data': row}), ids, lowDimensionsRows.tolist()))

    print(json.dumps({"pca": rows, "u": U.tolist(), "mean": mean.tolist(), "std": std.tolist()}))
    # # x1 = torch.tensor([[1, 2, 3], [4, 5, 6], [7, 8, 9]], dtype=torch.float)
    # # x2 = torch.tensor([[1, 2, 3], [4, 5, 6], [7, 8, 10]], dtype=torch.float)
    # # print(torch.mm(x1, pca(x1)))
    # # print(torch.mm(x2, pca(x2)))
