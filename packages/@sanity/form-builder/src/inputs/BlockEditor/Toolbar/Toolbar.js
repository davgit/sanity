// @flow
import type {ToolbarStyle, Type, SlateValue, SlateChange} from '../typeDefs'

import React from 'react'

import BlockStyle from './BlockStyle'
import Button from 'part:@sanity/components/buttons/default'
import FullscreenIcon from 'part:@sanity/base/fullscreen-icon'
import CloseIcon from 'part:@sanity/base/close-icon'

import styles from './styles/Toolbar.css'

type Props = {
  editorValue: SlateValue,
  fullscreen: boolean,
  onChange: (change: SlateChange) => void,
  onToggleFullScreen: void => void,
  style: ToolbarStyle,
  type: Type
}

export default class Toolbar extends React.PureComponent<Props> {


  render() {
    const {
      fullscreen,
      editorValue,
      onChange,
      onToggleFullScreen,
      style,
      type
    } = this.props

    return (
      <div
        className={`${styles.root}${fullscreen ? ` ${styles.fullscreen}` : ''}`}
        style={style}
      >

        <div className={styles.blockFormatContainer}>
          <BlockStyle
            editorValue={editorValue}
            onChange={onChange}
            type={type}
          />
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
