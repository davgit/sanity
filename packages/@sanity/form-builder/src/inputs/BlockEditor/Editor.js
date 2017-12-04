// @flow
import type {
  Block,
  BlockContentFeatures,
  SlateChange,
  SlateComponentProps,
  SlateMarkProps,
  SlateValue
} from './typeDefs'

import React from 'react'
import {Editor as SlateEditor} from 'slate-react'
import {EDITOR_DEFAULT_BLOCK_TYPE} from '@sanity/block-tools'

import SetMarksOnKeyComboPlugin from './plugins/SetMarksOnKeyComboPlugin'
import TextBlockOnEnterKeyPlugin from './plugins/TextBlockOnEnterKeyPlugin'

import ContentBlock from './ContentBlock'
import Decorator from './nodes/Decorator'

import styles from './styles/Editor.css'

type Props = {
  blockContentFeatures: BlockContentFeatures,
  editorValue: SlateValue,
  onChange: (change: SlateChange) => void,
  value: Block[],
}

export default class Editor extends React.Component<Props> {

  editor: ?SlateEditor = null

  plugins = []

  constructor(props: Props) {
    super(props)
    this.plugins = [
      TextBlockOnEnterKeyPlugin({defaultBlock: EDITOR_DEFAULT_BLOCK_TYPE}),
      SetMarksOnKeyComboPlugin({
        decorators: props.blockContentFeatures.decorators.map(item => item.value)
      })
    ]
  }

  getEditor() {
    return this.editor
  }

  refEditor = (editor: ?SlateEditor) => {
    this.editor = editor
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
    const {blockContentFeatures} = this.props
    const type = props.mark.type
    return blockContentFeatures.decorators.map(item => item.value).includes(type)
      ? <Decorator {...props} />
      : null
  }

  render() {
    const {editorValue, onChange} = this.props
    return (
      <SlateEditor
        className={styles.slateEditor}
        ref={this.refEditor}
        value={editorValue}
        onChange={onChange}
        plugins={this.plugins}
        renderNode={this.renderNode}
        renderMark={this.renderMark}
      />
    )
  }
}
