<script lang="ts">
  import "./app.css"
  import FallbackUi from "./components/FallbackUI.svelte"
  import Listbox from "./components/Listbox.svelte"
  import { ListboxOption, MessageType } from "./types/main"

  let elementIsSelected: boolean
  let selectionIsText: boolean
  $: showUI = elementIsSelected && selectionIsText

  let amountIsDefault = true
  let amount: number = 25

  let selectedItem: ListboxOption
  const categories: ListboxOption[] = [
    { value: "WORDS", text: "Words", defaultAmount: 25 },
    { value: "CHARACTERS", text: "Characters", defaultAmount: 100 },
    { value: "PARAGRAPHS", text: "Paragraphs", defaultAmount: 2 },
  ]

  const postMsg = (type: MessageType, amount?: number) => parent.postMessage({ pluginMessage: { type, amount } }, "*")

  onmessage = (event) => {
    if (event.data.pluginMessage.selectedElementCount !== undefined) {
      elementIsSelected = event.data.pluginMessage.selectedElementCount > 0
      selectionIsText = event.data.pluginMessage.isTextSelected
    }
  }
</script>

<div class="flex flex-col justify-center items-center w-full h-full p-4">
  {#if showUI}
    <div
      class="grow flex flex-col justify-center items-center gap-4 w-full border-b border-gray-900/10 dark:border-white/10"
    >
      <div class="flex w-full gap-2">
        <input
          class="w-20 bg-transparent border border-gray-900/10 dark:border-white/10 px-2 dark:focus:border-blue-600 selection:bg-figma-gray-800"
          type="number"
          bind:value={amount}
          on:input={() => amountIsDefault && (amountIsDefault = false)}
        />
        <Listbox
          bind:selectedItem
          on:change={() => amountIsDefault && (amount = selectedItem.defaultAmount)}
          {categories}
        />
      </div>
      <button
        class="w-full bg-blue-600 py-2 px-2 focus:outline-blue-600 focus:outline-1"
        on:click={() => postMsg(selectedItem.value, amount)}
      >
        Generate
      </button>
    </div>
    <div class="grow flex flex-col justify-center items-center gap-4 w-full">
      <p class="text-xs text-center max-w-[200px]">Generate the perfect amount of text to fit the layer’s frame</p>
      <button
        class="w-full bg-blue-600 py-2 px-2 focus:outline-blue-600 focus:outline-1"
        on:click={() => postMsg("AUTO")}
      >
        Autogenerate
      </button>
    </div>
  {:else}
    <FallbackUi />
  {/if}
</div>
