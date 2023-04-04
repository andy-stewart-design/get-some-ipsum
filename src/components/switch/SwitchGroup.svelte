<script lang="ts">
  import { setContext } from "svelte"
  import DescriptionContext from "../description/DescriptionContext.svelte"
  import LabelContext from "../label/LabelContext.svelte"
  import { getID, SWITCH_CONTEXT } from "../../utils/ui"
  import type { SwitchAPI } from "./types"

  export { className as class }
  let className = ""

  const uuid = getID()
  const group = `switch-${uuid}`
  const id = `switchgroup-${uuid}`

  setContext<SwitchAPI>(SWITCH_CONTEXT, { groupID: group })
</script>

<LabelContext {group} let:labelledby>
  <DescriptionContext let:describedby>
    <div {id} aria-labelledby={labelledby} aria-describedby={describedby} class={className}>
      <slot />
    </div>
  </DescriptionContext>
</LabelContext>
