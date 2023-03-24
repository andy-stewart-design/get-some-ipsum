import { LoremIpsum } from "lorem-ipsum"

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

export function getSomeIpsum(maxChars: number) {
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

  let wordIndex = 0
  let testIndex = 0
  while (wordIndex < words.length) {
    const max = 14
    const min = 4
    const index = Math.floor(Math.random() * (max - min) + min)
    const sentenceTooLong = wordIndex + index > words.length
    const tooFewWordsLeft = words.length - (wordIndex + index) < 5
    if (sentenceTooLong || tooFewWordsLeft) break
    wordIndex += index
    words[wordIndex] = words[wordIndex] + "."
    testIndex++
  }

  const sentence = (words.join(" ") + ".").replace("..", ".")

  return sentence
    .split(". ")
    .map((s) => {
      return s.trim().charAt(0).toLocaleUpperCase() + s.slice(1).toLocaleLowerCase()
    })
    .join(". ")
}
