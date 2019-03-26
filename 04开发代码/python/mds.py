import sys
import io
import torch
import numpy as np
import json

device_gpu = torch.device('cuda')
device_cpu = torch.device('cpu')


def pairwise_distance_pow2(X):
    X = X.float()
    m, n = X.size()
    D = torch.zeros(m, m)
    for i in range(0, m):
        for j in range(0, m):
            D[i][j] = torch.sum(torch.pow(X[i] - X[j], 2))
    return D


def mds(X, k=2):
    D_pow2 = pairwise_distance_pow2(X)
    row_mean, col_mean, total_mean = D_pow2.mean(1), D_pow2.mean(0), D_pow2.mean()
    B = (D_pow2 - row_mean.view(-1, 1) - col_mean.view(1, -1) + total_mean) * (-0.5)
    e, v = B.eig(True)
    e, index = e.sort(0, True)
    v = v.gather(0, index[:, 0].view(-1, 1).expand(-1, v.size(1)))
    Z = torch.mm(torch.diag(e[0:k, 0]).sqrt(), v.t()[0:k, :])
    return Z.t()


if __name__ == '__main__':
    data = json.loads(sys.argv[1])
    ids, x = data['id'], data['data']
    X = torch.tensor(x, dtype=torch.float)
    lowDimensionsRows = mds(X, 2)
    rows = list(map(lambda id, row: ({'id': id, 'data': row}), ids, lowDimensionsRows.tolist()))
    print(json.dumps({"mds": rows}))



