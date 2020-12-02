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
    p1, index = consumeUntil(line, '-', 0)
    p1 = int(p1)

    p2, index = consumeUntil(line, ' ', index + 1)
    p2 = int(p2)

    char, index = consumeUntil(line, ':', index + 1)
    
    password = line[index + 1:]

    return {
        'p1': p1,
        'p2': p2,
        'char': char,
        'password': password
    }

def isValidPassword(policyPair) -> bool:
    p = policyPair['password']
    a = policyPair['p1']
    b = policyPair['p2']
    char = policyPair['char']

    return (p[a] == char) != (p[b] == char)

def main():
    filename = "../../inputs/day2.txt"
    policyPairs = map(lineToPolicyPair, getInput(filename))
    validCount = functools.reduce(lambda a,b: a + 1 if b else a, map(isValidPassword, policyPairs))
    print(validCount)


main()

