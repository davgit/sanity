// @flow
import type {
  Block,
  BlockArrayType,
  Patch,
  SlateChange,
  SlateComponentProps,
  SlateMarkProps,
  SlateValue
} from './typeDefs'

import React from 'react'
import blockTools from '@sanity/block-tools'
import {Editor as SlateEditor} from 'slate-react'
import changeToPatch from './utils/changeToPatch'

import ContentBlock from './ContentBlock'
import Decorator from './nodes/Decorator'

type Props = {
  editorValue: SlateValue,
  onChange: (change: SlateChange, patches: Patch[]) => void,
  type: BlockArrayType,
  value: Block[]
}

export default class Editor extends React.Component<Props> {

  editor: ?SlateEditor

  blockContentFeatures: {
    decorators: [],
    annotations: [],
    styles: []
  }

  constructor(props: Props) {
    super(props)
    this.blockContentFeatures = blockTools.getBlockContentFeatures(props.type)
  }

  refEditor = (editor: ?SlateEditor) => {
    this.editor = editor
  }

  handleChange = (change: SlateChange) => {
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
  renderMark = (props: SlateMarkProps) => {
    const type = props.mark.type
    return this.blockContentFeatures.decorators.includes(type)
      ? <Decorator {...props} />
      : null
  }

  render() {
    const {editorValue} = this.props
    return (
      <SlateEditor
        ref={this.refEditor}
        value={editorValue}
        onChange={this.handleChange}
        renderNode={this.renderNode}
        renderMark={this.renderMark}
      />
    )
  }
}
