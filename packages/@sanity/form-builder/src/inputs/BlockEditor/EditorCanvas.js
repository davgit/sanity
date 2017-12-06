// @flow
import type {Element as ReactElement} from 'react'
import React from 'react'
import ReactDOM from 'react-dom'
import {Node as SlateNode} from 'slate'

import Editor from './Editor'

import styles from './styles/EditorCanvas.css'

type Props = {
  editor: ReactElement<typeof Editor>,
  fullscreen: boolean,
  isFocused: boolean,
  onCanvasClick: void => void
}

export default class EditorCanvas extends React.Component<Props> {

  blockDragMarker: ?HTMLDivElement

  showBlockDragMarker(pos: string, node: SlateNode) {
    const {editor} = this.props
    const editorDOMNode = ReactDOM.findDOMNode(editor)
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

  refBlockDragMarker = (blockDragMarker: ?HTMLDivElement) => {
    this.blockDragMarker = blockDragMarker
  }

  handleCanvasClick = (event: SyntheticEvent<HTMLDivElement>) => {
    event.preventDefault()
    this.props.onCanvasClick()
  }

  render() {
    const {
      editor,
      isFocused,
      fullscreen,
    } = this.props

    const classNames = [
      styles.root,
      fullscreen ? styles.fullscreen : null,
      isFocused ? styles.focus : null
    ].filter(Boolean)

    return (
      <div
        className={classNames.join(' ')}
        onClick={this.handleCanvasClick}
      >
        <div className={styles.canvas}>
          {editor}
          <div
            className={styles.blockDragMarker}
            ref={this.refBlockDragMarker}
            style={{display: 'none'}}
          />
        </div>
      </div>
    )
  }
}
