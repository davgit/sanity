// @flow

import type {Annotation} from '../typeDefs'

import React from 'react'
import ToggleButton from 'part:@sanity/components/toggles/button'

import LinkIcon from 'part:@sanity/base/link-icon'

import styles from './styles/AnnotationButton.css'

type Props = {
  onClick: Annotation => void,
  annotation: Annotation
}

export default class AnnotationButton extends React.Component<Props> {

  handleToggleButtonClick = () => {
    this.props.onClick(this.props.annotation)
  }

  render() {
    const {annotation} = this.props
    return (
      <ToggleButton
        onClick={this.handleToggleButtonClick}
        title={annotation.type.title}
        disabled={annotation.disabled}
        selected={annotation.active}
        className={styles.button}
      >
        <div className={styles.iconContainer}>
          <LinkIcon />
        </div>
      </ToggleButton>
    )
  }
}
