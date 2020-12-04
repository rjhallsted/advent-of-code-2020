package com.rjhallsted.adventOfCode2020.day3

import scala.io.Source

object Part1 {
    def getInputs(filepath: String): List[String] =    
        Source.fromFile(filepath).getLines().toList

    final case class Slope(
        right: Int,
        down: Int
    )

    def countTrees(lines: List[String], slope: Slope): BigInt = {
        final case class Current(
            position: Int,
            count: BigInt,
            linesToSkip: Int
        )

        val width = lines(0).length

        def update(current: Current, line: String): Current = if (current.linesToSkip - 1 == 0) {
            val position = (current.position + slope.right) % width
            val count = if (line(position) == '#') current.count + 1 else current.count
            return Current(position, count, slope.down)
        } else {
            return current.copy(linesToSkip = current.linesToSkip - 1)
        }

        lines.foldLeft[Current](Current(0,0,slope.down))(update).count
    }
}

object Main1 extends App {
    import Part1._

    val file = "../../inputs/day3.txt"
    val lines = getInputs(file)
    val slope = Slope(3,1)

    println(countTrees(lines.tail, slope))
}