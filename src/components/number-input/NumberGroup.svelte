<script lang="ts">
  import { setContext, createEventDispatcher } from "svelte"
  import { writable } from "svelte/store"
  import { getID, LIB_PREFIX, NUMBER_GROUP_CONTEXT } from "../../utils/ui"
  import DescriptionContext from "../description/DescriptionContext.svelte"
  import LabelContext from "../label/LabelContext.svelte"
  import type { NumberAPI } from "./types"

  const dispatch = createEventDispatcher()
  $: $activeValue && dispatch("change")

  export { className as class }
  let className: string | undefined = ""
  if (className === "") className = undefined

  export let value: number
  export let max: number | string = 9007199254740991
  export let min: number | string = -max
  export let step: number | string = 1
  export let bigStep: number | string = 10
  export let placeholder: number | string = "0"

  let activeValue = writable(value)
  $: activeValue.set(value)
  $: value = $activeValue

  const role = "spinbutton"
  const uuid = getID()
  const group = `${role}-${uuid}`
  const id = `${LIB_PREFIX}-${role}group-${uuid}`

  const api = {
    groupID: group,
    activeValue,
    max,
    min,
    step,
    bigStep,
    placeholder,
    clampValue,
  }

  setContext<NumberAPI>(NUMBER_GROUP_CONTEXT, api)

  function clampValue() {
    if ($activeValue > Number(max)) $activeValue = Number(max)
    if ($activeValue < Number(min)) $activeValue = Number(min)
  }
</script>

<LabelContext {group}>
  <DescriptionContext {group} let:describedby>
    <div {id} aria-describedby={describedby} class={className}>
      <slot />
    </div>
  </DescriptionContext>
</LabelContext>
