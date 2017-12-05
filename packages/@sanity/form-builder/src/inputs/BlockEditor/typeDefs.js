// @flow

import type {Map, List} from 'immutable'
import type {Node} from 'react'
import type {Patch as _Patch} from '../../utils/patches'
import {Change, Block as SlateBlock, Value as _SlateValue, Operation as _SlateOperation} from 'slate'

export type Patch = _Patch

export type Type = {
  type: Type,
  name: string,
  options?: Object,
  of?: [],
  annotations?: {title: string, name: string}[]
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

export type Span = {
  _key: string,
  text: string
}

export type Block = {
  _type: string,
  _key: string,
  children?: Span[]
}

export type SlateNode = {
  type: string,
  nodes?: any[],
  data?: Map<any, any>,
  key?: string
}

export type SlateMarkProps = {
  attributes: {},
  mark: {
    type: string
  },
  children: Node[],
}

export type SlateComponentProps = {
  attributes?: {},
  children: Node[],
  editor?: Node,
  isSelected?: boolean,
  key?: string,
  node: SlateNode,
  parent?: any,
  readOnly?: boolean
}

export type BlockItem = {
  type: Type,
  title: string
}

export type ListItem = {
  active: boolean,
  type: string,
  title: string
}

export type SlateValue = _SlateValue
export type SlateOperation = _SlateOperation

export type SlateChange = Change

export type Annotation = any

export type BlockContentFeature = {
  title: string,
  value: string
}

export type BlockContentFeatures = {
  decorators: BlockContentFeature[],
  styles: BlockContentFeature[],
  annotations: BlockContentFeature[]
}

export type ToolbarStyle = {
  backgroundColor?: string,
  boxShadow? : string
}
