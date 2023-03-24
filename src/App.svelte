<script lang="ts">
  import "./app.css"

  const postMsg = (type: string) => parent.postMessage({ pluginMessage: { type } }, "*")

  let elementIsSelected: boolean
  let selectionIsText: boolean
  $: showUI = elementIsSelected && selectionIsText

  onmessage = (event) => {
    if (event.data.pluginMessage.selectedElementCount !== undefined) {
      elementIsSelected = event.data.pluginMessage.selectedElementCount > 0
      selectionIsText = event.data.pluginMessage.isTextSelected
    }
  }
</script>

<div class="flex flex-col justify-center items-center gap-4 w-full h-full p-4">
  {#if showUI}
    <p class="text-xs text-center max-w-[200px]">Generate the perfect amount of text to fit the layer’s frame</p>
    <button
      class="w-full bg-gradient-to-r from-blue-700 to-purple-700 rounded py-2 px-2"
      on:click={() => postMsg("AUTO")}
    >
      Autogenerate
    </button>
  {:else}
    <svg class="opacity-40" width="80" height="80" viewBox="0 0 260 260" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path class="cursor" d="M192 192L212 252L222.833 222.833L252 212L192 192Z" fill="currentColor" />
      <rect
        class="selection"
        x="9"
        y="9"
        width="200"
        height="200"
        stroke="currentColor"
        stroke-width="4"
        stroke-miterlimit="2.61313"
        stroke-dasharray="8 8"
      />
    </svg>
    <p class="text-xs text-white/60 text-center max-w-[160px]">Select at least one text layer to update</p>
  {/if}
</div>

<style>
  .cursor {
    animation: cursor 2.5s infinite alternate cubic-bezier(0.65, 0, 0.35, 1);
  }

  .selection {
    animation: select 2.5s infinite alternate cubic-bezier(0.65, 0, 0.35, 1);
  }

  @keyframes cursor {
    0%,
    20% {
      translate: -160px -160px;
    }
    80%,
    100% {
      translate: 0px 0px;
    }
  }

  @keyframes select {
    0%,
    20% {
      width: 40px;
      height: 40px;
    }
    80%,
    100% {
      width: 200px;
      height: 200px;
    }
  }
</style>
