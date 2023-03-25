import { autoGenerate, manualGenerate } from "./utils/ipsum"

// When the plugin opens, check if any text elements are selected
figma.on("run", () => {
  let isTextSelected = false
  const selectedElementCount = figma.currentPage.selection.length
  for (const el of figma.currentPage.selection) {
    if (el.type === "TEXT") {
      isTextSelected = true
      break
    }
  }
  figma.ui.postMessage({ selectedElementCount, isTextSelected })
})

// When the active selection changes, check if any text elements are selected
figma.on("selectionchange", () => {
  let isTextSelected = false
  const selectedElementCount = figma.currentPage.selection.length
  for (const el of figma.currentPage.selection) {
    if (el.type === "TEXT") {
      isTextSelected = true
      break
    }
  }
  figma.ui.postMessage({ selectedElementCount, isTextSelected })
})

// open the figma ui
figma.showUI(__html__, { themeColors: true, width: 320, height: 400 })

// receive messages fromt the UI and proceed accordingly
figma.ui.onmessage = async (msg) => {
  const { type } = msg
  if (type === "AUTO") {
    const nodes = figma.currentPage.selection
    for (const node of nodes) {
      if (node.type === "TEXT") {
        await Promise.all(node.getRangeAllFontNames(0, node.characters.length).map(figma.loadFontAsync))
        const initialOpacity = node.opacity
        const initialHeight = node.height
        const initialChars = node.characters
        let isLooping = true
        node.opacity = 0
        while (isLooping) {
          replaceText(node, initialChars)
          const finalHeight = node.height
          if (initialHeight === finalHeight) isLooping = false
        }
        node.opacity = initialOpacity
      }
    }
  } else if (type === "WORDS" || type === "CHARACTERS" || type === "PARAGRAPHS") {
    const nodes = figma.currentPage.selection
    for (const node of nodes) {
      if (node.type === "TEXT") {
        await Promise.all(node.getRangeAllFontNames(0, node.characters.length).map(figma.loadFontAsync))
        const ipsum = manualGenerate(type, msg.amount)
        node.characters = ipsum
      }
    }
  }

  figma.closePlugin()
}

const replaceText = (node: TextNode, chars: string) => {
  const ipsum = autoGenerate(chars.length)
  node.characters = ipsum
}
