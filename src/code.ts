import { getSomeIpsum } from "./utils/ipsum"

// TODO: CHECK OF ANYTHING IS SELECTED WHEN THE PLUGIN OPENS
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

// TODO: ADD MESSAGE ABOUT SELECTING A TEXT ELEMENT IS NOTHING IS SELECTED
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

figma.showUI(__html__, { themeColors: true, width: 320, height: 400 })

figma.ui.onmessage = async () => {
  console.clear()
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

  figma.closePlugin()
}

const replaceText = (node: TextNode, chars: string) => {
  const ipsum = getSomeIpsum(chars.length)
  node.textAutoResize = "NONE"
  node.characters = ipsum
}
