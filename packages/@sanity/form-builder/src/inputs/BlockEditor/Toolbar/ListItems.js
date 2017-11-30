// @flow

import type {ListItem as ListItemType} from '../typeDefs'

import React from 'react'

import FormatListBulletedIcon from 'part:@sanity/base/format-list-bulleted-icon'
import FormatListNumberedIcon from 'part:@sanity/base/format-list-numbered-icon'
import SanityLogoIcon from 'part:@sanity/base/sanity-logo-icon'
import ToggleButton from 'part:@sanity/components/toggles/button'

import styles from './styles/ListItems.css'


function getIcon(type) {
  switch (type) {
    case 'number':
      return FormatListNumberedIcon
    case 'bullet':
      return FormatListBulletedIcon
    default:
      return SanityLogoIcon
  }
}

type Props = {
  listItems: ListItemType[],
  onClick: (type: string, active: boolean) => void
}

export default class ListItem extends React.Component<Props> {

  renderButton = (listItem: ListItemType) => {
    const onClick = event => {
      this.props.onClick(listItem.type, listItem.active)
    }
    const Icon = getIcon(listItem.type)
    return (
      <ToggleButton
        key={`listButton${listItem.type}`}
        selected={listItem.active}
        onClick={onClick}
        title={listItem.title}
      >
        <div className={styles.iconContainer}>
          <Icon />
        </div>
      </ToggleButton>
    )
  }


  render() {
    return (
      <div className={styles.root}>
        {
          this.props.listItems.map(this.renderButton)
        }
      </div>
    )
  }
}
