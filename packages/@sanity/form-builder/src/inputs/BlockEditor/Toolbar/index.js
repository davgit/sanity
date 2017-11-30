// @flow

import type {ToolbarStyle} from '../BlockEditor'
import type {
  Annotation,
  BlockItem,
  BlockStyleItem,
  DecoratorItem,
  ListItem
} from '../typeDefs'

import React from 'react'
import styles from './styles/Toolbar.css'
import InsertBlocks from './InsertBlocks'
import Decorators from './Decorators'
import ListItems from './ListItems'
import BlockStyle from './BlockStyle'
import Button from 'part:@sanity/components/buttons/default'
import FullscreenIcon from 'part:@sanity/base/fullscreen-icon'
import CloseIcon from 'part:@sanity/base/close-icon'
import AnnotationButton from './AnnotationButton'

type Props = {
  className: string,
  style: ToolbarStyle,
  fullscreen: boolean,
  blockStyles: {
    value: BlockStyleItem[],
    items: BlockStyleItem[],
    onSelect: BlockStyleItem => void
  },
  annotations: Annotation[],
  decorators: DecoratorItem[],
  insertBlocks: BlockItem[],
  listItems: ListItem[],
  onInsertBlock: BlockItem => void,
  onFullscreenEnable: void => void,
  onMarkButtonClick: DecoratorItem => void,
  onListButtonClick: ListItem => void,
  onBlockStyleChange: BlockStyleItem => void,
  onAnnotationButtonClick: Annotation => void
}

export default class Toolbar extends React.Component<Props> {

  shouldComponentUpdate(nextProps: Props) {
    return (
      this.props.decorators !== nextProps.decorators
      || this.props.blockStyles !== nextProps.blockStyles
      || this.props.fullscreen !== nextProps.fullscreen
      || this.props.annotations !== nextProps.annotations
    )
  }

  render() {
    const {
      className,
      fullscreen,
      annotations,
      decorators,
      listItems,
      blockStyles,
      insertBlocks,
      onInsertBlock,
      onMarkButtonClick,
      onListButtonClick,
      onBlockStyleChange,
      onAnnotationButtonClick,
      style
    } = this.props

    return (
      <div className={`${styles.root} ${className}`} style={style}>
        <div className={styles.blockFormatContainer}>
          <BlockStyle value={blockStyles.value} items={blockStyles.items} onSelect={onBlockStyleChange} />
        </div>

        <div className={styles.canBeMinimized}>

          <div className={styles.formatButtons}>
            {decorators && decorators.length > 0 && (
              <div className={styles.decoratorContainer}>
                <Decorators decorators={decorators} onClick={onMarkButtonClick} />
              </div>
            )}

            {listItems && listItems.length > 0 && (
              <div className={styles.listFormatContainer}>
                <ListItems listItems={listItems} onClick={onListButtonClick} />
              </div>
            )}
          </div>

          {annotations && annotations.length > 0 && (
            <div className={styles.annotationsContainer}>
              {
                annotations.map(annotation => {
                  return (
                    <AnnotationButton
                      key={`annotationButton${annotation.type.name}`}
                      annotation={annotation} onClick={onAnnotationButtonClick}
                    />
                  )
                })
              }
            </div>
          )}
        </div>

        {insertBlocks.length > 0 && (
          <div className={styles.insertContainer}>
            <InsertBlocks blocks={insertBlocks} onInsertBlock={onInsertBlock} />
          </div>
        )}

        <div className={styles.fullscreenButtonContainer}>
          <Button
            kind="simple"
            onClick={this.props.onFullscreenEnable}
            icon={fullscreen ? CloseIcon : FullscreenIcon}
          />
        </div>
      </div>
    )
  }
}
