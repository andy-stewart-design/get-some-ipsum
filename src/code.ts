// Import Message type and generateIpsum function from their respective modules
import { Message, MessageType } from "./types/main"
import { generateIpsum } from "./utils/ipsum"

// When the plugin opens, check if any text elements are selected and update the UI
figma.on("run", () => updateActiveSelection())

// When the active selection changes, check if any text elements are selected and update the UI
figma.on("selectionchange", () => updateActiveSelection())

// Open the figma ui
figma.showUI(__html__, { themeColors: true, width: 320, height: 400 })

// Handle incoming messages from the UI
figma.ui.onmessage = async (msg: Message) => {
  const { type, amount } = msg
  const nodes = figma.currentPage.selection
  let textNodeCount = 0
  // For each selected text node, replace the text with lorem ipsum text
  for (const node of nodes) {
    if (node.type === "TEXT") {
      // Load fonts asynchronously
      textNodeCount++
      await Promise.all(node.getRangeAllFontNames(0, node.characters.length).map(figma.loadFontAsync))
      if (type === "AUTO") {
        // Replace text repeatedly until the height stabilizes
        const initialOpacity = node.opacity
        const initialHeight = node.height
        const initialChars = node.characters
        let isLooping = true
        node.opacity = 0
        while (isLooping) {
          replaceText(type, node, initialChars.length)
          const finalHeight = node.height
          if (initialHeight === finalHeight) isLooping = false
        }
        node.opacity = initialOpacity
      } else if (type === "WORDS" || type === "CHARACTERS" || type === "PARAGRAPHS") {
        // Replace text with a specific number of words, characters, or paragraphs
        replaceText(type, node, amount)
      }
    }
  }

  // Close the plugin
  const message = textNodeCount <= 1 ? `Updated ${textNodeCount} copy block` : `Updated ${textNodeCount} copy blocks`
  figma.closePlugin(message)
}

// Helper function to replace text with generated lorem ipsum text
const replaceText = (type: MessageType, node: TextNode, chars: number) => {
  const ipsum = generateIpsum(type, chars)
  node.characters = ipsum
}

const updateActiveSelection = () => {
  let isTextSelected = false
  const selectedElementCount = figma.currentPage.selection.length
  for (const el of figma.currentPage.selection) {
    if (el.type === "TEXT") {
      isTextSelected = true
      break
    }
  }
  // Send message to UI with selection information
  figma.ui.postMessage({ selectedElementCount, isTextSelected })
}
