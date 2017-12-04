// @flow
import {Change} from 'slate'

type Options = {
  decorators?: string[]
}

// This plugin inserts an empty default block after enter is pressed
// within a block which is not a default block type.
// I.e: when enter is pressed after a title, start a new empty normal block below

function SetMarksOnKeyComboPlugin(options: Options = {}) {
  const decorators = options.decorators || []
  return {
    onKeyDown(event: SyntheticKeyboardEvent<*>, change: Change) {
      const {key, metaKey} = event
      if (!metaKey) {
        return null
      }
      let mark
      switch (key) {
        case 'b':
          mark = 'strong'
          break
        case 'i':
          mark = 'em'
          break
        case 'u':
          mark = 'underline'
          break
        default:
          return undefined
      }
      // Return if not supported by schema
      if (!decorators.includes(mark)) {
        return undefined
      }
      event.preventDefault()
      return change.toggleMark(mark)
    }
  }
}

export default SetMarksOnKeyComboPlugin
