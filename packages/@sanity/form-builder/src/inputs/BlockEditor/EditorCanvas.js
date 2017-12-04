// @flow
import React, {SyntheticEvent} from 'react'
import ReactDOM from 'react-dom'
import {Node as SlateNode} from 'slate'

import Editor from './Editor'
import styles from './styles/EditorCanvas.css'

type Props = {
  editor: React.Element<typeof Editor>,
  fullscreen: boolean,
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

  refBlockDragMarker = (blockDragMarker: ?HTMLDivElement) => {
    this.blockDragMarker = blockDragMarker
  }

  handleCanvasClick = (event: SyntheticEvent) => {
    event.preventDefault()
    this.props.onCanvasClick()
  }

  render() {
    const {
      editor,
      fullscreen,
    } = this.props
    return (
      <div
        className={`${styles.root}${fullscreen ? ` ${styles.fullscreen}` : ''}`}
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
