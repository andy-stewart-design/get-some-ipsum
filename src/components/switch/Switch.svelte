<script lang="ts">
  import { getContext } from "svelte"
  import { getID, SWITCH_CONTEXT } from "../../utils/ui"
  import type { SwitchAPI } from "./types"

  const switchGroupContext = getContext<SwitchAPI>(SWITCH_CONTEXT)
  const labelID = switchGroupContext ? `nui-${switchGroupContext.groupID}-label` : ""

  export let value: boolean
  export { className as class }
  let className = ""

  const uuid = getID()
  const id = switchGroupContext ? `nui-${switchGroupContext.groupID}` : `${SWITCH_CONTEXT}-${uuid}`
</script>

<button
  on:click|preventDefault={() => (value = !value)}
  {id}
  role="switch"
  class={className}
  aria-checked={value}
  aria-labelledby={labelID}
>
  <slot checked={value} />
</button>
