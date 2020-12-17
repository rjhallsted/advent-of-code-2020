import * as R from 'ramda'
import * as fs from 'fs'
import * as readline from 'readline'
import { pipe } from 'fp-ts/function'
import * as A from 'fp-ts/Array'

async function getInput(file: string): Promise<string[]> {
    const contents = await fs.promises.readFile(file)
    return contents.toString().split('\n')
}

type Contains = {
    count: number,
    node: Node
}

type Node = {
    color: string,
    children: Contains[]
}

// dark crimson bags contain 1 striped chartreuse bag, 4 dark tan bags, 2 faded fuchsia bags, 5 mirrored black bags.
// <    color > bags contain <bags>
//                           <#> <    color     > bag, 
//                                                  if ',' get another bag, else end

function consumeLine(root: Map<string, Node>, line: string): Map<string, Node> {
    const [outerColor, bags] = line.split(' bags contain ')
    if (!root.has(outerColor)) {
        root.set(outerColor, { 
            color: outerColor,
            children: []
        })
    }

    bags.split(', ')
        .filter(bag => bag != "no other bags.")
        .forEach((bag) => {
            const [full, count, innerColor] = bag.match(/(\d+) (.*)? bags*/) as RegExpMatchArray
            if (!root.has(innerColor)) {
                root.set(innerColor, { 
                    color: innerColor,
                    children: []
                })
            }
            const outerNode = root.get(outerColor) as Node
            const innerNode = root.get(innerColor) as Node
            outerNode.children.push({
                count: parseInt(count),
                node: innerNode
            })
    })

    return root
}

function createGraph(lines: string[]): Map<string, Node> {
    return lines.reduce(consumeLine, new Map<string, Node>())
}

function containsShinyGold(node: Node): boolean {
    // console.log(node.color, ":", node.children.map(a => a.color))
    const queue: Node[] = []
    node.children.forEach(n => queue.push(n.node))
    while (queue.length != 0) {
        const current = queue.shift()
        if (current?.color == 'shiny gold') {
            return true
        }
        current?.children.forEach((n) => queue.push(n.node))
    }
    return false
}

async function handler(file: string): Promise<void> {
    const root = createGraph(await getInput(file))
    console.log(part1(root))
    console.log(part2(root))
}

function part1(root: Map<string, Node>): number {
    return Array.from(root.values())
            .filter(containsShinyGold)
            .length
}

function countContents(bag: Node): number {
    if (bag.children.length == 0) {
        return 1
    }
    return 1 + bag.children
                .map((c: Contains) => c.count * countContents(c.node))
                .reduce((p, c) => p + c)
}

function part2(root: Map<string, Node>): number {
    const shinyGoldBag = root.get('shiny gold') as Node
    return countContents(shinyGoldBag) - 1
}

// async function handler2(file: string): Promise<void> {
//     const inputString = await getInputString(file)
//     const functionalResult = functionalSumGroupOverlappingYeses(inputString)
//     console.log(functionalResult)
// }

const file = '../../inputs/day7.txt'
handler(file)