# Jeopardy Player

## `game.json` specification

`game.json` must have the following keys.

* A `game` key that contains an object with:
  * A `single` key that contains an array of categories, where each category contains:
    * A `category` key that contains the name of the category
    * A `clues` key that contains an array of clues, where each clue contains:
      * A `value` key that contains the integer dollar value of the clue
      * A `clue` key that contains the clue
      * A `solution` key that contains the solution
      * An optional `dailyDouble` key, set to `true` if the clue is a daily double
  * A `double` key that contains an array of categories, structured like the `single` round.
  * A `final` key that contains an object with:
    * A `category` key that contains the Final Jeopardy category
    * A `clue` key that contains the Final Jeopardy clue
    * A `solution` key that contains the Final Jeopardy solution
