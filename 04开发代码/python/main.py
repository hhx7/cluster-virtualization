import torch
import numpy as np
import ml_algorithm as ml
import io
import sys



data = np.loadtxt('/home/pi/PycharmProjects/clustering/data/3D_spatial_network.txt', dtype='f', delimiter=',')
test = "1, 2, 3\n 4, 5, 6"
data = np.loadtxt(io.StringIO(test), dtype='f', delimiter=',')
X = torch.from_numpy(data)
print(X)
X = torch.from_numpy(data)
U = ml.pca(X)
res = torch.mm(X, U)
np.savetxt("res.csv", res, delimiter=',')
print(U)
if __name__ == '__main__':
    for i in range(1, len(sys.argv)):
        data = np.loadtxt(io.StringIO(sys.argv[i]), dtype='f', delimiter=',')
        print(sys.argv[i])








