<script lang="ts">
  import { setContext } from "svelte"
  import DescriptionContext from "../description/DescriptionContext.svelte"
  import LabelContext from "../label/LabelContext.svelte"
  import { getID, SWITCH_CONTEXT } from "../../utils/ui"
  import type { SwitchAPI } from "./types"

  export let value: boolean
  export { className as class }
  let className = ""

  const uuid = getID()
  const id = `${SWITCH_CONTEXT}-${uuid}`

  function updateValue() {
    value = !value
  }
  function handleKeydown(e: KeyboardEvent): void {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault()
    }
    updateValue()
  }
  setContext<SwitchAPI>("switchGroupAPI", { groupID: id, updateValue, handleKeydown })
</script>

<DescriptionContext let:describedby>
  <LabelContext let:labelledby>
    <div {id} role="radiogroup" aria-labelledby={labelledby} aria-describedby={describedby} class={className}>
      <slot />
    </div>
  </LabelContext>
</DescriptionContext>
