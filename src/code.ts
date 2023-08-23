// TODO: Check for locked layers (LOW)
// TODO: Figure out how to make freeform autogeneration more accurate (LOW)
// TODO: Figure out how to integrate quick actions into plugin (Next Version)

import { Message } from './types/main';
import { getTextNodes, loadFonts, updateActiveSelection, addToast } from './utils/figma';
import { lorem, generateCharacters } from './utils/ipsum';
import { formatSentences, getFreeformCharCount } from './utils/text';

console.clear();

figma.on('run', () => updateActiveSelection());

figma.on('selectionchange', () => updateActiveSelection());

figma.showUI(__html__, { themeColors: true, width: 320, height: 320 });

figma.ui.onmessage = async (msg: Message) => {
	const nodes = figma.currentPage.selection;
	const textNodes = getTextNodes(nodes);

	for (const node of textNodes) {
		await loadFonts(node);
		if (msg.mode === 'AUTO') {
			if (node.textAutoResize === 'HEIGHT') {
				if (node.characters.length < 5) {
					const ipsumArray = lorem.generateWords(2).split(' ');
					const ipsum = formatSentences(ipsumArray, msg);
					node.characters = ipsum;
				} else {
					let isLooping = true;
					let initialChars = node.characters.length;
					const initialHeight = node.height;
					while (isLooping) {
						const ipsumArray = generateCharacters(initialChars);
						const ipsum = formatSentences(ipsumArray, msg);
						node.characters = ipsum;
						const finalHeight = node.height;
						if (initialHeight === finalHeight) isLooping = false;
						else if (initialHeight < finalHeight) initialChars -= Math.floor(initialChars / 10);
						else if (initialHeight > finalHeight) initialChars += Math.floor(initialChars / 10);
					}
				}
			} else if (node.textAutoResize === 'NONE' || node.textAutoResize === 'TRUNCATE') {
				const charCount = await getFreeformCharCount(node, msg);
				const ipsumArray = generateCharacters(charCount);
				const ipsum = formatSentences(ipsumArray, msg);
				node.characters = ipsum;
				// TODO: Figure out how to make this more accurate (LOW)
			} else if (node.textAutoResize === 'WIDTH_AND_HEIGHT') {
				if (node.characters.length < 5) {
					const ipsumArray = lorem.generateWords(2).split(' ');
					const ipsum = formatSentences(ipsumArray, msg);
					node.characters = ipsum;
				} else {
					const ipsumArray = generateCharacters(node.characters.length);
					const ipsum = formatSentences(ipsumArray, msg);
					node.characters = ipsum;
				}
			}
		} else if (msg.mode === 'MANUAL') {
			if (!msg.amount) console.error(`Get Some Ipsum: must provide amount to generate ${msg.type.toLocaleLowerCase()}`);
			if (msg.type === 'WORDS') {
				const result = lorem.generateWords(msg.amount);
				const ipsumArray = result.split(' ');
				const ipsum = formatSentences(ipsumArray, msg);
				node.characters = ipsum;
			} else if (msg.type === 'PARAGRAPHS') {
				const paragraphArray = lorem.generateParagraphs(msg.amount).split(/\r?\n|\r|\n/g);
				const ipsum = paragraphArray.map((paragraph) => {
					const ipsumArray = paragraph.replaceAll('.', '').split(' ');
					console.log(ipsumArray);

					return formatSentences(ipsumArray, msg);
				});
				node.characters = ipsum.join('\n\n');
			} else if (msg.type === 'CHARACTERS') {
				const ipsumArray = generateCharacters(msg.amount);
				const ipsum = formatSentences(ipsumArray, msg);
				node.characters = ipsum;
			}
		}
	}

	figma.closePlugin(addToast(textNodes));
};
