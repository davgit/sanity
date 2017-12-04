// @flow

import type {BlockStyle as BlockStyleType, SlateChange, SlateValue, Type} from '../typeDefs'

import React from 'react'
import {Block} from 'slate'

import {setBlockStyle} from '../utils/changes'

import ContentBlock from '../ContentBlock'
import StyleSelect from 'part:@sanity/components/selects/style'

import styles from './styles/BlockStyle.css'

export type BlockStyleItem = {
  key: string,
  active: boolean,
  title: string,
  style: string,
  preview: Node
}

type Props = {
  editorValue: SlateValue,
  onChange: (change: SlateChange) => void,
  type: Type
}

export default class BlockStyle extends React.Component<Props> {

  blockStyles = []

  constructor(props: Props) {
    super(props)
    const blockType = props.type.of ? props.type.of.find(ofType => ofType.name === 'block') : null
    if (!blockType) {
      throw new Error("'block' type is not defined in the schema (required).")
    }
    const styleField = blockType.fields.find(field => field.name === 'style')
    if (!styleField) {
      throw new Error("A field with name 'style' is not defined in the block type (required).")
    }
    const blockStyles = styleField.type.options.list
      && styleField.type.options.list.filter(style => style.value)

    if (!blockStyles || blockStyles.length === 0) {
      throw new Error('The style fields need at least one style '
        + "defined. I.e: {title: 'Normal', value: 'normal'}.")
    }
    this.blockStyles = blockStyles
  }

  hasStyle(styleName: string) {
    const {editorValue} = this.props
    return editorValue.blocks.some(block => block.data.get('style') === styleName)
  }

  getItemsAndValue() {
    const items = this.blockStyles.map((style: BlockStyleType) => {
      const block = Block.create({
        type: 'contentBlock',
        data: {style: style.value}
      })
      const preview = (
        <ContentBlock node={block}>
          {style.title}
        </ContentBlock>
      )
      return {
        key: `style-${style.value}`,
        style: style.value,
        preview: preview,
        title: ` ${style.title}`,
        active: this.hasStyle(style.value)
      }
    })
    let value = items.filter(item => item.active)
    if (value.length === 0) {
      items.push({
        key: 'style-none',
        style: null,
        preview: <div>No style</div>,
        title: ' No style',
        active: true
      })
      value = items.slice(-1)
    }
    return {
      items: items,
      value: value
    }
  }

  handleChange = (item: BlockStyleItem) => {
    const {onChange, editorValue} = this.props
    const change = editorValue.change()
    change.call(setBlockStyle, item.style)
    onChange(change)
  }

  renderItem = (item: BlockStyleItem) => {
    return item.preview
  }

  render() {
    const {items, value} = this.getItemsAndValue()
    if (!items || items.length === 0) {
      return null
    }
    return (
      <label className={styles.root}>
        <span style={{display: 'none'}}>Text</span>
        <StyleSelect
          items={items}
          value={value}
          onChange={this.handleChange}
          renderItem={this.renderItem}
          transparent
        />
      </label>
    )
  }
}
