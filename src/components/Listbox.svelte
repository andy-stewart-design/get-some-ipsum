<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { ListboxOption } from '../types/main';
	import { focusOnMount } from '../utils/focusOnMount';
	import expand from '../svgs/expand.svg';
	import collapse from '../svgs/collapse.svg';

	const dispatch = createEventDispatcher();

	let activeItem: number = 0;
	export let categories: ListboxOption[];
	export let selectedItem: ListboxOption = categories[activeItem];
	const len: number = categories.length - 1;
	let isOpen: boolean = false;
	let listboxButton: HTMLElement;

	const generateUUID = (): string => {
		const alphabet = 'abcdefghijklmnopqrstuvwxyz';
		const lett: string = alphabet[Math.floor(Math.random() * alphabet.length)];
		const num: number = Math.floor(Math.random() * 1000);
		return lett + num;
	};

	const toggleOpenState = (): void => {
		isOpen = !isOpen;
		let value = isOpen ? 'true' : 'false';
		listboxButton.setAttribute('aria-expanded', value);
		if (isOpen) {
			listboxButton.setAttribute('aria-controls', `listbox-options-:${generateUUID()}:`);
		} else {
			listboxButton.removeAttribute('aria-controls');
			listboxButton.focus();
		}
	};

	const incActiveItem = (): number => (activeItem >= len ? (activeItem = 0) : (activeItem += 1));
	const decActiveItem = (): number => (activeItem <= 0 ? (activeItem = len) : (activeItem -= 1));
	const updateSelected = (): void => {
		selectedItem = categories[activeItem];
		dispatch('change');
		setTimeout(() => {
			toggleOpenState();
		}, 0);
	};

	const keyboardHandler = async (e: KeyboardEvent) => {
		if (isOpen && e.key === 'Tab') {
			toggleOpenState();
			// e.preventDefault();
			// e.shiftKey ? decActiveItem() : incActiveItem();
		} else if ((isOpen && e.key === 'ArrowUp') || (isOpen && e.key === 'ArrowLeft')) {
			e.preventDefault();
			decActiveItem();
		} else if ((isOpen && e.key === 'ArrowDown') || (isOpen && e.key === 'ArrowRight')) {
			e.preventDefault();
			incActiveItem();
		} else if (isOpen && e.key === 'Escape') {
			toggleOpenState();
			activeItem = categories.indexOf(selectedItem);
		} else if (isOpen && e.key === 'Enter') {
			updateSelected();
		}
	};

	const setAria = (node: HTMLElement): void => {
		const att = node.previousElementSibling?.getAttribute('aria-controls');
		if (att) node.setAttribute('id', att);
	};
</script>

<div class="relative flex grow">
	<button
		bind:this={listboxButton}
		on:click={toggleOpenState}
		class="relative flex w-full select-none items-center border border-gray-900/10 px-3 py-1.5 text-left focus-visible:border-blue-600 active:border-figma-gray-900 dark:border-white/20 dark:focus-visible:border-blue-600 dark:active:border-gray-100"
		class:active={isOpen}
		type="button"
		aria-haspopup="true"
		aria-expanded="false"
	>
		<span class="inline-block grow">{selectedItem.text}</span>
		<span class="inline-block">
			{#if isOpen}
				{@html collapse}
			{:else}
				{@html expand}
			{/if}
		</span>
	</button>
	{#if isOpen}
		<div
			class="absolute left-0 top-12 z-10 w-full cursor-pointer overflow-hidden border border-gray-900/10 bg-white shadow-lg dark:border-white/10 dark:bg-figma-gray-900"
			role="listbox"
			aria-orientation="vertical"
			tabindex="0"
			use:focusOnMount={keyboardHandler}
			use:setAria
		>
			{#each categories as category, index}
				{@const isSelected = activeItem === index}
				<div
					class="flex px-3 py-2"
					class:item-active={index === activeItem}
					aria-selected={isSelected ? 'true' : 'false'}
					on:click={updateSelected}
					on:keydown={updateSelected}
					on:mouseenter={() => {
						activeItem = index;
					}}
				>
					<p class="flex-grow select-none">{category.text}</p>
				</div>
			{/each}
		</div>
	{/if}
</div>

<style lang="postcss">
	.item-active {
		@apply bg-gray-200 text-figma-gray-700;
	}
</style>
