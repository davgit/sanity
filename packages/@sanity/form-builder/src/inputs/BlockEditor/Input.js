// @flow
import type {BlockArrayType, ItemValue} from './typeDefs'

import React from 'react'

import PatchEvent from '../../PatchEvent'

import FormField from 'part:@sanity/components/formfields/default'


import BlockEditor from './BlockEditor'

type Props = {
  type: BlockArrayType,
  value: Array<ItemValue>,
  editorValue: Array<ItemValue>,
  level: number,
  onChange?: PatchEvent => void
}

export default class BlockEditorInput extends React.PureComponent<Props> {

  static defaultProps = {
    onChange() {},
    onNodePatch() {}
  }

  render() {
    const {type, level, ...rest} = this.props
    return (
      <FormField
        label={type.title}
        description={type.description}
        level={level}
      >
        <BlockEditor type={type} {...rest} />
      </FormField>
    )
  }
}
