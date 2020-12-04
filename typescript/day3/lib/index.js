"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Array_1 = require("fp-ts/lib/Array");
const R = __importStar(require("ramda"));
const fs = __importStar(require("fs"));
const function_1 = require("fp-ts/lib/function");
async function getInput(file) {
    const contents = await fs.promises.readFile(file);
    return contents.toString().split('\n');
}
function countTrees(lines, slope) {
    const width = lines[0].length;
    function update(current, line) {
        const linesToSkip = current.linesToSkip - 1;
        if (linesToSkip == 0) {
            const position = (current.position + slope.right) % width;
            return {
                position,
                count: (line[position] == '#') ? current.count + 1 : current.count,
                linesToSkip: slope.down
            };
        }
        else {
            return Object.assign(Object.assign({}, current), { linesToSkip });
        }
    }
    const result = Array_1.reduce({
        position: 0,
        count: 0,
        linesToSkip: slope.down
    }, update)(lines);
    return result.count;
}
async function handler1(file) {
    const lines = await getInput(file);
    const slope = {
        right: 3,
        down: 1
    };
    const result = countTrees(lines.slice(1), slope);
    console.log(result);
}
async function handler2(file) {
    const lines = await getInput(file);
    const slopes = [{
            right: 1,
            down: 1
        }, {
            right: 3,
            down: 1
        }, {
            right: 5,
            down: 1
        }, {
            right: 7,
            down: 1
        }, {
            right: 1,
            down: 2
        }];
    const result = function_1.pipe(slopes, Array_1.map(R.curry(countTrees)(lines.slice(1))), Array_1.reduce(1, (a, b) => a * b));
    console.log(result);
}
const file = '../../inputs/day3.txt';
handler1(file);
handler2(file);
