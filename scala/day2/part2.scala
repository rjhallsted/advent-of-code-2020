package com.rjhallsted.adventOfCode2020.day2

object Part2 {
    def isValid(pair: Part1.PolicyPair): Boolean =
        (pair.password(pair.p1) == pair.char) != (pair.password(pair.p2) == pair.char)
}

object Main2 extends App {
    Part1.printValidCount(Part2.isValid)
}