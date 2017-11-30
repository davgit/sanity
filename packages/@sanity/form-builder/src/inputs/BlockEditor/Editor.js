// @flow
import type {SlateComponentProps, BlockArrayType, ItemValue} from './typeDefs'
import type {Change} from './utils/changeToPatch'

import React from 'react'
import {Editor as SlateEditor} from 'slate-react'
import PatchEvent from '../../PatchEvent'
import changeToPatch from './utils/changeToPatch'

import ContentBlock from './ContentBlock'

type Props = {
  value: ItemValue[],
  editorValue: ItemValue[],
  onChange: PatchEvent => void,
  type: BlockArrayType
}

export default class Editor extends React.Component<Props> {

  editor: ?SlateEditor

  refEditor = (editor: ?SlateEditor) => {
    this.editor = editor
  }

  onChange = (change: Change) => {
    const {value} = this.props
    const patch = changeToPatch(change, value)
    this.props.onChange(change, patch)
  }

  setFocus() {
    if (this.editor) {
      this.editor.focus()
    }
  }

  renderNode = (props: SlateComponentProps) => {
    const type = props.node.type
    switch (type) {
      case 'contentBlock': return <ContentBlock {...props} />
      default: throw new Error(`Uknown node type ${type}`)
    }
  }

  render() {
    const {onChange, editorValue} = this.props
    return (
      <SlateEditor
        ref={this.refEditor}
        value={editorValue}
        onChange={this.onChange}
        renderNode={this.renderNode}
      />
    )
  }
}
