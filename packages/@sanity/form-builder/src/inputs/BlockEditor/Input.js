// @flow
import type {
  Block,
  BlockArrayType,
  Patch,
  SlateChange,
  SlateValue
} from './typeDefs'

import React from 'react'

import FormField from 'part:@sanity/components/formfields/default'

import BlockEditor from './BlockEditor'

type Props = {
  editorValue: SlateValue,
  level: number,
  onChange: (change: SlateChange, patches: Patch[]) => void,
  type: BlockArrayType,
  value: Block[]
}

export default class BlockEditorInput extends React.PureComponent<Props> {

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
