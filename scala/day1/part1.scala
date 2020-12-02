package com.rjhallsted.adventOfCode2020.day1

import scala.io.Source

object Part1 {
    def getInputs(filepath: String): List[Int] =    
        Source.fromFile(filepath).getLines().map(_.toInt).toList

    def find2NumbersThatSumTo(goal: Int, numbers: List[Int], start: Int): Option[(Int, Int)] = {
        def inner(start: Int, end: Int): Option[(Int, Int)] = {
            if (start == end) {
                return None
            }

            val sum = numbers(start) + numbers(end)
            if (sum == goal) {
                return Some((numbers(start), numbers(end)))
            } else if (sum < goal) {
                return inner(start + 1, end)
            } else {
                return inner(start, end - 1)
            }
        }

        inner(start, numbers.length - 1)
    }
}

object Main1 extends App {
    val file = "../../inputs/day1.txt"
    val goal = 2020
    val inputs = Part1.getInputs(file).sorted

    (Part1.find2NumbersThatSumTo(goal, inputs, 0)) match {
        case (Some(x)) => println(f"${x._1}, ${x._2} -> ${x._1 * x._2}") 
        case (None) => println("No solution")
    }
}