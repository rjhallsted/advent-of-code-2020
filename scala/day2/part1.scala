package com.rjhallsted.adventOfCode2020.day2

import scala.io.Source
import scala.util.Try

object Part1 {
    def sequence[T](in: List[Option[T]]): Option[List[T]] = if (in contains None) None else Some(in.flatten)

    def getInputs(filepath: String): Option[List[String]] = try {
        val lines = Source.fromFile(filepath).getLines().toList
        Some(lines) 
    } catch {
        case e: Exception => None
    }

    final case class PolicyPair(
        password: String,
        p1: Int,
        p2: Int,
        char: Char
    )

    def consumeUntil(line: String, char: Char, index: Int): Option[(String, Int)] = {

        def inner(index: Int, current: String): Option[(String, Int)] = {
            if (index == line.length) {
                return None
            } else if (line(index) == char) {
                return Some((current, index))
            } else {
                return inner(index + 1, current + line(index))
            }
        }

        inner(index, "")
    }

    def lineToPolicyPair(line: String): Option[PolicyPair] = for {
        (p1, index1) <- consumeUntil(line, '-', 0)
        (p2, index2) <- consumeUntil(line, ' ', index1 + 1)
        (char, index3) <- consumeUntil(line, ':', index2 + 1)
    } yield PolicyPair(
            password = line.substring(index3 + 1),
            p1 = p1.toInt,
            p2 = p2.toInt,
            char = char.charAt(0)
        )

    def countValidPairs(pairs: List[PolicyPair], isValid: (PolicyPair) => Boolean): Int = pairs.map(isValid(_)).count(_ == true)

    def isValid(pair: PolicyPair): Boolean = {
        val count = pair.password.count(_ == pair.char)
        count >= pair.p1 && count <= pair.p2
    }

    def getCount(isValid: (PolicyPair) => Boolean): Option[Int] = {
        val file = "../../inputs/day2.txt"
        for {
            inputs <- Part1.getInputs(file)
            pairs <- sequence(inputs.map(lineToPolicyPair).toList)
        } yield countValidPairs(pairs, isValid)
    }

    def printValidCount(isValid: (PolicyPair) => Boolean): Unit = {
        val result: String = (Part1.getCount(isValid)) match {
            case Some(res) => res.toString
            case None => "Something broke"
        }
        println(result)
    }
}

object Main1 extends App {
    Part1.printValidCount(Part1.isValid)
}