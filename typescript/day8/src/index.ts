import * as R from 'ramda'
import * as fs from 'fs'
import * as readline from 'readline'
import { pipe } from 'fp-ts/function'
import * as A from 'fp-ts/Array'
import { state } from 'fp-ts/lib/State'

type InstructionType = 'acc' | 'jmp' | 'nop'

type Instruction = {
    type: InstructionType,
    value: number
}

type State = {
    accumulator: number,
    index: number
}

async function getLines(file: string): Promise<string[]> {
    const contents = await fs.promises.readFile(file)
    return contents.toString().split('\n')
}

async function handler(file: string): Promise<void> {
    const lines = await getLines(file)
    const instructions = lines.map(lineToInstruction)
    console.log(part1(instructions))
    console.log(part2(instructions))
}

function lineToInstruction(line: string): Instruction {
    const [ins, val] = line.split(' ')
    return {
        type: ins as InstructionType,
        value: parseInt(val)
    }
}

function accumulate(state: State, val: number): State {
    return {
        index: state.index + 1,
        accumulator: state.accumulator + val
    }
}

function jump(state: State, val: number): State {
    return {
        index: state.index + val,
        accumulator: state.accumulator
    }
}

function noOp(state: State, val: number): State {
    return jump(state, 1)
}

const instructionFunctions = {
    'acc': accumulate,
    'jmp': jump,
    'nop': noOp
}

function applyInstruction(instruction: Instruction, state: State): State {
    return instructionFunctions[instruction.type](state, instruction.value)
}

function part1(instructions: Instruction[]): number {
    let state = {
        accumulator: 0,
        index: 0
    }
    let visited = instructions.map(x => false)
    while (visited[state.index] == false) {
        visited[state.index] = true
        state = applyInstruction(instructions[state.index], state)
    }
    return state.accumulator
}

function doesItLoop(instructions: Instruction[]): boolean {
    let state = {
        accumulator: 0,
        index: 0
    }
    let visited = instructions.map(x => false)
    while (state.index < instructions.length && visited[state.index] == false) {
        visited[state.index] = true
        state = applyInstruction(instructions[state.index], state)
    }
    return state.index < instructions.length
}

function getAccumulator(instructions: Instruction[]): number {
    let state = {
        accumulator: 0,
        index: 0
    }
    while (state.index < instructions.length) {
        state = applyInstruction(instructions[state.index], state)
    }
    return state.accumulator
}

function flipType(instruction: Instruction): Instruction {
    switch (instruction.type) {
        case 'nop':
            instruction.type = 'jmp'
            break
        case 'jmp':
            instruction.type = 'nop'
            break
    }
    return instruction
}

function part2(instructions: Instruction[]): number {
    let changedIndex = 0
    instructions[changedIndex] = flipType(instructions[changedIndex])
    while (doesItLoop(instructions)) {
        instructions[changedIndex] = flipType(instructions[changedIndex])
        changedIndex += 1
        while (instructions[changedIndex].type == 'acc')
            changedIndex += 1
        instructions[changedIndex] = flipType(instructions[changedIndex])
    }
    return getAccumulator(instructions)
}

const file = '../../inputs/day8.txt'
handler(file)