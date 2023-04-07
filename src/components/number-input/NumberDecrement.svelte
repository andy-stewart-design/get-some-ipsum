<script lang="ts">
  import { getContext } from "svelte"
  import { LIB_PREFIX, NUMBER_GROUP_CONTEXT } from "../../utils/ui"
  import type { NumberAPI } from "./types"

  const switchGroupContext = getContext<NumberAPI>(NUMBER_GROUP_CONTEXT)
  const { activeValue, groupID, step, bigStep, clampValue } = switchGroupContext

  export { className as class }
  let className: string | undefined = ""
  if (className === "") className = undefined

  function incValue(e: MouseEvent) {
    if ($activeValue === undefined) $activeValue = 0
    if (e.shiftKey) $activeValue -= Number(bigStep)
    else $activeValue -= Number(step)
    clampValue()
  }

  const id = `${LIB_PREFIX}-${groupID}-decrement`
</script>

<div role="button" {id} class={className} on:click={incValue} aria-hidden>
  <slot />
</div>
