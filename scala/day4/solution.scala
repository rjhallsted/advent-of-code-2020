package com.rjhallsted.adventOfCode2020.day3

import scala.io.Source

object Solution {
    final case class Unvalidated(
        byr: Option[String],
        iyr: Option[String],
        eyr: Option[String],
        hgt: Option[String],
        hcl: Option[String],
        ecl: Option[String],
        pid: Option[String],
        cid: Option[String]
    )

    final case class Passport(
        byr: String,
        iyr: String,
        eyr: String,
        hgt: String,
        hcl: String,
        ecl: String,
        pid: String,
        cid: Option[String]
    )

    type Rule = Passport => Boolean

    private def stringWithIntRange(low: Int, high: Int, value: String): Boolean = value.toInt >= low && value.toInt <= high

    private def isValidHeight(h: String): Boolean = {
        val label = h.substring(h.length - 2)
        val value = h.substring(0, h.length - 2)

        (label, value) match {
            case ("cm", v) if stringWithIntRange(150, 193, v) => true
            case ("in", v) if stringWithIntRange(59, 76, v) => true
            case _ => false
        }
    }

    private def isAllHex(s: String): Boolean =
        s.toCharArray.filterNot(
            (c: Char) => (c >= '0' && c <= '9')
                    || (c >= 'a' && c <= 'f')
        ).length == 0

    private def isAllDigits(s: String): Boolean =
        s.toCharArray.filterNot(
            (c: Char) => c >= '0' && c <= '9'
        ).length == 0

    private def isValidHairColor(h: String): Boolean = 
        h.length == 7 && h.charAt(0) == '#' && isAllHex(h.substring(1))

    val validEyeColors: List[String] = List(
        "amb", "blu", "brn", "gry", "grn", "hzl", "oth"
    )

    val rules: List[Rule] = List(
        (p: Passport) => stringWithIntRange(1920, 2002, p.byr),
        (p: Passport) => stringWithIntRange(2010, 2020, p.iyr),
        (p: Passport) => stringWithIntRange(2020, 2030, p.eyr),
        (p: Passport) => isValidHeight(p.hgt),
        (p: Passport) => isValidHairColor(p.hcl),
        (p: Passport) => validEyeColors.contains(p.ecl),
        (p: Passport) => p.pid.length == 9 && isAllDigits(p.pid)
    )

    def isPassportValid(p: Passport, rules: List[Rule]): Boolean = 
        !(rules.map(_(p)).contains(false))



    def unvalidatedToPassport(p: Unvalidated): Option[Passport] =
        for {
            byr <- p.byr
            iyr <- p.iyr
            eyr <- p.eyr
            hgt <- p.hgt
            hcl <- p.hcl
            ecl <- p.ecl
            pid <- p.pid
        } yield Passport(
            byr, iyr, eyr, hgt, hcl, ecl, pid, p.cid
        )


    def propsToUnvalidated(props: List[String]): Unvalidated = {
        val pairs = props
            .map(_.split(':').toList)
            .foldLeft(Map[String, String]()) { (map, pair) => map + (pair(0) -> pair(1)) }

        Unvalidated(
            byr = pairs.get("byr"),
            iyr = pairs.get("iyr"),
            eyr = pairs.get("eyr"),
            hgt = pairs.get("hgt"),
            hcl = pairs.get("hcl"),
            ecl = pairs.get("ecl"),
            pid = pairs.get("pid"),
            cid = pairs.get("cid")
        )
    }

    def getFullPassports(input: String): List[Passport] =
        input  // TODO: compose the transformations together.
            .split("\n\n")
            .toList
            .map(_.split("\\s").toList)
            .map(propsToUnvalidated(_))
            .map(unvalidatedToPassport(_))
            .flatten

    def countValidPassports(input: String): Int =
        getFullPassports(input)
            .filter(isPassportValid(_, rules))
            .length
}

object Util {
    def getInput(file: String): String = {
        val source = Source.fromFile(file)
        val input = source.getLines.mkString("\n")
        source.close()
        return input
    }
}

object Main extends App {
    val file = "../../inputs/day4.txt"
    val input = Util.getInput(file)
    println(Solution.getFullPassports(input).length)
    println(Solution.countValidPassports(input))
}