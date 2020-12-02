import functools

def getInput(filename):
    f = open(filename)
    lines = f.readlines()
    f.close()
    return lines

def consumeUntil(string: str, char: str, start: int) -> (str, int):
    current = ''
    while string[start] != char:
        current += string[start]
        start += 1
    return (current, start)

def lineToPolicyPair(line: str):
    min, index = consumeUntil(line, '-', 0)
    min = int(min)

    max, index = consumeUntil(line, ' ', index + 1)
    max = int(max)

    char, index = consumeUntil(line, ':', index + 1)
    
    password = line[index + 1:]

    return {
        'min': min,
        'max': max,
        'char': char,
        'password': password
    }

def isValidPassword(policyPair) -> bool:
    count = policyPair['password'].count(policyPair['char'])
    return count >= policyPair['min'] and count <= policyPair['max']

def main():
    filename = "../../inputs/day2.txt"
    policyPairs = map(lineToPolicyPair, getInput(filename))
    validCount = functools.reduce(lambda a,b: a + 1 if b else a, map(isValidPassword, policyPairs))
    print(validCount)


main()

