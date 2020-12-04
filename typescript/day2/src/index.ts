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

function OptionToString<T>(option: O.Option<T>, reduce: (x: T) => string): string {
    return pipe(
        option,
        E.fromOption(() => "No solution found"),
        E.map(reduce),
        E.fold(R.identity, R.identity)
    )
}

type PolicyPair = {
    p1: number,
    p2: number,
    char: string,
    password: string
}

function lineToPolicyPair(line: string): PolicyPair {
    const pattern = /(\d+)\-(\d+)\s([a-z])\:\s(.+)/
    const matches = line.match(pattern) as RegExpMatchArray
    return {
        p1: parseInt(matches[1]),
        p2: parseInt(matches[2]),
        char: matches[3],
        password: matches[4]
    }
}

async function countValidPasswords(file: string, isValid: (p: PolicyPair) => boolean): Promise<number> {
    return (await getInput(file))
        .map(lineToPolicyPair)
        .map(isValid)
        .reduce((sum: number, current: boolean) => (current) ? sum + 1 : sum, 0)
}

async function handler1(file: string): Promise<void> {
    const isValid = (p: PolicyPair) => {
        const regex = new RegExp(p.char, 'g')
        const count = (p.password.match(regex) || []).length
        return count >= p.p1 && count <= p.p2
    }

    const result = await countValidPasswords(file, isValid)

    console.log(result)
}

async function handler2(file: string): Promise<void> {
    const isValid = (p: PolicyPair) => {
        const a = p.password[p.p1 - 1] == p.char
        const b = p.password[p.p2 - 1] == p.char
        return a != b
    }

    const result = await countValidPasswords(file, isValid) 

    console.log(result)
}

const file = '../../inputs/day2.txt'
handler1(file).then(() => {
    handler2(file)
})