

def tensor_to_array(x):
    print('[')
    for row in x:
        for v in row:
            print('{:}'.format(v))
    print(']')
