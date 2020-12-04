import { reduce, map } from 'fp-ts/lib/Array'
import * as R from 'ramda'
import * as fs from 'fs'
import { pipe } from 'fp-ts/lib/function'

async function getInput(file: string): Promise<string[]> {
    const contents = await fs.promises.readFile(file)
    return contents.toString().split('\n')
}

type Slope = {
    right: number,
    down: number
}

type Current = {
    position: number,
    count: number,
    linesToSkip: number
}

function countTrees(lines: string[], slope: Slope): number {
    const width = lines[0].length

    function update(current: Current, line: string): Current {
        const linesToSkip = current.linesToSkip - 1
        if (linesToSkip == 0) {
            const position = (current.position + slope.right) % width
            return {
                position,
                count: (line[position] == '#') ? current.count + 1 : current.count,
                linesToSkip: slope.down
            }
        } else {
            return {
                ...current,
                linesToSkip
            }
        }
    }

    const result = reduce<string, Current>({
        position: 0,
        count: 0,
        linesToSkip: slope.down
    }, update)(lines)
    return result.count
}

async function handler1(file: string): Promise<void> {
    const lines = await getInput(file)
    const slope: Slope = {
        right: 3,
        down: 1
    }

    const result = countTrees(lines.slice(1), slope)
    console.log(result)
}

async function handler2(file: string): Promise<void> {
    const lines = await getInput(file)
    const slopes: Slope[] = [{
        right: 1,
        down: 1
    },{
        right: 3,
        down: 1
    },{
        right: 5,
        down: 1
    },{
        right: 7,
        down: 1
    },{
        right: 1,
        down: 2
    }]

    const result = pipe(
        slopes,
        map<Slope, number>(R.curry(countTrees)(lines.slice(1))),
        reduce(1, (a, b) => a*b)
    )
    console.log(result)
}

const file = '../../inputs/day3.txt'
handler1(file)
handler2(file)