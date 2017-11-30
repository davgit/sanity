// @flow

import type {Map} from 'immutable'
import type {Node} from 'react'

export type Type = {
  type: Type,
  name: string,
  options: ?Object
}

export type BlockArrayType = Type & {
  name: string,
  title: string,
  description: string,
  readOnly: ?boolean,
  options: {
    editModal: 'fold' | 'modal',
    sortable: boolean,
    layout?: 'grid'
  },
  of: Type[]
}

export type ItemValue = {
  _type?: string,
  _key: string
}

export type SlateNode = {
  type: string,
  nodes: any,
  data: Map<any, any>,
  key: string
}

export type SlateComponentProps = {
  attributes: {},
  children: Node[],
  editor: Node,
  isSelected: boolean,
  key: string,
  node: SlateNode,
  parent: any,
  readOnly: boolean
}

export type BlockItem = {
  type: Type,
  title: string
}

export type BlockStyleItem = {
  key: string,
  active: boolean,
  title: string,
  preview: Node
}

export type ListItem = {
  active: boolean,
  type: string,
  title: string
}

export type DecoratorItem = {
  active: boolean,
  type: string
}

export type Annotation = any
