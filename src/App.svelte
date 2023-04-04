<script lang="ts">
  import "./app.css"
  import FallbackUi from "./components/FallbackUI.svelte"
  import Label from "./components/label/Label.svelte"
  import Listbox from "./components/Listbox.svelte"
  import RadioGroup from "./components/radio-group/RadioGroup.svelte"
  import RadioOption from "./components/radio-group/RadioOption.svelte"
  import Switch from "./components/switch/Switch.svelte"
  import SwitchGroup from "./components/switch/SwitchGroup.svelte"
  import { GenerateMode, ListboxOption, MessageType } from "./types/main"

  let showUI: boolean
  let amountIsDefault = true
  let amount: number = 25

  let selectedItem: ListboxOption
  const categories: ListboxOption[] = [
    { value: "WORDS", text: "Words", defaultAmount: 25 },
    { value: "CHARACTERS", text: "Characters", defaultAmount: 100 },
    { value: "PARAGRAPHS", text: "Paragraphs", defaultAmount: 2 },
  ]

  onmessage = (event) => {
    if (event.data.pluginMessage.textNodeCount !== undefined) {
      showUI = event.data.pluginMessage.textNodeCount > 0
    }
  }

  let generateMode: GenerateMode = "AUTO"
  let usePeriods = true
  let useTitleCase = false

  const postMsg = () =>
    parent.postMessage(
      { pluginMessage: { type: selectedItem?.value, amount, mode: generateMode, usePeriods, useTitleCase } },
      "*"
    )
</script>

<div class="flex flex-col w-full h-full">
  {#if showUI}
    <div class="p-4">
      <RadioGroup bind:value={generateMode} on:change={() => console.log("size updated")} class="flex w-full">
        <RadioOption value={"AUTO"} let:checked class="group grow">
          <span
            class="inline-block text-center w-full py-2 px-3 border border-white/10 group-last-of-type:border-l-0 active:bg-blue-500"
            class:active={checked}>Auto</span
          >
        </RadioOption>
        <RadioOption value={"MANUAL"} let:checked class="group grow">
          <span
            class="inline-block text-center w-full py-2 px-3 border border-white/10 group-last-of-type:border-l-0 active:bg-blue-500"
            class:active={checked}>Manual</span
          >
        </RadioOption>
      </RadioGroup>
    </div>
    <div class="grow flex flex-col gap-4 w-full p-4 pt-0">
      <div class="flex h-12">
        {#if generateMode === "MANUAL"}
          <div class="flex w-full h-full gap-2">
            <input
              class="w-20 bg-transparent border border-gray-900/10 dark:border-white/10 px-2 dark:focus:border-blue-500 selection:bg-figma-gray-800"
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
        {:else}
          <div class="flex justify-center items-center grow border border-gray-900/10 dark:border-white/10 px-2">
            <p class="text-xs text-center max-w-[248px]">
              Automatically generate the perfect amount of text to fit the layer’s frame
            </p>
          </div>
        {/if}
      </div>
      <SwitchGroup class="flex justify-between items-center">
        <Label visible class="grow">Use Periods</Label>
        <Switch bind:value={usePeriods} class="group w-14">
          <span
            class="flex w-full h-full rounded-full border border-gray-900/10 dark:border-white/10 p-1 transition-colors group-aria-checked:bg-blue-500"
          >
            <span
              class="inline-block w-6 h-6 bg-blue-500 rounded-full transition-all group-aria-checked:translate-x-[22px] group-aria-checked:bg-white"
            />
          </span>
        </Switch>
      </SwitchGroup>
      <SwitchGroup class="flex justify-between items-center">
        <Label visible class="grow">Title Case</Label>
        <Switch bind:value={useTitleCase} class="group w-14">
          <span
            class="flex w-full h-full rounded-full border border-gray-900/10 dark:border-white/10 p-1 transition-colors group-aria-checked:bg-blue-500"
          >
            <span
              class="inline-block w-6 h-6 bg-blue-500 rounded-full transition-all group-aria-checked:translate-x-[22px] group-aria-checked:bg-white"
            />
          </span>
        </Switch>
      </SwitchGroup>
    </div>
    <div
      class="flex flex-col justify-center items-center gap-4 w-full p-4 border-t border-gray-900/10 dark:border-white/10"
    >
      <button class="w-full bg-blue-500 py-2 px-2 focus:outline-blue-500 focus:outline-1" on:click={postMsg}>
        Generate
      </button>
    </div>
  {:else}
    <FallbackUi />
  {/if}
</div>
