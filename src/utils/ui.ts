export interface ContextProvider {
  register: (ID: string) => void
  group: string | undefined
}

export const LIB_PREFIX = "nui"
export const DESCR_CONTEXT_NAME = `${LIB_PREFIX}-description`
export const LABEL_CONTEXT_NAME = `${LIB_PREFIX}-label`
export const RADIO_GROUP_CONTEXT = `${LIB_PREFIX}-radiogroup`
export const NUMBER_GROUP_CONTEXT = `${LIB_PREFIX}-radiogroup`
export const SWITCH_CONTEXT = `${LIB_PREFIX}-switch`

export const getID = () => {
  if (crypto.randomUUID) return crypto.randomUUID().split("-")[0]
  else return crypto.getRandomValues(new Uint16Array(1))[0].toString()
}

export const srOnly =
  "position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border-width: 0;"
