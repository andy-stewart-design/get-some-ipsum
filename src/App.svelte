<script lang="ts">
	// TODO: Make into components
	// TODO: simplify TW theme colors
	import './app.css';
	import FallbackUi from './components/FallbackUI.svelte';
	import Label from './components/label/Label.svelte';
	import Listbox from './components/Listbox.svelte';
	import RadioGroup from './components/radio-group/RadioGroup.svelte';
	import RadioOption from './components/radio-group/RadioOption.svelte';
	import Switch from './components/switch/Switch.svelte';
	import SwitchGroup from './components/switch/SwitchGroup.svelte';
	import { NumberGroup, NumberInput, NumberIncrement, NumberDecrement, NumberLabel } from './components/number-input';
	import { GenerateMode, ListboxOption } from './types/main';

	let showUI: boolean;
	let amountIsDefault = true;
	let amount: number = 25;

	let selectedItem: ListboxOption;
	const categories: ListboxOption[] = [
		{ value: 'WORDS', text: 'Words', defaultAmount: 25 },
		{ value: 'CHARACTERS', text: 'Characters', defaultAmount: 100 },
		{ value: 'PARAGRAPHS', text: 'Paragraphs', defaultAmount: 2 },
	];

	onmessage = (event) => {
		if (event.data.pluginMessage.textNodeCount !== undefined) {
			showUI = event.data.pluginMessage.textNodeCount > 0;
		}
	};

	let generateMode: GenerateMode = 'AUTO';
	let usePeriods = true;
	let useTitleCase = false;

	const postMsg = () =>
		parent.postMessage(
			{ pluginMessage: { type: selectedItem?.value, amount, mode: generateMode, usePeriods, useTitleCase } },
			'*'
		);
</script>

<div class="flex h-full w-full flex-col">
	{#if showUI}
		<div class="">
			<RadioGroup
				bind:value={generateMode}
				on:change={() => console.log('size updated')}
				class="grid w-full grid-cols-2 border-b border-gray-900/10 dark:border-white/10"
			>
				<RadioOption
					value={'AUTO'}
					class="group grow select-none border-b-[3px] border-transparent bg-gray-200 p-4 text-center font-medium text-gray-900/50 text-opacity-50 transition-colors ease-out focus-visible:outline-1 focus-visible:outline-blue-500 data-[selected=true]:border-gray-900 data-[selected=true]:bg-transparent data-[selected=true]:text-gray-900 dark:bg-figma-gray-900 dark:text-gray-100/50 dark:data-[selected=true]:border-white dark:data-[selected=true]:bg-transparent dark:data-[selected=true]:text-gray-100"
				>
					Auto
				</RadioOption>
				<RadioOption
					value={'MANUAL'}
					class="group grow select-none border-b-[3px] border-transparent bg-gray-200 p-4 text-center font-medium text-gray-900/50 text-opacity-50 transition-colors ease-out focus-visible:outline-1 focus-visible:outline-blue-500 data-[selected=true]:border-gray-900 data-[selected=true]:bg-transparent data-[selected=true]:text-gray-900 dark:bg-figma-gray-900 dark:text-gray-100/50 dark:data-[selected=true]:border-white dark:data-[selected=true]:bg-transparent dark:data-[selected=true]:text-gray-100"
				>
					Custom
				</RadioOption>
			</RadioGroup>
		</div>
		<div class="flex w-full grow flex-col gap-4 p-4">
			<div class="flex h-12">
				{#if generateMode === 'MANUAL'}
					<div class="flex h-full w-full gap-2">
						<NumberGroup
							bind:value={amount}
							class="flex w-24 flex-col gap-2"
							on:change={() => amountIsDefault && (amountIsDefault = false)}
						>
							<NumberLabel hidden>Amount</NumberLabel>
							<div class="relative flex grow">
								<NumberInput class="w-full border border-gray-900/10 bg-transparent px-3 py-2 dark:border-white/10" />
								<div class="absolute right-0 top-0 flex h-full flex-col">
									<NumberIncrement
										class="flex grow items-center border-b border-l border-gray-900/10 px-2 dark:border-white/10"
									>
										<svg viewBox="0 0 12 12" width="12" height="12">
											<path d="M1 6 L11 6 M6 1 L6 11" stroke="currentColor" stroke-width="1.25" />
										</svg>
									</NumberIncrement>
									<NumberDecrement class="flex grow items-center border-l border-gray-900/10 px-2 dark:border-white/10">
										<svg viewBox="0 0 12 12" width="12" height="12">
											<path d="M1 6 L11 6" stroke="currentColor" stroke-width="1.25" />
										</svg>
									</NumberDecrement>
								</div>
							</div>
						</NumberGroup>
						<Listbox
							bind:selectedItem
							on:change={() => amountIsDefault && (amount = selectedItem.defaultAmount)}
							{categories}
						/>
					</div>
				{:else}
					<div class="flex grow items-center justify-center border border-gray-900/10 px-2 dark:border-white/10">
						<p class="max-w-[248px] select-none text-center text-xs">
							Automatically generate the perfect amount of copy to fit the text layer’s frame
						</p>
					</div>
				{/if}
			</div>
			<SwitchGroup class="flex items-center justify-between">
				<Label class="grow select-none font-medium">Use Periods</Label>
				<Switch
					bind:value={usePeriods}
					class="group relative w-12 after:absolute after:-bottom-1 after:-left-1 after:-right-1 after:-top-1 after:rounded-full after:border after:border-blue-500 after:opacity-0 focus-visible:after:opacity-100"
				>
					<span
						class="flex h-full w-full rounded-full border border-gray-900/10 bg-gray-200 p-1 transition-colors group-aria-checked:bg-figma-gray-900 dark:border-white/10 dark:bg-white/10 dark:group-aria-checked:bg-gray-100"
					>
						<span
							class="inline-block h-5 w-5 rounded-full bg-figma-gray-900 transition-all group-aria-checked:translate-x-[18px] group-aria-checked:bg-gray-100 dark:bg-gray-100 dark:group-aria-checked:bg-figma-gray-800"
						/>
					</span>
				</Switch>
			</SwitchGroup>
			<SwitchGroup class="flex items-center justify-between">
				<Label class="grow select-none font-medium">Title Case</Label>
				<Switch
					bind:value={useTitleCase}
					class="group relative w-12 after:absolute after:-bottom-1 after:-left-1 after:-right-1 after:-top-1 after:rounded-full after:border after:border-blue-500 after:opacity-0 focus-visible:after:opacity-100"
				>
					<span
						class="flex h-full w-full rounded-full border border-gray-900/10 bg-gray-200 p-1 transition-colors group-aria-checked:bg-figma-gray-900 dark:border-white/10 dark:bg-white/10 dark:group-aria-checked:bg-gray-100"
					>
						<span
							class="inline-block h-5 w-5 rounded-full bg-figma-gray-900 transition-all group-aria-checked:translate-x-[18px] group-aria-checked:bg-gray-100 dark:bg-gray-100 dark:group-aria-checked:bg-figma-gray-800"
						/>
					</span>
				</Switch>
			</SwitchGroup>
		</div>
		<div
			class="flex w-full flex-col items-center justify-center gap-4 border-t border-gray-900/10 p-4 dark:border-white/10"
		>
			<button
				class="w-full border border-figma-gray-900/10 px-2 py-3 font-semibold text-figma-gray-900 transition-colors ease-out hover:bg-figma-gray-900 hover:text-gray-100 focus-visible:outline-1 focus-visible:outline-blue-500 dark:border-gray-100/10 dark:text-gray-100 dark:hover:bg-gray-100 dark:hover:text-figma-gray-900"
				on:click={postMsg}
			>
				Generate
			</button>
		</div>
	{:else}
		<FallbackUi />
	{/if}
</div>
