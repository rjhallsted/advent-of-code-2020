import * as R from 'ramda'
import * as fs from 'fs'
import { pipe } from 'fp-ts/lib/function'

// TODO: Convert to getting a line at a time
async function getInput(file: string): Promise<string[]> {
    const contents = await fs.promises.readFile(file)
    return contents.toString().split('\n')
}

type BinaryPartionedLocationConfig = {
    low: number,
    high: number,
    startIndex: number,
    stopIndex: number, // not inclusive,
    lowChar: string
}

function findBinaryPartionedLocation(c: BinaryPartionedLocationConfig): (line: string) => number {
    return (line: string) => {
        let low = c.low
        let high = c.high
        let mid
        for (let i = c.startIndex; i < c.stopIndex; i++) {
            mid = Math.floor((high - low) / 2) + low + 1
            if (line[i] == c.lowChar) {
                high = mid - 1
            } else {
                low = mid
            }
        }
        return low
    }
}

function getRow(line: string): number {
    let config: BinaryPartionedLocationConfig = {
        low: 0,
        high: 127,
        startIndex: 0,
        stopIndex: 7,
        lowChar: 'F'
    }
    return findBinaryPartionedLocation(config)(line)
}

function getColumn(line: string): number {
    let config: BinaryPartionedLocationConfig = {
        low: 0,
        high: 7,
        startIndex: 7,
        stopIndex: 10,
        lowChar: 'L'
    }
    return findBinaryPartionedLocation(config)(line)
}

function lineToSeatNumber(line: string): number {
    const row = getRow(line)
    const column = getColumn(line)
    return (row * 8) + column
}

async function handler1(file: string): Promise<void> {
    const input = await getInput(file)
   
    const result = pipe(
        input,
        R.map(lineToSeatNumber),
        R.apply(Math.max)
    )
    
    console.log(result)
}

function findMissing(seats: number[]): number {
    let i = 1
    while (i < seats.length && seats[i] == seats[i - 1] + 1) {
        i += 1;
    }
    return seats[i] - 1
}

async function handler2(file: string): Promise<void> {
    const input = await getInput(file)

    const seats = input.map(lineToSeatNumber).sort((a,b) => a - b)
    const yourSeat = findMissing(seats)

    console.log(yourSeat)
}

const file = '../../inputs/day5.txt'
handler1(file).then(() => handler2(file))