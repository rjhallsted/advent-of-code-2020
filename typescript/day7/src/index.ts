import * as R from 'ramda'
import * as fs from 'fs'
import * as readline from 'readline'
import { pipe } from 'fp-ts/function'
import * as A from 'fp-ts/Array'

function getInputReadline(file: string): readline.Interface {
    const stream = fs.createReadStream(file)
    return readline.createInterface(stream)
}

async function handler1(file: string): Promise<void> {
    const input = getInputReadline(file)

    // read through file and build graph
    // DFS on graph and count paths to shiny gold
}

// async function handler2(file: string): Promise<void> {
//     const inputString = await getInputString(file)
//     const functionalResult = functionalSumGroupOverlappingYeses(inputString)
//     console.log(functionalResult)
// }

const file = '../../inputs/day6.txt'
handler1(file)