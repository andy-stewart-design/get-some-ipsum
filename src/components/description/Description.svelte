<script lang="ts">
  import { DESCR_CONTEXT_NAME, getID, type ContextProvider } from "../../utils/ui"
  import { getContext } from "svelte"

  export { className as class }
  let className: string

  const contextProvider = getContext<ContextProvider>(DESCR_CONTEXT_NAME)
  const uuid = getID()
  const id = `${DESCR_CONTEXT_NAME}-${uuid}`

  if (!contextProvider) {
    throw new Error("You used a <Description /> component, but it is not inside a relevant parent.")
  }

  contextProvider.register(uuid)
</script>

<div {id} class={className}>
  <slot />
</div>
