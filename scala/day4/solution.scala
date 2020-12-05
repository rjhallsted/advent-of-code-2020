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

    def countFullPassports(input: String): Int =
        input  // TODO: compose the transformations together.
            .split("\n\n")
            .toList
            .map(_.split("\\s").toList)
            .map(propsToUnvalidated(_))
            .map(unvalidatedToPassport(_))
            .flatten
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
    println(Solution.countFullPassports(input))
}