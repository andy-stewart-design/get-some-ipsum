<script lang="ts">
  import { getID, RADIO_GROUP_CONTEXT } from "../../utils/ui"
  import { onDestroy, setContext, createEventDispatcher } from "svelte"
  import { writable } from "svelte/store"
  import DescriptionContext from "../description/DescriptionContext.svelte"
  import LabelContext from "../label/LabelContext.svelte"
  import type { OptionsArray, RadioGroupAPI } from "./types"

  const dispatch = createEventDispatcher()

  export { className as class }
  let className: string = ""

  export let value: string | number
  let activeValue = writable(value)
  $: activeValue.set(value)
  $: value = $activeValue

  let activeIndex = writable(0)
  let options: OptionsArray[] = []

  const uuid = getID()
  const id = `${RADIO_GROUP_CONTEXT}-${uuid}`

  function setFocus(): void {
    options[$activeIndex].node?.focus()
  }

  function registerOption(uuid: string, val: string | number): number {
    options.push({ uuid, val })
    const i = options.findIndex((obj) => obj.uuid === uuid)
    if (val === $activeValue) activeIndex.set(i)
    return i
  }

  function registerNode(uuid: string, node: HTMLElement) {
    const index = options.findIndex((obj) => obj.uuid === uuid)
    let option = options[index]
    options[index] = { ...option, node }
  }

  function unregisterOption(uuid: string): void {
    const i = options.findIndex((obj) => obj.uuid === uuid)
    options.splice(i, 1)
  }

  function handleClick(e: KeyboardEvent): void {
    const maxIndex = options.length - 1
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault()
      if ($activeIndex >= maxIndex) $activeIndex = 0
      else $activeIndex++
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault()
      if ($activeIndex <= 0) $activeIndex = maxIndex
      else $activeIndex--
    }
    $activeValue = options[$activeIndex].val
    setFocus()
    dispatch("change")
  }

  const api = {
    groupID: uuid,
    activeIndex,
    activeValue,
    registerOption,
    registerNode,
    unregisterOption,
    handleClick,
    setFocus,
  }

  setContext<RadioGroupAPI>(RADIO_GROUP_CONTEXT, api)

  onDestroy(() => (options = []))
</script>

<DescriptionContext let:describedby>
  <LabelContext let:labelledby>
    <div {id} role="radiogroup" aria-labelledby={labelledby} aria-describedby={describedby} class={className}>
      <slot />
    </div>
  </LabelContext>
</DescriptionContext>
