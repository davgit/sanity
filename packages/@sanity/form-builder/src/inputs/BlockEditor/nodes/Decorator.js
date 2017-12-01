// @flow

import type {Node} from 'react'
import React from 'react'
import styles from './styles/Decorator.css'

type Props = {
  attributes: {},
  mark: {type: string},
  children: Node
}

export default function Decorator(props: Props) {
  return (
    <span {...props.attributes} className={styles[props.mark.type]}>
      {props.children}
    </span>
  )
}
