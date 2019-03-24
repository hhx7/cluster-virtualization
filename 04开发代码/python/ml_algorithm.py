import torch
import random

def pca(x, k=2):
    x_mean = torch.mean(x, 0)
    x = x - x_mean.expand_as(x)

    r = torch.mm(torch.transpose(x, 0, 1), x)
    u, s, v = torch.svd(r)

    return u[:, 0:k]


def k_means(x, k=2):
    indexs = random.sample(range(0, len(x)-1), k)
    particles = list(map(lambda index: x[index], indexs))
    nparticles = particles.copy()
    cluster = []
    for i in range(0, len(x)):
        j = closest_point_index(row[i], particles)
        cluster[j].append(i)




