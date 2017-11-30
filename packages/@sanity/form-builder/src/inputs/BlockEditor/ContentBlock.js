// @flow
import type {SlateComponentProps} from './typeDefs'

import React from 'react'

import ListItem from './nodes/ListItem'
import Text from './nodes/Text'

export default function ContentBlock(props: SlateComponentProps) {
  const data = props.node.data
  const listItem = data.get('listItem')
  const level = data.get('level')
  const style = data.get('style')
  if (listItem) {
    return (
      <ListItem listStyle={listItem} level={level}>
        <Text style={style} attributes={props.attributes}>
          {props.children}
        </Text>
      </ListItem>
    )
  }
  return (
    <Text style={style} attributes={props.attributes}>
      {props.children}
    </Text>
  )
}
