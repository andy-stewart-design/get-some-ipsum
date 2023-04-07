<script lang="ts">
  import { getContext } from "svelte"
  import { getID, LABEL_CONTEXT_NAME, srOnly, LIB_PREFIX } from "../../utils/ui"
  import type { ContextProvider } from "../../utils/ui"

  export let hidden = false
  export { className as class }
  let className: string | undefined = ""
  if (className === "") className = undefined

  const role = "label"
  const contextProvider = getContext<ContextProvider>(LABEL_CONTEXT_NAME)
  const uuid = getID()
  const id = `${LIB_PREFIX}-${contextProvider.group}-${role}`

  if (!contextProvider) {
    throw new Error("You used a <Description /> component, but it is not inside a relevant parent.")
  }

  const labelFor = `${LIB_PREFIX}-${contextProvider.group}`
  contextProvider.register(uuid)
</script>

<label {id} for={labelFor} class={className} style={hidden ? srOnly : undefined}>
  <slot />
</label>
