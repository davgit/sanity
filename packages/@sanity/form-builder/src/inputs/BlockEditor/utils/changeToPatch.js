// @flow
import type {List} from 'immutable'
import {Value, Operation} from 'slate'
import {set, unset} from '../../../PatchEvent'

export type Change = {
  flags: {},
  value: Value,
  operations: List<Operation>,
  value: Value,
  kind: string
}

export type Span = {
  _key: string,
  text: string
}

export type Block = {
  _key: string,
  children: Span[]
}

function insertTextPatch(operation: Operation, blocks: Block[]) {
  const {text, offset, value} = operation
  const block = blocks[operation.path[0]]
  const span = block.children[operation.path[1]]
  let nextText = value.focusText.text
  nextText = [nextText.slice(0, offset), text, nextText.slice(offset)].join('')
  return set(nextText, [{_key: block._key}, 'children', {_key: span._key}, 'text'])
}

export default function changeToPatch(change: Change, blocks: Block[]) {
  const {operations} = change
  return operations.map((operation: Operation) => {
    switch (operation.type) {
      case 'insert_text':
        return insertTextPatch(operation, blocks)
      default:
        return null
    }
  }).toArray().filter(Boolean)
}
