// @flow

import type {BlockContentFeature, BlockContentFeatures} from '../typeDefs'

import React from 'react'
import {Change, Value as SlateValue} from 'slate'

import {createFormBuilderSpan, removeAnnotationFromSpan} from '../utils/changes'

import ToggleButton from 'part:@sanity/components/toggles/button'
import LinkIcon from 'part:@sanity/base/link-icon'

import styles from './styles/AnnotationButtons.css'

type AnnotationItem = {
  title: string,
  value: string,
  active: boolean,
  disabled: boolean
}

type Props = {
  blockContentFeatures: BlockContentFeatures,
  editorValue: SlateValue,
  onChange: Change => void
}

function getIcon(type: string) {
  switch (type) {
    default:
      return LinkIcon
  }
}

export default class AnnotationButtons extends React.Component<Props> {

  hasAnnotation(annotationName: string) {
    const {editorValue} = this.props
    const spans = editorValue.inlines.filter(inline => inline.type === 'span')
    return spans.some(span => {
      const annotations = span.data.get('annotations') || {}
      return Object.keys(annotations).find(key => annotations[key]._type === annotationName)
    })
  }

  getItems() {
    const {blockContentFeatures} = this.props
    return blockContentFeatures.annotations.map((annotation: BlockContentFeature) => {
      return {
        ...annotation,
        active: this.hasAnnotation(annotation.value),
        disabled: false
      }
    })
  }

  handleClick = (item: AnnotationItem) => {
    const {onChange, editorValue} = this.props
    const change = editorValue.change()
    change.focus()
    if (item.active) {
      const spans = editorValue.inlines.filter(inline => inline.type === 'span')
      spans.forEach(span => {
        change.call(removeAnnotationFromSpan, span, item.value)
      })
      onChange(change)
      return
    }
    change.call(createFormBuilderSpan, item.value)
    change.blur()
    onChange(change)
  }

  renderAnnotationButton = (item: AnnotationItem) => {
    const Icon = getIcon(item.value)
    const onClick = () => this.handleClick(item)
    return (
      <ToggleButton
        key={`decoratorButton${item.value}`}
        selected={!!item.active}
        disabled={item.disabled}
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
        {items.map(this.renderAnnotationButton)}
      </div>
    )
  }
}
