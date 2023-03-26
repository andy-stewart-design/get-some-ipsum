export type Message = "WORDS" | "PARAGRAPHS" | "CHARACTERS" | "AUTO"

export interface ListboxOption {
  value: Message
  text: string
  defaultAmount: number
}
