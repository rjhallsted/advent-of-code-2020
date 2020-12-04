package com.rjhallsted.adventOfCode2020.day3

object Main2 extends App {
    import Part1._

    val file = "../../inputs/day3.txt"
    val lines = getInputs(file)
    val slopes = List(Slope(1,1), Slope(3,1), Slope(5,1), Slope(7,1), Slope(1,2))
    println(slopes)

    val totals = slopes.map(countTrees(lines.tail, _))
    println(totals)
    val result = totals.reduce(_ * _)
    println(result)
}