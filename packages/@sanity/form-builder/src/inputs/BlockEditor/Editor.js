// @flow
import type {
  Block,
  BlockContentFeatures,
  SlateChange,
  SlateComponentProps,
  SlateMarkProps,
  SlateValue,
  Type
} from './typeDefs'

import React from 'react'
import SoftBreakPlugin from 'slate-soft-break'
import {Editor as SlateEditor} from 'slate-react'
import {EDITOR_DEFAULT_BLOCK_TYPE} from '@sanity/block-tools'
import resolveSchemaType from './utils/resolveSchemaType'

import ListItemOnEnterKeyPlugin from './plugins/ListItemOnEnterKeyPlugin'
import ListItemOnTabKeyPlugin from './plugins/ListItemOnTabKeyPlugin'
import SetMarksOnKeyComboPlugin from './plugins/SetMarksOnKeyComboPlugin'
import TextBlockOnEnterKeyPlugin from './plugins/TextBlockOnEnterKeyPlugin'

import ContentBlock from './nodes/ContentBlock'
import Decorator from './nodes/Decorator'
import Span from './nodes/Span'

import styles from './styles/Editor.css'

type Props = {
  blockContentFeatures: BlockContentFeatures,
  editorValue: SlateValue,
  onChange: (change: SlateChange) => void,
  type: Type,
  value: Block[],
}

export default class Editor extends React.Component<Props> {

  editor: ?SlateEditor = null

  plugins = []

  constructor(props: Props) {
    super(props)
    this.plugins = [
      ListItemOnEnterKeyPlugin({defaultBlock: EDITOR_DEFAULT_BLOCK_TYPE}),
      ListItemOnTabKeyPlugin(),
      TextBlockOnEnterKeyPlugin({defaultBlock: EDITOR_DEFAULT_BLOCK_TYPE}),
      SetMarksOnKeyComboPlugin({
        decorators: props.blockContentFeatures.decorators.map(item => item.value)
      }),
      SoftBreakPlugin({
        onlyIn: [EDITOR_DEFAULT_BLOCK_TYPE.type],
        shift: true
      })
    ]
  }

  getEditor() {
    return this.editor
  }

  refEditor = (editor: ?SlateEditor) => {
    this.editor = editor
  }

  focus() {
    if (this.editor) {
      this.editor.focus()
    }
  }

  renderNode = (props: SlateComponentProps) => {
    const {type, editorValue, onChange} = this.props
    const nodeType = props.node.type
    switch (nodeType) {
      case 'contentBlock':
        return <ContentBlock {...props} />
      case 'span':
        return (
          <Span
            attributes={props.attributes}
            editorValue={editorValue}
            node={props.node}
            onChange={onChange}
            type={resolveSchemaType(type, nodeType)}
          >
            {props.children}
          </Span>
        )
      default:
        throw new Error(`Uknown node type ${nodeType}`)
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
