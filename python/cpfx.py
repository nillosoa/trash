# Generates/validates CPFs(a brazilian identity code)
# Algorithm: https://www.geradorcpf.com/algoritmo_do_cpf.htm

import sys
import itertools


if __name__ == '__main__':
    # res = []
    chars = tuple(range(0,10))

    if len(sys.argv) != 2:
        script = sys.argv[0]
        print('Cpfx')
        print(f'Use: {script} (digits)')
        print(f'Examples:\n\t{script} 111222333\n\t{script} 11x.2x2.xxx')
        sys.exit()

    digits = sys.argv[1]
    digits = digits.replace('.', '')

    if len(digits) > 9:
        print('* digits must be of length 9 or lesser')
        sys.exit()

    known_digits =\
        tuple((x, int(y)) for x, y in enumerate(digits) if y.isdigit())

    print('* %s' %digits)
    print('* %d known digits' %len(known_digits))

    for product in itertools.product(chars, repeat=9-len(known_digits)):
        candidate = list(product)
        for x, y in known_digits:
            candidate.insert(x, y)

        dv1 = sum(map(lambda xy: xy[0]*xy[1], zip(range(10, 1, -1), candidate))) % 11
        dv1 = 0 if dv1 < 2 else 11 - dv1

        candidate.append(dv1)
        dv2 = sum(map(lambda xy: xy[0]*xy[1], zip(range(11, 1, -1), candidate))) % 11
        dv2 = 0 if dv2 < 2 else 11 - dv2

        candidate.append(dv2)
        print('%d%d%d.%d%d%d.%d%d%d-%d%d' %tuple(candidate))
