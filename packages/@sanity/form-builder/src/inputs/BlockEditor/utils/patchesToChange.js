// @flow
import type {Span, Block, SlateValue} from '../typeDefs'
import {Text} from 'slate'


type Path = string | {_key: string}

type Patch = {
  type: string,
  path: Path[]
}

function findFirstKey(path: Path[]) {
  const match = path.find(part => part.hasOwnProperty('_key'))
  if (match) {
    return match._key || null
  }
  return null
}

function findLastKey(path: Path[]) {
  let key = null
  path.forEach(part => {
    if (part._key) {
      key = part._key
    }
  })
  return key
}

function findPatchedBlock(patch, blocks) {
  const firstKey = findFirstKey(patch.path)
  return blocks.find((blk: Block) => blk._key === firstKey) || null
}

function findPatchedSpan(patch, blocks) {
  const block = findPatchedBlock(patch, blocks)
  const lastKey = findLastKey(patch.path)
  return block && block.children
    ? block.children.find((spn: Span) => spn._key === lastKey)
    : null
}

function replaceTextByKey(change, key, span) {
  const newText = Text.create({
    text: span.text,
    key: key,
    marks: span.marks.map(name => ({type: name}))
  })
  change.replaceNodeByKey(key, newText)
}

function diffMatchPatch(patch: Patch, change: () => void, blocks: Block[]) {
  const lastKey = findLastKey(patch.path)
  const span = findPatchedSpan(patch, blocks)
  change.call(replaceTextByKey, lastKey, span)
}

export default function patchesToChange(patches: Patch[], editorValue: SlateValue, blocks: Block[]) {
  const change = editorValue.change()
  patches.forEach((patch: Patch) => {
    console.log(patch.type)
    switch (patch.type) {
      case 'diffMatchPatch':
        return diffMatchPatch(patch, change, blocks)
      default:
        return null
    }
  })
  return change
}
