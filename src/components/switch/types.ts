export interface SwitchAPI {
  groupID: string
  updateValue: () => void
  handleKeydown: (e: KeyboardEvent) => void
}
