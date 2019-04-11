import json
import sys
import torch

def feature_scaling(X, mean, std):
    return (X - mean.view(1, -1))/(std.view(1, -1)+1)


if __name__ == '__main__':
    # { id: [], data: [[], []]}
    u = json.loads(sys.argv[1])['u']
    m = json.loads(sys.argv[1])['mean']
    s = json.loads(sys.argv[1])['std']
    x = json.loads(sys.argv[2])['x']


    # data = np.loadtxt(io.StringIO(sys.argv[1]), dtype='f', delimiter=',')
    X = torch.tensor(x, dtype=torch.float)
    U = torch.tensor(u, dtype=torch.float)
    mean = torch.tensor(m, dtype=torch.float)
    std = torch.tensor(s, dtype=torch.float)

    X = feature_scaling(X, mean, std);

    lowDimensionsRows = torch.mm(X, U)
    print(json.dumps({"fppca": lowDimensionsRows.tolist()}))