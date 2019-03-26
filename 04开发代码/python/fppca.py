import json
import sys
import torch

def feature_scaling(X):
    if len(X) > 1:
        return (X - X.mean(0))/(X.std(0)+1)
    return X


if __name__ == '__main__':
    # { id: [], data: [[], []]}
    u = json.loads(sys.argv[1])['u']
    x = json.loads(sys.argv[2])['x']


    # data = np.loadtxt(io.StringIO(sys.argv[1]), dtype='f', delimiter=',')
    X = torch.tensor(x, dtype=torch.float)
    U = torch.tensor(u, dtype=torch.float)
    lowDimensionsRows = torch.mm(X, U)
    print(json.dumps({"fppca": lowDimensionsRows.tolist() }))