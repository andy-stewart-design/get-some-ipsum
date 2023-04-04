<script lang="ts">
  import { getID, LABEL_CONTEXT_NAME, type ContextProvider } from "../../utils/ui"
  import { getContext } from "svelte"

  export let visible = false
  export { className as class }
  let className: string = ""

  const contextProvider = getContext<ContextProvider>(LABEL_CONTEXT_NAME)
  const uuid = getID()
  const id = `nui-${contextProvider.group}-label`

  if (!contextProvider) {
    throw new Error("You used a <Description /> component, but it is not inside a relevant parent.")
  }

  const labelFor = `nui-${contextProvider.group}`
  contextProvider.register(uuid)
</script>

<label {id} for={labelFor} class={className} class:sr-only={!visible}>
  <slot />
</label>

<style>
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }
</style>
