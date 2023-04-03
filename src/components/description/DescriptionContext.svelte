<script lang="ts">
  import { DESCR_CONTEXT_NAME, type ContextProvider } from "../../utils/ui"
  import { setContext } from "svelte"

  let descrIDs: string[] = []

  $: describedby = descrIDs.length > 0 ? `${DESCR_CONTEXT_NAME}-${descrIDs[0]}` : undefined

  $: if (descrIDs.length > 1) {
    throw new Error("Each element should only have one <Description />.")
  }

  const register = (ID: string) => {
    console.log("registering description")
    descrIDs = [...descrIDs, ID]
    return () => {
      descrIDs = descrIDs.filter((descrID) => descrID !== ID)
    }
  }

  setContext<ContextProvider>(DESCR_CONTEXT_NAME, { register })
</script>

<slot {describedby} />
