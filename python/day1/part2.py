import functools

def getInput(filename):
    f = open(filename)
    numbers = f.readlines()
    f.close()
    return list(map(lambda x: int(x), numbers))

def find2NumbersThatSumTo(goal, numbers, start):
    end = len(numbers) - 1
    sum = numbers[start] + numbers[end]
    while sum != goal and end > start:
        if sum < goal:
            start += 1
        else:
            end -= 1
        sum = numbers[start] + numbers[end]
    if sum == goal:
        return (numbers[start], numbers[end])
    else:
        return False

def find3NumbersThatSumTo(goal, numbers, start):
    for i in range(len(numbers) - 2):
        subgoal = goal - numbers[i]
        pair = find2NumbersThatSumTo(subgoal, numbers, i + 1)
        if (pair != False):
            return (numbers[i], pair[0], pair[1])
    return False

def main():
    filename = "../../inputs/day1.txt"
    numbers = sorted(getInput(filename))
    result = find3NumbersThatSumTo(2020, numbers, 0)
    if (result == False):
        print("No result")
    else:
        print(*result)
        print(functools.reduce(lambda a,b: a*b, result))

main()