import type { Writable } from "svelte/store"

export interface OptionsArray {
  val: string | number
  uuid: string
  node?: HTMLElement
}

export interface RadioGroupAPI {
  groupID: string
  activeIndex: Writable<number>
  activeValue: Writable<string | number>
  registerOption: (uuid: string, value: string | number) => number
  registerNode: (uuid: string, node: HTMLElement) => void
  unregisterOption: (uuid: string) => void
  handleClick: (e: KeyboardEvent) => void
  setFocus: () => void
}
