// @flow
import React from 'react'

import PatchEvent from '../../PatchEvent'

import EditorCanvas from './EditorCanvas'
import FullscreenDialog from 'part:@sanity/components/dialogs/fullscreen?'
import Toolbar from './Toolbar'

import styles from './styles/BlockEditor.css'

import type {BlockArrayType, ItemValue} from './typeDefs'

type Props = {
  value: Array<ItemValue>,
  editorValue: Array<ItemValue>,
  onChange: PatchEvent => void,
  type: BlockArrayType
}

export type ToolbarStyle = {
  backgroundColor?: string,
  boxShadow? : string
}

type State = {
  fullscreen: boolean,
  toolbarStyle: ToolbarStyle
}

export default class BlockEditor extends React.Component<Props, State> {

  state = {
    fullscreen: false,
    toolbarStyle: {}
  }

  handleFullScreenClose = () => {
    this.setState({
      fullscreen: false
    })
  }

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

  renderFullScreen() {
    return (
      <FullscreenDialog isOpen onClose={this.handleFullScreenClose}>
        {this.renderCanvas()}
      </FullscreenDialog>
    )
  }

  renderCanvas() {
    const {onChange, value, editorValue, type} = this.props
    const {fullscreen, toolbarStyle} = this.state
    return (
      <div>
        { false && (
          <Toolbar
            className={styles.toolbar}
            onInsertBlock={this.handleInsertBlock}
            insertBlocks={this.customBlocks}
            onFullscreenEnable={this.handleToggleFullscreen}
            fullscreen={this.state.fullscreen}
            onMarkButtonClick={this.handleOnClickMarkButton}
            onAnnotationButtonClick={this.handleAnnotationButtonClick}
            onListButtonClick={this.handleOnClickListFormattingButton}
            onBlockStyleChange={this.handleBlockStyleChange}
            listItems={this.getListItems()}
            blockStyles={this.getBlockStyles()}
            annotations={this.getActiveAnnotations()}
            decorators={this.getActiveDecorators()}
            style={toolbarStyle}
          />
        )}
        <EditorCanvas
          value={value}
          editorValue={editorValue}
          type={type}
          fullscreen={fullscreen}
          onChange={onChange}
        />
      </div>
    )
  }

  render() {
    const {fullscreen} = this.state
    const classNames = [styles.root]
    if (fullscreen) {
      classNames.push(styles.fullscreen)
    }
    return (
      <div className={classNames.join(' ')}>
        {fullscreen ? this.renderFullScreen() : this.renderCanvas()}
      </div>
    )
  }
}
