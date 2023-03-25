import type { Action } from "svelte/types/runtime/action"

export const focusOnMount: Action<HTMLElement, { (e: KeyboardEvent): void }> = (node, callback?) => {
  node.focus()
  if (callback) window.addEventListener("keydown", callback)
  return {
    destroy: () => {
      if (callback) window.removeEventListener("keydown", callback)
    },
  }
}
