import numpy
import json
import numpy as np
import sys
import io

if __name__ == '__main__':
    data = np.loadtxt(io.StringIO(sys.argv[1]), dtype='f', delimiter=',')
    res = np.corrcoef(data.transpose())
    print(json.dumps({'corrcoef': res.tolist()}))

