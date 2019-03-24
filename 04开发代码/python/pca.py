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
    return (X - X.mean(0))/(X.std(0)+1)

if __name__ == '__main__':
    data = np.loadtxt(io.StringIO(sys.argv[1]), dtype='f', delimiter=',')
    X = torch.from_numpy(data)
    X = feature_scaling(X)
    U = pca(X)
    res = torch.mm(X, U)
    print(json.dumps({"pca": res.tolist()}))
    # x1 = torch.tensor([[1, 2, 3], [4, 5, 6], [7, 8, 9]], dtype=torch.float)
    # x2 = torch.tensor([[1, 2, 3], [4, 5, 6], [7, 8, 10]], dtype=torch.float)
    # print(torch.mm(x1, pca(x1)))
    # print(torch.mm(x2, pca(x2)))
