// @flow

import type {DecoratorItem} from './typeDefs'

import React from 'react'
import ToggleButton from 'part:@sanity/components/toggles/button'

import FormatBoldIcon from 'part:@sanity/base/format-bold-icon'
import FormatItalicIcon from 'part:@sanity/base/format-italic-icon'
import FormatStrikethroughIcon from 'part:@sanity/base/format-strikethrough-icon'
import FormatUnderlinedIcon from 'part:@sanity/base/format-underlined-icon'
import FormatCodeIcon from 'part:@sanity/base/format-code-icon'
import SanityLogoIcon from 'part:@sanity/base/sanity-logo-icon'

import styles from './styles/Decorators.css'

type Props = {
  onClick: DecoratorItem => void,
  decorators: DecoratorItem[]
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

export default class Decorators extends React.Component<Props> {

  renderDecoratorButton = (item: DecoratorItem) => {
    const onClick = event => {
      this.props.onClick(item)
    }
    const Icon = getIcon(item.type)
    let title = item.type
    title = title.charAt(0).toUpperCase() + title.slice(1)
    return (
      <ToggleButton
        key={`decoratorButton${item.type}`}
        selected={!!item.active}
        onClick={onClick}
        title={title}
        className={styles.button}
      >
        <div className={styles.iconContainer}>
          <Icon />
        </div>
      </ToggleButton>
    )
  }

  render() {
    return this.props.decorators ? (
      <div className={styles.root}>
        {this.props.decorators.map(this.renderDecoratorButton)}
      </div>
    ) : null
  }
}
