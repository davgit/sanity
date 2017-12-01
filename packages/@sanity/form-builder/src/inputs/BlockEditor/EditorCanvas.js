// @flow
import type {
  Block,
  BlockArrayType,
  Patch,
  SlateChange,
  SlateValue
} from './typeDefs'

import React from 'react'
import ReactDOM from 'react-dom'
import {Node as SlateNode} from 'slate'

import Editor from './Editor'

import styles from './styles/EditorCanvas.css'

type Props = {
  editorValue: SlateValue,
  onChange: (change: SlateChange, patches: Patch[]) => void,
  type: BlockArrayType,
  value: Block[],
  fullscreen: boolean
}

export default class EditorCanvas extends React.Component<Props> {

  static defaultProps = {
    fullscreen: false
  }

  blockDragMarker: ?HTMLDivElement
  editor: ?Editor

  showBlockDragMarker(pos: string, node: SlateNode) {
    if (!this.editor) {
      return
    }
    const editorDOMNode = ReactDOM.findDOMNode(this.editor)
    if (editorDOMNode instanceof HTMLElement) {
      const editorRect = editorDOMNode.getBoundingClientRect()
      const elemRect = node.getBoundingClientRect()
      const topPos = elemRect.top - editorRect.top
      const bottomPos = topPos + (elemRect.bottom - elemRect.top)
      const top = pos === 'after'
        ? `${parseInt(bottomPos, 10)}px`
        : `${parseInt(topPos, 10)}px`
      if (this.blockDragMarker) {
        this.blockDragMarker.style.display = 'block'
        this.blockDragMarker.style.top = top
      }
    }
  }

  hideBlockDragMarker() {
    if (this.blockDragMarker) {
      this.blockDragMarker.style.display = 'none'
    }
  }

  // Webkit hack to force the browser to reapply CSS rules
  // This is needed to make ::before and ::after CSS rules work properly
  // under certain conditions (like the list counters for number lists)
  // http://stackoverflow.com/questions/3485365/how-can-i-force-webkit-to-redraw-repaint-to-propagate-style-changes/3485654#3485654
  refreshCSS = () => {
    if (!document.documentElement) {
      return
    }
    const isWebkit = 'WebkitAppearance' in document.documentElement.style
    if (!isWebkit) {
      return
    }
    if (!document.body) {
      return
    }
    // Must be body because we have several scrollcontainers loosing state
    const resetNode: HTMLElement = document.body
    resetNode.style.display = 'none'
    // eslint-disable-next-line no-unused-expressions
    resetNode.offsetHeight // Looks weird, but it actually has an effect!
    resetNode.style.display = ''
  }

  handleCanvasClick = () => {
    if (this.editor) {
      this.editor.setFocus()
    }
  }

  refEditor = (editor: ?Editor) => {
    this.editor = editor
  }

  refBlockDragMarker = (blockDragMarker: ?HTMLDivElement) => {
    this.blockDragMarker = blockDragMarker
  }

  render() {
    const {onChange, value, editorValue, type} = this.props
    return (
      <div className={styles.root}>
        <div className={styles.canvas} onClick={this.handleCanvasClick}>
          <Editor
            ref={this.refEditor}
            value={value}
            editorValue={editorValue}
            type={type}
            onChange={onChange}
          />
          <div
            ref={this.refBlockDragMarker}
            style={{display: 'none'}}
            className={styles.blockDragMarker}
          />
        </div>
      </div>
    )
  }
}
