import functools

def getInput(filename):
    f = open(filename)
    numbers = f.readlines()
    f.close()
    return list(map(lambda x: int(x), numbers))

def bsearch(numbers: list, start: int, end: int, goal: int):
    middle = start + ((end - start) // 2)
    print(f"start({start}): {numbers[start]}, end({end}): {numbers[end]}")
    print(f"middle({middle}): {numbers[middle]}, goal: {goal}")
    if middle == start:
        return False
    elif numbers[middle] == goal:
        return middle
    elif numbers[middle] < goal:
        return bsearch(numbers, middle, end, goal)
    else:
        return bsearch(numbers, start, middle, goal)
    

def getSolution(numbers):
    numbers = sorted(numbers)
    for a in range(0, len(numbers) - 2):
        for b in range(a + 1, len(numbers) - 1):
            goal = (2020 - numbers[a]) - numbers[b]
            print(f"{numbers[a]} + {numbers[b]} = {numbers[a] + numbers[b]}")
            print(goal)
            if goal > numbers[b]:
                c = bsearch(numbers, b + 1, len(numbers) - 1, goal)
                if c != False:
                    return (numbers[a], numbers[b], numbers[c])
    return False


def main():
    filename = "input.txt"
    numbers = getInput(filename)
    result = getSolution(numbers)
    print(*result)
    print(functools.reduce(lambda a,b: a*b, result))

main()


# sort numbers
# from beginning, try from end until below 2020 or hit this number