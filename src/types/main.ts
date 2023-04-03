export type MessageType = "WORDS" | "PARAGRAPHS" | "CHARACTERS" | undefined
export type GenerateMode = "AUTO" | "MANUAL"

export interface Message {
  type: MessageType
  mode: GenerateMode
  amount?: number
  usePeriods: boolean
  useTitleCase: boolean
}

export interface ListboxOption {
  value: MessageType
  text: string
  defaultAmount: number
}
