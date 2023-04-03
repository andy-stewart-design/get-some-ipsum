import { LoremIpsum } from "lorem-ipsum"
import { MessageType, GenerateMode, Message } from "../types/main"

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

export function generateIpsum(msg: Message, amount: number) {
  if (amount) {
    if (msg.mode === "MANUAL") {
      let ipsum: string | undefined
      if (msg.type === "WORDS") {
        const result = lorem.generateWords(amount)
        const words = result.split(" ")
        ipsum = paragraphFromArray(words, msg)
      } else if (msg.type === "PARAGRAPHS") {
        ipsum = lorem
          .generateParagraphs(amount)
          .split(/\r?\n|\r|\n/g)
          .join("\n\n")
      } else if (msg.type === "CHARACTERS") {
        ipsum = autoGenerate(amount, msg)
      }
      if (ipsum) return ipsum
    } else if (msg.mode === "AUTO") {
      return autoGenerate(amount, msg)
    }
  } else {
    console.error(`Get Some Ipsum: must provide amount to generate ${msg.type.toLocaleLowerCase()}`)
  }
}

function autoGenerate(maxChars: number, msg: Message) {
  const chars = maxChars - Math.ceil(maxChars / 60)
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

  return paragraphFromArray(words, msg)
}

function paragraphFromArray(words: string[], msg: Message) {
  if (msg.usePeriods) {
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
  } else return words.join(" ")
}
