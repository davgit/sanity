// @flow
import type {
  BlockContentFeatures,
  ToolbarStyle,
  SlateValue,
  SlateChange
} from '../typeDefs'

import React from 'react'

import BlockStyle from './BlockStyle'
import Button from 'part:@sanity/components/buttons/default'
import DecoratorButtons from './DecoratorButtons'
import FullscreenIcon from 'part:@sanity/base/fullscreen-icon'
import CloseIcon from 'part:@sanity/base/close-icon'

import styles from './styles/Toolbar.css'

type Props = {
  blockContentFeatures: BlockContentFeatures,
  editorValue: SlateValue,
  fullscreen: boolean,
  onChange: (change: SlateChange) => void,
  onToggleFullScreen: void => void,
  style: ToolbarStyle
}

export default class Toolbar extends React.PureComponent<Props> {

  render() {
    const {
      blockContentFeatures,
      fullscreen,
      editorValue,
      onChange,
      onToggleFullScreen,
      style
    } = this.props
    const className = `${styles.root}${fullscreen ? ` ${styles.fullscreen}` : ''}`

    return (
      <div className={className} style={style}>

        <div className={styles.blockFormatContainer}>
          <BlockStyle
            editorValue={editorValue}
            onChange={onChange}
            blockContentFeatures={blockContentFeatures}
          />
        </div>
        <div className={styles.canBeMinimized}>

          <div className={styles.formatButtonsContainer}>
            <DecoratorButtons
              editorValue={editorValue}
              onChange={onChange}
              blockContentFeatures={blockContentFeatures}
            />
          </div>

        </div>

        <div className={styles.fullscreenButtonContainer}>
          <Button
            kind="simple"
            onClick={onToggleFullScreen}
            icon={fullscreen ? CloseIcon : FullscreenIcon}
          />
        </div>

      </div>
    )
  }
}
