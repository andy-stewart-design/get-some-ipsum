export const updateActiveSelection = () => {
  const textNodeCount = getTextNodes(figma.currentPage.selection).length
  figma.ui.postMessage({ textNodeCount })
}

export const getTextNodes = (nodes: SceneNode[] | readonly SceneNode[]) => {
  return nodes.filter((n) => n.type === "TEXT") as TextNode[]
}

export const loadFonts = async (node: TextNode) => {
  await Promise.all(node.getRangeAllFontNames(0, node.characters.length).map(figma.loadFontAsync))
}

export const addToast = (nodes: TextNode[]) => {
  return `Updated ${nodes.length} copy block` + (nodes.length > 1 ? "s" : "")
}
