<script lang="ts">
  import { getContext, setContext } from "svelte"
  import { DESCR_CONTEXT_NAME, LIB_PREFIX } from "../../utils/ui"
  import type { ContextProvider } from "../../utils/ui"

  export let group: string
  const parentContext = getContext<ContextProvider>(DESCR_CONTEXT_NAME)
  let descrIDs: string[] = []

  $: describedby = setDescribedBy(descrIDs)

  $: if (descrIDs.length > 1) {
    throw new Error("Each element should only have one <Description />.")
  }

  const register = (ID: string) => {
    const newIDs = [...descrIDs, ID]
    descrIDs = newIDs
    return () => {
      descrIDs = descrIDs.filter((descrID) => descrID !== ID)
    }
  }

  if (parentContext) {
    const fullGroup = `${parentContext.group}-${group}`
    setContext(DESCR_CONTEXT_NAME, { register, group: fullGroup })
  } else {
    setContext(DESCR_CONTEXT_NAME, { register, group })
  }

  function setDescribedBy(IDs: string[]) {
    if (IDs.length > 0) {
      if (parentContext) {
        return `${LIB_PREFIX}-${parentContext.group}-${group}-description`
      } else {
        return `${LIB_PREFIX}-${group}-description`
      }
    } else return undefined
  }
</script>

<slot {describedby} />
