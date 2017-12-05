// @flow
import type {Element as ReactElement} from 'react'
import type {
  Block,
  BlockArrayType,
  SlateChange,
  SlateValue
} from './typeDefs'

import {uniqueId} from 'lodash'

import React from 'react'
import blockTools from '@sanity/block-tools'

import Editor from './Editor'
import FormField from 'part:@sanity/components/formfields/default'

import BlockEditor from './BlockEditor'

type Props = {
  editorValue: SlateValue,
  level: number,
  onChange: (change: SlateChange) => void,
  type: BlockArrayType,
  value: Block[]
}

type State = {
  fullscreen: boolean
}

export default class BlockEditorInput extends React.Component<Props, State> {

  inputId = uniqueId('BlockEditor')

  editor = null

  state = {
    fullscreen: false
  }

  blockContentFeatures = {
    decorators: [],
    styles: [],
    annotations: []
  }

  constructor(props: Props) {
    super(props)
    this.blockContentFeatures = blockTools.getBlockContentFeatures(props.type)
  }

  handleToggleFullScreen = () => {
    const fullscreen = !this.state.fullscreen
    this.setState({fullscreen})
    if (!fullscreen) {
      this.handleFocus()
    }
  }

  refEditor = (editor: ?Editor) => {
    this.editor = editor
  }

  handleFocus = (event?: SyntheticEvent<*>) => {
    if (event) {
      event.preventDefault()
    }
    if (this.editor) {
      this.editor.setFocus()
    }
  }

  handleCanvasClick = () => {
    this.handleFocus()
  }

  renderEditor(): ReactElement<typeof Editor> {
    const {onChange, value, editorValue, type} = this.props
    return (
      <Editor
        blockContentFeatures={this.blockContentFeatures}
        editorValue={editorValue}
        onChange={onChange}
        ref={this.refEditor}
        value={value}
        type={type}
      />
    )
  }

  render() {
    const {type, level, editorValue, onChange} = this.props
    const editor = this.renderEditor()
    return (
      <FormField
        label={type.title}
        labelFor={this.inputId}
        description={type.description}
        level={level}
      >
        {/* Make label click work */ }
        <div style={{position: 'absolute', width: '0px', overflow: 'hidden'}}>
          <input type="text" id={this.inputId} onFocus={this.handleFocus} />
        </div>

        <BlockEditor
          blockContentFeatures={this.blockContentFeatures}
          editor={editor}
          editorValue={editorValue}
          fullscreen={this.state.fullscreen}
          onCanvasClick={this.handleCanvasClick}
          onChange={onChange}
          onToggleFullScreen={this.handleToggleFullScreen}
        />
      </FormField>
    )
  }
}
