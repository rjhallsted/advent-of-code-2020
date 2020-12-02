import scala.io.Source

object Part1 {
    def getInputs(filepath: String): List[String] =  Source.fromFile(filepath).getLines().toList

    final case class PolicyPair(
        password: String,
        p1: Int,
        p2: Int,
        char: Char
    )

    def consumeUntil(line: String, char: Char, index: Int): (String, Int) = {
        def inner(index: Int, current: String): (String, Int) = if (line(index) == char) (current, index) else inner(index + 1, current + line(index))

        inner(index, "")
    }

    def lineToPolicyPair(line: String): PolicyPair = {
        val (p1, index1) = consumeUntil(line, '-', 0)
        val (p2, index2) = consumeUntil(line, ' ', index1 + 1)
        val (char, index3) = consumeUntil(line, ':', index2 + 1)

        PolicyPair(
            password = line.substring(index3 + 1),
            p1 = p1.toInt,
            p2 = p2.toInt,
            char = char.charAt(0)
        )
    }

    def countValidPairs(pairs: List[PolicyPair], isValid: (PolicyPair) => Boolean): Int = pairs.map(isValid(_)).count(_ == true)

    def isValid(pair: PolicyPair): Boolean = {
        val count = pair.password.count(_ == pair.char)
        count >= pair.p1 && count <= pair.p2
    }
}

object Main1 extends App {
    val file = "../../inputs/day2.txt"
    val inputs = Part1.getInputs(file)
    
    val count = Part1.countValidPairs(
        inputs.map(Part1.lineToPolicyPair).toList,
        Part1.isValid
    )

    println(count)
}