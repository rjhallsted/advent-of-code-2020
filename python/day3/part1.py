import functools

def getInput(file):
    with open(file) as f:
        return f.read().splitlines()

def countTrees(lines, slope: tuple) -> int:
    width = len(lines[0])
    # current = (position, count)
    def update(current: tuple, line: str):
        position = (current[0] + slope[0]) % width
        count = current[1] + 1 if (line[position] == '#') else current[1]
        return (position, count)

    result = functools.reduce(update, lines, (0, 0))
    return result[1]

if __name__ == '__main__':
    lines = getInput('../../inputs/day3.txt')
    slope = (3,1)
    print(countTrees(lines[1:], slope))
    