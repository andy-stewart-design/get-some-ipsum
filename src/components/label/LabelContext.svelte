<script lang="ts">
  import { LABEL_CONTEXT_NAME, type ContextProvider } from "../../utils/ui"
  import { setContext } from "svelte"

  let labelIDs: string[] = []

  $: labelledby = labelIDs.length > 0 ? `${LABEL_CONTEXT_NAME}-${labelIDs[0]}` : undefined

  $: if (labelIDs.length > 1) {
    throw new Error("Each element should only have one <Description />.")
  }

  const register = (ID: string) => {
    labelIDs = [...labelIDs, ID]
    console.log("registering label")
    return () => {
      labelIDs = labelIDs.filter((descrID) => descrID !== ID)
    }
  }

  setContext<ContextProvider>(LABEL_CONTEXT_NAME, { register })
</script>

<slot {labelledby} />
