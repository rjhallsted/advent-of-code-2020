import { reduce } from 'fp-ts/lib/Array';
import * as R from 'ramda'
import * as fs from 'fs'
import { pipe } from 'fp-ts/lib/function'
import * as O from 'fp-ts/lib/Option'
import * as E from 'fp-ts/lib/Either'
import { map } from 'fp-ts/lib/Either';

async function getInput(file: string): Promise<string[]> {
    const contents = await fs.promises.readFile(file)
    return contents.toString().split('\n')
}

type Pair = {
    a: number,
    b: number
}

type Triplet = {
    a: number,
    b: number,
    c: number
}

function find2NumbersThatSumTo(goal: number, numbers: number[], startAt: number): O.Option<Pair> {
    const complement = new Map()

    for(let i = startAt; i < numbers.length; i++) {
        if (complement.has(goal - numbers[i])) {
            return O.some({
                a: goal - numbers[i],
                b: numbers[i]
            })
        }
        complement.set(numbers[i], goal - numbers[i])
    }
    return O.none
}

function OptionToString<T>(option: O.Option<T>, reduce: (x: T) => string): string {
    return pipe(
        option,
        E.fromOption(() => "No solution found"),
        E.map(reduce),
        E.fold(R.identity, R.identity)
    )
}

async function handler1(file: string, goal: number): Promise<void> {
    const numbers = (await getInput(file)).map((x: string) => parseInt(x))

    const result = OptionToString(
        find2NumbersThatSumTo(goal, numbers, 0),
        (p: Pair) => R.toString(p.a * p.b)
    )

    console.log(result)
}

function find3NumbersThatSumTo(goal: number, numbers: number[]): O.Option<Triplet> {
    for(let i = 0; i < numbers.length - 3; i++) {
        let a = numbers[i]
        let pair = find2NumbersThatSumTo(goal - a, numbers, i + 1)
        if (O.isSome(pair)) {
            return O.map<Pair, Triplet>((p: Pair) => {
                return {
                    a: a,
                    b: p.a,
                    c: p.b
                }
            })(pair)
        }
    }
    return O.none
}

async function handler2(file: string, goal: number): Promise<void> {
    const numbers = (await getInput(file)).map((x: string) => parseInt(x))

    const result = OptionToString(
        find3NumbersThatSumTo(goal, numbers),
        (p: Triplet) => R.toString(p.a * p.b * p.c)
    )

    console.log(result)
}

const file = '../../inputs/day1.txt'
const goal = 2020
handler1(file, goal)
handler2(file, goal)