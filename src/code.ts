// TODO: Check for locked layers
// TODO: Redo interface to allow for options like:
// TODO: Switch to turn periods on/off
// TODO: Select to choose casing type
// TODO: Figure out how to integrate quick actions into plugin

import { Message } from "./types/main"
import { generateIpsum } from "./utils/ipsum"

figma.on("run", () => updateActiveSelection())

figma.on("selectionchange", () => updateActiveSelection())

figma.showUI(__html__, { themeColors: true, width: 320, height: 320 })

figma.ui.onmessage = async (msg: Message) => {
  console.log(msg)

  const nodes = figma.currentPage.selection
  const textNodes = getTextNodes(nodes)
  await updateTextNodes(msg, textNodes)

  figma.closePlugin(addToast(textNodes))
}

// -----------------------------------------------------------------
// HELPER FUNCTIONS
// -----------------------------------------------------------------

const updateActiveSelection = () => {
  const textNodeCount = getTextNodes(figma.currentPage.selection).length
  figma.ui.postMessage({ textNodeCount })
}

const updateTextNodes = async (msg: Message, nodes: TextNode[]) => {
  for (const node of nodes) {
    await loadFonts(node)
    const initialOpacity = node.opacity
    node.opacity = 0

    if (msg.mode === "AUTO") {
      if (node.textAutoResize === "HEIGHT") {
        // Replace text repeatedly until the height stabilizes
        const initialHeight = node.height
        const initialChars = node.characters

        let isLooping = true
        while (isLooping) {
          const ipsum = generateIpsum(msg, initialChars.length)
          node.characters = ipsum
          const finalHeight = node.height
          if (initialHeight === finalHeight) isLooping = false
        }
      } else if (node.textAutoResize === "NONE" || node.textAutoResize === "TRUNCATE") {
        const charCount = getFreeformCharCount(node, msg)
        const ipsum = generateIpsum(msg, charCount)
        node.characters = ipsum
      } else if (node.textAutoResize === "WIDTH_AND_HEIGHT") {
        const ipsum = generateIpsum(msg, node.characters.length)
        node.characters = ipsum
      }
    } else if (msg.mode === "MANUAL") {
      // Replace text with a specific number of words, characters, or paragraphs
      const ipsum = generateIpsum(msg, msg.amount)
      node.characters = ipsum
    }
    node.opacity = initialOpacity
  }
}

const getTextNodes = (nodes: SceneNode[] | readonly SceneNode[]) => {
  return nodes.filter((n) => n.type === "TEXT") as TextNode[]
}

const loadFonts = async (node: TextNode) => {
  await Promise.all(node.getRangeAllFontNames(0, node.characters.length).map(figma.loadFontAsync))
}

const addToast = (nodes: TextNode[]) => {
  return `Updated ${nodes.length} copy block` + (nodes.length > 1 ? "s" : "")
}

const getFreeformCharCount = (node: TextNode, msg: Message) => {
  const node_width = node.width
  const node_height = node.height
  const ipsum = generateIpsum(msg, node_width)
  node.characters = ipsum
  const word_array = node.characters.split(" ")

  // get the width a space in the typeface
  const text = figma.createText()
  text.characters = word_array[0] + " " + word_array[1]
  const word_height = text.height
  const two_word_width = text.width
  text.characters = word_array[0]
  const first_word_width = text.width
  text.characters = word_array[1]
  const second_word_width = text.width
  const space_width = two_word_width - first_word_width - second_word_width

  const word_widths = word_array.map((word) => {
    text.characters = word
    const word_width = text.width
    return word_width + space_width
  })

  text.remove()

  let line_length = 0
  let index = 0
  while (line_length < node_width) {
    line_length += word_widths[index]
    index++
  }

  const first_line = word_array.splice(0, index - 1)
  const one_line_character_count = first_line.join(" ").length
  const line_count = Math.floor(node_height / word_height)

  return one_line_character_count * line_count
}
