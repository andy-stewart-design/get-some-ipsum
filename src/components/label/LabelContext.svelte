<script lang="ts">
  import { getContext, setContext } from "svelte"
  import { LABEL_CONTEXT_NAME, LIB_PREFIX } from "../../utils/ui"
  import type { ContextProvider } from "../../utils/ui"

  export let group: string
  const parentContext = getContext<ContextProvider>(LABEL_CONTEXT_NAME)
  let labelIDs: string[] = []

  $: labelledby = setLabelledBy(labelIDs)

  $: if (labelIDs.length > 1) {
    throw new Error("Each element should only have one <Label />.")
  }

  const register = (ID: string) => {
    const newIDs = [...labelIDs, ID]
    labelIDs = newIDs
    return () => {
      labelIDs = labelIDs.filter((descrID) => descrID !== ID)
    }
  }

  if (parentContext) {
    const fullGroup = `${parentContext.group}-${group}`
    setContext(LABEL_CONTEXT_NAME, { register, group: fullGroup })
  } else {
    setContext(LABEL_CONTEXT_NAME, { register, group })
  }

  function setLabelledBy(IDs: string[]) {
    if (IDs.length > 0) {
      if (parentContext) {
        return `${LIB_PREFIX}-${parentContext.group}-${group}-label`
      } else {
        return `${LIB_PREFIX}-${group}-label`
      }
    } else return undefined
  }
</script>

<slot {labelledby} />
