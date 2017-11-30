// @flow

import type {BlockStyleItem} from '../typeDefs'

import React from 'react'
import StyleSelect from 'part:@sanity/components/selects/style'
import styles from './styles/BlockStyle.css'


type Props = {
  value: BlockStyleItem[],
  items: BlockStyleItem[],
  onSelect: void => void
}

export default class BlockStyle extends React.Component<Props> {

  renderItem = (item: BlockStyleItem) => {
    return item.preview
  }

  render() {
    if (!this.props.items || this.props.items.length === 0) {
      return null
    }
    return (
      <label className={styles.root}>
        <span style={{display: 'none'}}>Text</span>
        <StyleSelect
          items={this.props.items}
          value={this.props.value}
          onChange={this.props.onSelect}
          renderItem={this.renderItem}
          transparent
        />
      </label>
    )
  }
}
