// @flow
import type {Block, SlateChange, SlateOperation} from '../typeDefs'
import {Operation} from 'slate'
import {set, unset} from '../../../PatchEvent'

function insertTextPatch(operation: Operation, blocks: Block[]) {
  const {text, offset, value} = operation
  const block = blocks[operation.path[0]]
  const span = block.children ? block.children[operation.path[1]] : null
  if (!span) {
    throw new Error('Could not find span')
  }
  let nextText = value.focusText.text
  nextText = [nextText.slice(0, offset), text, nextText.slice(offset)].join('')
  return set(nextText, [{_key: block._key}, 'children', {_key: span._key}, 'text'])
}

function removeTextPatch(operation: SlateOperation, blocks: Block[]) {
  const {text, offset, value} = operation
  const block = blocks[operation.path[0]]
  const span = block.children ? block.children[operation.path[1]] : null
  if (!span) {
    throw new Error('Could not find span')
  }
  let nextText = value.focusText.text
  nextText = [nextText.slice(0, offset), nextText.slice(offset + text.length)].join('')
  return set(nextText, [{_key: block._key}, 'children', {_key: span._key}, 'text'])
}

function removeNodePatch(operation: SlateOperation, blocks: Block[]) {
  if (operation.path.length === 1) {
    const block = blocks[operation.path[0]]
    return unset([{_key: block._key}])
  }
  console.log(operation)
  throw new Error("Don't know how to unset that")
}

export default function changeToPatch(change: SlateChange, blocks: Block[]) {
  const {operations} = change
  return operations.map((operation: SlateOperation) => {
    console.log(operation.type)
    switch (operation.type) {
      case 'insert_text':
        return insertTextPatch(operation, blocks)
      case 'remove_text':
        return removeTextPatch(operation, blocks)
      case 'remove_node':
        return removeNodePatch(operation, blocks)
      default:
        return null
    }
  }).toArray().filter(Boolean)
}
