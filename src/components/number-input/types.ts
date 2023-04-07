import type { Writable } from "svelte/store"

export type SpinbuttonRole = "label" | "description" | "error"

export interface NumberAPI {
  groupID: string
  activeValue: Writable<number>
  max: number | string
  min: number | string
  step: number | string
  bigStep: number | string
  placeholder: number | string
  clampValue: () => void
}
