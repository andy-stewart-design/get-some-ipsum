<script lang="ts">
  import { LABEL_CONTEXT_NAME, type ContextProvider } from "../../utils/ui"
  import { getContext, setContext } from "svelte"

  export let group: string | undefined = undefined
  const parentContext = getContext<ContextProvider>(LABEL_CONTEXT_NAME)
  let labelIDs: string[] = []

  $: labelledby = setLabelledBy(labelIDs)

  $: if (labelIDs.length > 1) {
    throw new Error("Each element should only have one <Description />.")
  }

  const register = (ID: string) => {
    const newIDs = [...labelIDs, ID]
    labelIDs = newIDs
    // console.log("registering label")
    return () => {
      labelIDs = labelIDs.filter((descrID) => descrID !== ID)
    }
  }

  if (parentContext) {
    const fullGroup = `${parentContext.group}-${group}`
    setContext("nui-label", { register, group: fullGroup })
  } else {
    setContext("nui-label", { register, group })
  }

  function setLabelledBy(IDs: string[]) {
    if (IDs.length > 0) {
      if (parentContext) {
        return `nui-${parentContext.group}-${group}-label`
      } else {
        return `nui-${group}-label`
      }
    } else return undefined
  }

  // setContext<ContextProvider>(LABEL_CONTEXT_NAME, { register })
</script>

<slot {labelledby} />
