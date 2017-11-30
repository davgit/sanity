// @flow

import type {BlockItem} from '../typeDefs'

import React from 'react'
import DropDownButton from 'part:@sanity/components/buttons/dropdown'

type Props = {
  onInsertBlock: void => void,
  blocks: BlockItem[]
}

export default class InsertBlocks extends React.Component<Props> {

  shouldComponentUpdate(nextProps: Props) {
    return this.props.blocks !== nextProps.blocks
  }

  render() {
    return (
      <DropDownButton
        items={this.props.blocks}
        onAction={this.props.onInsertBlock}
        kind="simple"
        origin="right"
      >
        Insert
      </DropDownButton>
    )
  }
}
