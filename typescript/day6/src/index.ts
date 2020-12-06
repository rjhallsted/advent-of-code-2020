import * as R from 'ramda'
import * as fs from 'fs'
import * as readline from 'readline'
import { pipe } from 'fp-ts/function'
import * as A from 'fp-ts/Array'

function getInputReadline(file: string): readline.Interface {
    const stream = fs.createReadStream(file)
    return readline.createInterface(stream)
}

async function getInputString(file: string): Promise<string> {
    const input = await fs.promises.readFile(file)
    return input.toString()
}

async function sumGroupYeses(input: readline.Interface): Promise<number> {
    let sum = 0
    let answers = new Set()
    for await (const line of input) {
        if (line.length == 0) {
            sum += answers.size
            answers = new Set()
        } else {
            line.split('').map(c => answers.add(c))
        }
    }
    sum += answers.size
    return sum
}

function addToSet<T>(add: T): (set: Set<T>) => Set<T> {
    return (set: Set<T>) => {
        const newSet = new Set(set)
        newSet.add(add)
        return newSet
    }
}

function deleteFromSet<T>(remove: T): (set: Set<T>) => Set<T> {
    return (set: Set<T>) => {
        const newSet = new Set(set)
        newSet.delete(remove)
        return newSet
    }
}

function countYeses(group: string): number {
    const set = pipe(
        group.split(''),
        R.reduce((a: Set<string>, c: string) => addToSet(c)(a), new Set<string>()),
        deleteFromSet('\n')
    )

    return set.size
}

function functionalSumGroupYeses(input: string): number {
    return pipe(
        input.split('\n\n'),
        R.map(countYeses),
        R.sum
    )
}

function lineToSet(line: string): Set<string> {
    return R.pipe(
        R.split(''),
        R.reduce((a: Set<string>, c: string) => addToSet(c)(a), new Set())
    )(line)
}

function intersection(a: Set<string>, b: Set<string>): Set<string> {
    return new Set(
        [...a].filter(x => b.has(x))
    )
}

function reduceByIntersection(sets: Set<string>[]): Set<string> {
    return sets.reduce(intersection)
}

function getGroupOverlappingSets(input: string): Set<string> {
    return pipe(
        input.split('\n'),
        R.map(lineToSet),
        reduceByIntersection
    )
}

function functionalSumGroupOverlappingYeses(input: string): number {
    return pipe(
        input.split('\n\n'),
        R.map(getGroupOverlappingSets),
        R.map((a: Set<string>) => a.size),
        R.sum
    )
}

async function handler1(file: string): Promise<void> {
    const input = getInputReadline(file)
    const result = await sumGroupYeses(input)
    console.log(result)

    const inputString = await getInputString(file)
    const functionalResult = functionalSumGroupYeses(inputString)
    console.log(functionalResult)
}

async function handler2(file: string): Promise<void> {
    const inputString = await getInputString(file)
    const functionalResult = functionalSumGroupOverlappingYeses(inputString)
    console.log(functionalResult)
}

const file = '../../inputs/day6.txt'
handler1(file).then(() => handler2(file)) 