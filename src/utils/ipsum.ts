import { LoremIpsum } from "lorem-ipsum"
import { Message } from "../types/main"

const lorem = new LoremIpsum({
  sentencesPerParagraph: {
    max: 8,
    min: 4,
  },
  wordsPerSentence: {
    max: 16,
    min: 4,
  },
})

export function generateIpsum() {}

export function manualGenerate(type: Message, amount: number) {
  let ipsum: string | undefined
  if (type === "WORDS") {
    const result = lorem.generateWords(amount)
    const words = result.split(" ")
    ipsum = paragraphFromArray(words)
    // console.log(ipsum)
  } else if (type === "PARAGRAPHS") {
    // splitting at single line break and converting to double line break
    ipsum = lorem
      .generateParagraphs(amount)
      .split(/\r?\n|\r|\n/g)
      .join("\n\n")
    // console.log(ipsum.split(/\r?\n|\r|\n/g))
  } else if (type === "CHARACTERS") {
    ipsum = autoGenerate(amount)
    // console.log(ipsum)
  }
  if (ipsum) return ipsum
}

export function autoGenerate(maxChars: number) {
  // adjusting for the average characters in a sentence
  const chars = maxChars - Math.ceil(maxChars / 60)
  // generating a substantially long array of words
  const ipsum = lorem.generateWords(maxChars * 10).split(" ")
  let currentChars = 0
  const words = []
  let charIndex = 0
  while (currentChars < chars) {
    if (ipsum[charIndex] === undefined) break
    const availableChars = chars - currentChars
    const nextChars = ipsum[charIndex].length
    charIndex++
    if (availableChars >= nextChars) {
      currentChars += ipsum[charIndex].length + 1
      words.push(ipsum[charIndex])
    }
  }

  return paragraphFromArray(words)
}

function paragraphFromArray(words: string[]) {
  let wordIndex = 0
  while (wordIndex < words.length) {
    const max = 14
    const min = 4
    const index = Math.floor(Math.random() * (max - min) + min)
    const sentenceTooLong = wordIndex + index > words.length
    const tooFewWordsLeft = words.length - (wordIndex + index) < 5
    if (sentenceTooLong || tooFewWordsLeft) break
    wordIndex += index
    words[wordIndex] = words[wordIndex] + "."
  }

  const sentence = (words.join(" ") + ".").replace("..", ".")

  return sentence
    .split(". ")
    .map((s) => {
      return s.trim().charAt(0).toLocaleUpperCase() + s.slice(1).toLocaleLowerCase()
    })
    .join(". ")
}
