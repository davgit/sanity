// @flow

import type {BlockContentFeature, BlockContentFeatures, SlateChange, SlateValue} from '../typeDefs'

import React from 'react'

import {toggleMark} from '../utils/changes'

import FormatBoldIcon from 'part:@sanity/base/format-bold-icon'
import FormatItalicIcon from 'part:@sanity/base/format-italic-icon'
import FormatStrikethroughIcon from 'part:@sanity/base/format-strikethrough-icon'
import FormatUnderlinedIcon from 'part:@sanity/base/format-underlined-icon'
import FormatCodeIcon from 'part:@sanity/base/format-code-icon'
import SanityLogoIcon from 'part:@sanity/base/sanity-logo-icon'
import ToggleButton from 'part:@sanity/components/toggles/button'

import styles from './styles/DecoratorButtons.css'

type DecoratorItem = {
  title: string,
  value: string,
  active: boolean
}

type Props = {
  blockContentFeatures: BlockContentFeatures,
  editorValue: SlateValue,
  onChange: (change: SlateChange) => void
}

function getIcon(type: string) {
  switch (type) {
    case 'strong':
      return FormatBoldIcon
    case 'em':
      return FormatItalicIcon
    case 'underline':
      return FormatUnderlinedIcon
    case 'strike-through':
      return FormatStrikethroughIcon
    case 'code':
      return FormatCodeIcon
    default:
      return SanityLogoIcon
  }
}

export default class DecoratorButtons extends React.Component<Props> {

  hasDecorator(decoratorName: string) {
    const {editorValue} = this.props
    return editorValue.marks.some(mark => mark.type === decoratorName)
  }

  getItems() {
    const {blockContentFeatures} = this.props
    return blockContentFeatures.decorators.map((decorator: BlockContentFeature) => {
      return {
        ...decorator,
        active: this.hasDecorator(decorator.value)
      }
    })
  }

  handleClick = (item: DecoratorItem) => {
    const {onChange, editorValue} = this.props
    const change = editorValue.change()
    change.call(toggleMark, item.value)
    onChange(change)
  }

  renderDecoratorButton = (item: DecoratorItem) => {
    const Icon = getIcon(item.value)
    const onClick = () => this.handleClick(item)
    return (
      <ToggleButton
        key={`decoratorButton${item.value}`}
        selected={!!item.active}
        onClick={onClick}
        title={item.title}
        className={styles.button}
      >
        <div className={styles.iconContainer}>
          <Icon />
        </div>
      </ToggleButton>
    )
  }

  render() {
    const items = this.getItems()
    return (
      <div className={styles.root}>
        {items.map(this.renderDecoratorButton)}
      </div>
    )
  }
}
