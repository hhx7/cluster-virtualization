
import torch
import scipy.stats as stats
import json
import sys


def anova(x1, x2):
    total_num = x1.size(1) + x2.size(1)
    total_sum = x1.sum() + x2.sum()
    total_mean = total_sum / total_num
    Q_t = total_sum - total_num * total_mean ** 2
    total_pow_sum = torch.sum(x1 ** 2) + torch.sum(x2 **2)
    Q_a = x1.size(1) * (x1.mean() - total_mean) ** 2 + x2.size(1) * (x2.mean() - total_mean) ** 2
    Q_e = Q_t - Q_a

    Q_A = 1 / (2-1) * Q_a
    Q_E = 1/(total_num - 2) * Q_e
    F = Q_A / Q_E
    return F


if __name__ == '__main__':
    data = sys.argv[1]
    x = json.loads(data)
    f, p = stats.f_oneway(x['x1'], x['x2'])
    d1, d2 =1, len(x['x1'])-1 + len(x['x2'])-1

    print(json.dumps({'f': f, "p": p, 'd1': d1, 'd2': d2}))


