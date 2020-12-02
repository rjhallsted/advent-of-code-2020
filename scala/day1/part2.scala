package com.rjhallsted.adventOfCode2020.day1

object Part2 {
    def find3NumbersThatSumTo(goal: Int, numbers: Array[Int]): Option[(Int, Int, Int)] = {
        def inner(currentIndex: Int): Option[(Int, Int, Int)] = {
            if (currentIndex == numbers.length - 3) {
                return None
            }

            val subgoal = goal - numbers(currentIndex)
            (Part1.find2NumbersThatSumTo(subgoal, numbers, currentIndex + 1)) match {
                case (Some(x)) => Some((numbers(currentIndex), x._1, x._2))
                case (None) => inner(currentIndex + 1)
            }
        }

        inner(0)
    }
}

object Main2 extends App {
    val file = "../../inputs/day1.txt"
    val goal = 2020
    val inputs = Part1.getInputs(file).sorted

    (Part2.find3NumbersThatSumTo(goal, inputs)) match {
        case (Some(x)) => println(f"${x._1}, ${x._2}, ${x._3} -> ${x._1 * x._2 * x._3}") 
        case (None) => println("No solution")
    }
}