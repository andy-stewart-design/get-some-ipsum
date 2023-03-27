export type MessageType = "WORDS" | "PARAGRAPHS" | "CHARACTERS" | "AUTO"

export interface Message {
  type: MessageType
  amount?: number
}

export interface ListboxOption {
  value: MessageType
  text: string
  defaultAmount: number
}
