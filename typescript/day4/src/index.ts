import { reduce, map } from 'fp-ts/lib/Array'
import * as R from 'ramda'
import * as fs from 'fs'
import { pipe } from 'fp-ts/lib/function'
import { parse } from 'path'
import { isIPv4 } from 'net'

async function getInput(file: string): Promise<string> {
    const contents = await fs.promises.readFile(file)
    return contents.toString()
}

type UnvalidatedPassport = {
    byr?: string,
    iyr?: string,
    eyr?: string,
    hgt?: string,
    hcl?: string,
    ecl?: string,
    pid?: string,
    cid?: string
}

type Passport = {
    byr: string,
    iyr: string,
    eyr: string,
    hgt: string,
    hcl: string,
    ecl: string,
    pid: string,
    cid?: string
}

type Rule = {
    field: string,
    isValid: (x: string) => boolean
}

function propsToUnvalidatedPassport(properties: string[]): UnvalidatedPassport {
    return properties
        .map(R.split(':'))
        .reduce(
            (passport: UnvalidatedPassport, pair: string[]) => R.assoc(pair[0], pair[1], passport),
            {}
        )
}

function isPassport(passport: unknown): passport is Passport {
    const p = passport as Passport
    return (typeof p.byr === 'string' &&
            typeof p.iyr === 'string' &&
            typeof p.eyr === 'string' &&
            typeof p.hgt === 'string' &&
            typeof p.hcl === 'string' &&
            typeof p.ecl === 'string' &&
            typeof p.pid === 'string') 
}

function applyRule(passport: Passport, rule: Rule): boolean {
    const prop = R.prop(rule.field)(passport)
    return (prop) ? rule.isValid(prop) : false
}

function passportIsValid(rules: Rule[], passport: Passport): boolean {
    return R.all(R.curry(applyRule)(passport))(rules)
}

function doAndPass<T>(fn: (x: T) => any): (x: T) => T {
    return (x: T) => {
        fn(x)
        return x
    }
}

async function handler1(file: string): Promise<void> {
    const input = await getInput(file)
   
    const result = pipe(
        input,
        R.split('\n\n'),
        R.map(R.split(/\s/)),
        R.map(propsToUnvalidatedPassport),
        R.filter(isPassport),
        R.length
    )

    console.log(result)
}

async function handler2(file: string, validationRules: Rule[]): Promise<void> {
    const input = await getInput(file)
   
    const result = pipe(
        input,
        R.split('\n\n'),
        R.map(R.split(/\s/)),
        R.map(propsToUnvalidatedPassport),
        R.filter(isPassport),
        R.map((x: UnvalidatedPassport) => x as Passport),
        // doAndPass((x) => console.log(x)),
        R.filter(R.curry(passportIsValid)(validationRules)),
        R.length
    )

    console.log(result)
}

// async function handler2(file: string): Promise<void> {
//     const input = await getInput(file)
// }

function stringWithinIntRange(min: number, max: number, str: string): boolean {
    const n = parseInt(str)
    return n >= min && n <= max
}

function isValidHeight(s: string): boolean {
    const label = s.slice(-2)
    const value = s.slice(0, -2)

    return (label == 'cm' && stringWithinIntRange(150, 193, value)) ||
        (label == 'in' && stringWithinIntRange(59, 76, value))
}

function isAllDigits(s: string): boolean {
    const matches = s.match(/[0-9]+/g)
    return (matches) ? matches.length == 1 : false
}

function isAllHex(s: string): boolean {
    const matches = s.match(/[0-9a-f]+/g)
    return (matches) ? matches.length == 1 : false
}

function isValidHairColor(s: string): boolean {
    return s.length == 7 && s[0] == '#' && isAllHex(s.slice(1))
}

const validEyeColors = [
    'amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth'
]

const rules: Rule[] = [
    { 
        field: 'byr',
        isValid: R.curry(stringWithinIntRange)(1920)(2002)
    },
    {
        field: 'iyr',
        isValid: R.curry(stringWithinIntRange)(2010)(2020)
    },
    {
        field: 'eyr',
        isValid: R.curry(stringWithinIntRange)(2020)(2030)
    },
    {
        field: 'hgt',
        isValid: isValidHeight
    },
    {
        field: 'hcl',
        isValid: isValidHairColor
    },
    {
        field: 'ecl',
        isValid: (x: string) => R.includes(x)(validEyeColors)
    },
    {
        field: 'pid',
        isValid: (x: string) => x.length == 9 && isAllDigits(x)
    }
]

const file = '../../inputs/day4.txt'
handler1(file).then(() => handler2(file, rules))