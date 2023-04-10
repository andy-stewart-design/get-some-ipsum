import { generateCharacters } from "./ipsum"
import type { Message } from "../types/main"

const smallWords = /^(a|ac|ad|at|dui|ea|est|et|eu|ex|id|in|non|nom|nec|sed|sem|sit|ut)$/i

export const formatSentences = (wordArray: string[], msg: Message) => {
  // Format the words properly for title case or sentence case
  const formattedWords = wordArray.map((word, i) => {
    if (msg.useTitleCase) {
      if (smallWords.test(word) && i !== 0) {
        return word.toLocaleLowerCase()
      } else return word.charAt(0).toLocaleUpperCase() + word.slice(1).toLocaleLowerCase()
    } else return word.toLocaleLowerCase()
  })

  if (msg.usePeriods) {
    let wordIndex = 0
    const max = 14
    const min = 4

    while (wordIndex < formattedWords.length) {
      const index = Math.floor(Math.random() * (max - min) + min)
      const sentenceTooLong = wordIndex + index > formattedWords.length
      const tooFewWordsLeft = formattedWords.length - (wordIndex + index) < 5
      if (sentenceTooLong || tooFewWordsLeft) break
      wordIndex += index
      formattedWords[wordIndex] = formattedWords[wordIndex] + "."
      const nextWord = formattedWords[wordIndex + 1]
      formattedWords[wordIndex + 1] = nextWord.trim().charAt(0).toLocaleUpperCase() + nextWord.slice(1)
    }

    formattedWords[0] = formattedWords[0].charAt(0).toLocaleUpperCase() + formattedWords[0].slice(1)
    return formattedWords.join(" ") + "."
  }

  formattedWords[0] = formattedWords[0].charAt(0).toLocaleUpperCase() + formattedWords[0].slice(1)
  return formattedWords.join(" ")
}

export const getFreeformCharCount = async (node: TextNode, msg?: Message) => {
  // get the height and width of the active Text Node
  const node_width = node.width
  const node_height = node.height

  // generate an arbitrarily and sufficiently long array of ipsum
  const ipsumArray = generateCharacters(node_width)

  // create a Text Node and make its style match the active Text Node
  const text = figma.createText()
  text.fontName = node.fontName
  text.fontSize = node.fontSize
  text.textCase = node.textCase
  text.letterSpacing = node.letterSpacing
  text.lineHeight = node.lineHeight

  // calculate the width of a space in the current typeface
  text.characters = ipsumArray[0] + " " + ipsumArray[1]
  const word_height = text.height
  const two_word_width = text.width
  text.characters = ipsumArray[0]
  const first_word_width = text.width
  text.characters = ipsumArray[1]
  const second_word_width = text.width
  const space_width = two_word_width - first_word_width - second_word_width

  // create an array with the widths of all of the generated ipsum text
  const word_widths = ipsumArray.map((word) => {
    text.characters = word
    const word_width = text.width
    return word_width + space_width
  })

  // garbage collection
  text.remove()

  // calculate how many words fit in the first line of the Node
  let line_length = 0
  let index = 0
  while (line_length < node_width) {
    line_length += word_widths[index]
    index++
  }

  // estimate and return the number of characters that can fit in the Text Node
  const first_line = ipsumArray.splice(0, index - 1)
  const one_line_character_count = first_line.join(" ").length
  const line_count = Math.floor(node_height / word_height)
  return one_line_character_count * line_count
}
