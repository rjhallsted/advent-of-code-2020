import scala.io.Source
object Part1 extends App {
    def getInputs(filepath: String): List[Int] =    
        Source.fromFile(filepath).getLines().map(_.toInt).toList

    def find2NumbersThatSumTo(goal: Int, numbers: List[Int]): Option[(Int, Int)] = {
        def checkAt(start: Int, end: Int): Option[(Int, Int)] = {
            if (start == end) {
                return None
            }

            val sum = numbers(start) + numbers(end)
            if (sum == goal) {
                return Some((numbers(start), numbers(end)))
            } else if (sum < goal) {
                return checkAt(start + 1, end)
            } else {
                return checkAt(start, end - 1)
            }
        }

        checkAt(0, numbers.length - 1)
    }

    val file = "../../inputs/day1.txt"
    val goal = 2020
    val inputs = getInputs(file).sorted

    (find2NumbersThatSumTo(goal, inputs)) match {
        case (Some(x)) => println(f"${x._1}, ${x._2} -> ${x._1 * x._2}") 
        case (None) => println("No solution")
    }
}