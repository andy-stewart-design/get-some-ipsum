import { LoremIpsum } from "lorem-ipsum"
import { MessageType, GenerateMode, Message } from "../types/main"

export const lorem = new LoremIpsum({
  sentencesPerParagraph: {
    max: 8,
    min: 4,
  },
  wordsPerSentence: {
    max: 16,
    min: 4,
  },
})

export function generateCharacters(charCount: number) {
  const chars = charCount - Math.ceil(charCount / 60)
  const ipsum = lorem.generateWords(chars * 10).split(" ")

  // Generate array of lorem ipsum with the desired number of characters
  let currentChars = 0
  const words: string[] = []
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

  return words
}
