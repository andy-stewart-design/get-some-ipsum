<script lang="ts">
  import { getContext } from "svelte"
  import type { NumberAPI } from "./types"
  import { NUMBER_GROUP_CONTEXT } from "../../utils/ui"

  const switchGroupContext = getContext<NumberAPI>(NUMBER_GROUP_CONTEXT)
  const { activeValue, groupID, max, min, step, bigStep, placeholder, clampValue } = switchGroupContext
  const labelID = switchGroupContext ? `nui-${groupID}-label` : ""

  export { className as class }
  let className: string | undefined = ""
  if (className === "") className = undefined

  const role = "spinbutton"
  const id = `nui-${groupID}`

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === "Enter") clampValue()
    else if (e.key === "Home") $activeValue = Number(min)
    else if (e.key === "End") $activeValue = Number(max)
    else if ((e.shiftKey && e.key === "ArrowUp") || e.key === "PageUp") {
      e.preventDefault()
      if ($activeValue === undefined) $activeValue = 0
      $activeValue += Number(bigStep)
    } else if ((e.shiftKey && e.key === "ArrowDown") || e.key === "PageDown") {
      e.preventDefault()
      if ($activeValue === undefined) $activeValue = 0
      $activeValue -= Number(bigStep)
    }
    clampValue()
  }

  let attributes = {
    id,
    type: "number",
    pattern: "[0-9]*",
    min,
    max,
    placeholder: `${placeholder}`,
    step,
    "data-big-step": bigStep,
    role,
  }
</script>

<input
  class={className}
  {...attributes}
  bind:value={$activeValue}
  on:keydown={handleKeyDown}
  on:blur={clampValue}
  aria-labelledby={labelID}
  aria-valuenow={$activeValue}
  aria-valuemin={Number(min)}
  aria-valuemax={Number(max)}
  autocomplete="off"
  style="-moz-appearance: textfield;"
/>

<style scoped>
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
</style>
