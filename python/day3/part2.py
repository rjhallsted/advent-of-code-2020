import functools

def getInput(file):
    with open(file) as f:
        return f.read().splitlines()

def countTrees(lines, slope: tuple) -> int:
    width = len(lines[0])
    # current = (position, count, linesToSkip)
    def update(current: tuple, line: str):
        linesToSkip = current[2] - 1
        if linesToSkip == 0:
            position = (current[0] + slope[0]) % width
            count = current[1] + 1 if (line[position] == '#') else current[1]
            return (position, count, slope[1])
        else:
            return (current[0], current[1], linesToSkip)

    result = functools.reduce(update, lines, (0, 0, slope[1]))
    return result[1]

if __name__ == '__main__':
    lines = getInput('../../inputs/day3.txt')
    lines = lines[1:]

    def ct(slope: tuple):
        return countTrees(lines, slope)

    slopes = [(1,1), (3,1), (5,1), (7,1), (1,2)]
    result = functools.reduce(lambda x,y: x*y, map(ct, slopes))
    print(result)
    