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

import styles from './styles/Input.css'

type Props = {
  editorValue: SlateValue,
  level: number,
  onBlur: (nextPath: []) => void,
  onChange: (change: SlateChange) => void,
  onFocus: (nextPath: []) => void,
  type: BlockArrayType,
  value: Block[]
}

type State = {
  fullscreen: boolean,
  isFocused: boolean
}

export default class BlockEditorInput extends React.Component<Props, State> {

  _inputId = uniqueId('BlockEditor')

  _editor = null

  state = {
    fullscreen: false,
    isFocused: false
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
    this._editor = editor
  }

  focus() {
    if (this._editor) {
      this._editor.focus()
    }
  }

  handleFakeFocus = (event?: SyntheticEvent<*>) => {
    if (event) {
      event.preventDefault()
    }
    this.focus()
  }

  handleFocus = (event: SyntheticFocusEvent) => {
    this.setState({isFocused: true})
    this.props.onFocus(event)
  }

  handleBlur = (event: SyntheticBlurEvent) => {
    this.setState({isFocused: false})
    this.props.onBlur(event)
  }

  handleCanvasClick = () => {
    this.focus()
  }

  renderEditor(): ReactElement<typeof Editor> {
    const {
      editorValue,
      onChange,
      type,
      value
    } = this.props
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
    const {
      type,
      level,
      editorValue,
      onChange
    } = this.props

    const {
      fullscreen,
      isFocused
    } = this.state

    const editor = this.renderEditor()

    return (
      <FormField
        label={type.title}
        labelFor={this._inputId}
        description={type.description}
        level={level}
      >
        {/* Make label click work */ }
        <div style={{position: 'absolute', width: '0px', overflow: 'hidden'}}>
          <input tabIndex={0} type="text" id={this._inputId} onFocus={this.handleFakeFocus} />
        </div>

        <div
          onBlur={this.handleBlur}
          onFocus={this.handleFocus}
        >
          <BlockEditor
            blockContentFeatures={this.blockContentFeatures}
            editor={editor}
            editorValue={editorValue}
            fullscreen={fullscreen}
            isFocused={isFocused}
            onCanvasClick={this.handleCanvasClick}
            onChange={onChange}
            onToggleFullScreen={this.handleToggleFullScreen}
          />
        </div>
      </FormField>
    )
  }
}
