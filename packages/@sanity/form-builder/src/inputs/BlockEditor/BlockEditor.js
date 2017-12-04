// @flow
import React, {Element as ReactElement} from 'react'

import FullscreenDialog from 'part:@sanity/components/dialogs/fullscreen?'
import ScrollContainer from 'part:@sanity/components/utilities/scroll-container'

import Editor from './Editor'
import EditorCanvas from './EditorCanvas'
import Toolbar from './Toolbar/Toolbar'

import styles from './styles/BlockEditor.css'

import type {
  SlateChange,
  SlateValue,
  ToolbarStyle,
  Type
} from './typeDefs'

type Props = {
  editor: ReactElement<typeof Editor>,
  editorValue: SlateValue,
  fullscreen: boolean,
  onChange: (change: SlateChange) => void,
  onToggleFullScreen: void => void,
  onCanvasClick: void => void,
  type: Type
}

type State = {
  toolbarStyle: ToolbarStyle
}

export default class BlockEditor extends React.Component<Props, State> {

  state = {
    toolbarStyle: {}
  }

  editorCanvas = null

  handleFullScreenScroll = (event: SyntheticWheelEvent<HTMLDivElement>) => {
    const threshold = 100
    const scrollTop = event.currentTarget.scrollTop
    if (scrollTop < threshold) {
      const ratio = scrollTop / threshold
      this.setState({
        toolbarStyle: {
          backgroundColor: `rgba(255, 255, 255, ${ratio * 0.95})`,
          boxShadow: `0 2px ${5 * ratio}px rgba(0, 0, 0, ${ratio * 0.3})`
        }
      })
    }
  }

  handleCanvasClick = () => {
    this.props.onCanvasClick()
  }

  renderFullScreen() {
    return (
      <FullscreenDialog isOpen onClose={this.props.onToggleFullScreen}>
        <ScrollContainer className={styles.fullscreen} onScroll={this.handleFullScreenScroll}>
          {this.renderEditor()}
        </ScrollContainer>
      </FullscreenDialog>
    )
  }

  renderEditor() {
    const {
      editorValue,
      editor,
      fullscreen,
      onChange,
      onToggleFullScreen,
      type
    } = this.props
    const {toolbarStyle} = this.state
    return (
      <div className={styles.editor}>
        <Toolbar
          editorValue={editorValue}
          fullscreen={fullscreen}
          onChange={onChange}
          onToggleFullScreen={onToggleFullScreen}
          type={type}
          style={toolbarStyle}
        />
        <EditorCanvas
          editor={editor}
          fullscreen={fullscreen}
          onCanvasClick={this.handleCanvasClick}
        />
      </div>
    )
  }

  render() {
    const {fullscreen} = this.props
    return (
      <div className={styles.root}>
        {fullscreen ? this.renderFullScreen() : this.renderEditor()}
      </div>
    )
  }
}
