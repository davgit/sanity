// @flow
import type {Node} from 'react'
import React from 'react'

import Header from './Header'
import Normal from './Normal'

const HEADER_STYLES = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']

type Props = {
  attributes: {},
  style: string,
  children: Node
}

export default function Text(props: Props) {
  const {attributes, style} = props
  if (HEADER_STYLES.includes(style)) {
    return (
      <Header style={style} attributes={attributes}>
        {props.children}
      </Header>
    )
  }
  return (
    <Normal attributes={attributes}>
      {props.children}
    </Normal>
  )
}
