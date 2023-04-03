export interface ContextProvider {
  register: (ID: string) => void
}

export const DESCR_CONTEXT_NAME = "nui-description"
export const LABEL_CONTEXT_NAME = "nui-label"
export const RADIO_GROUP_CONTEXT = "nui-radio-group"
export const SWITCH_CONTEXT = "nui-switch"

export const getID = () => {
  if (crypto.randomUUID) return crypto.randomUUID().split("-")[0]
  else return crypto.getRandomValues(new Uint16Array(1))[0].toString()
}
