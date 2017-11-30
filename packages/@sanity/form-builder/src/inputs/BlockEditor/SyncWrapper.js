/**
 * This is a stop-gap measure that deals with syncing of block content until realtime is in place
 */

import PropTypes from 'prop-types'
import React from 'react'
import blockTools from '@sanity/block-tools'
import generateHelpUrl from '@sanity/generate-help-url'
import FormField from 'part:@sanity/components/formfields/default'
import Input from './Input'
import {Value} from 'slate'
import PatchEvent, {set, unset} from '../../PatchEvent'
import withPatchSubscriber from '../../utils/withPatchSubscriber'
import Button from 'part:@sanity/components/buttons/default'
import styles from './styles/SyncWrapper.css'
import apply from '../../simplePatch'

const EMPTY_VALUE = Value.fromJSON(deserialize([]))

function deserialize(value, type) {
  return Value.fromJSON(blockTools.blocksToSlateState(value, type))
}

function isDeprecatedBlockSchema(type) {
  const blockType = type.of.find(ofType => ofType.name === 'block')
  if (blockType.span !== undefined) {
    return true
  }
  return false
}

function isDeprecatedBlockValue(value) {
  if (!value) {
    return false
  }
  const block = value.find(item => item._type === 'block')
  if (block && Object.keys(block).includes('spans')) {
    return true
  }
  return false
}

export default withPatchSubscriber(class SyncWrapper extends React.PureComponent {
  static propTypes = {
    schema: PropTypes.object,
    value: PropTypes.array,
    type: PropTypes.object.isRequired,
    onChange: PropTypes.func,
    subscribe: PropTypes.func
  }

  constructor(props) {
    super()
    const deprecatedSchema = isDeprecatedBlockSchema(props.type)
    const deprecatedBlockValue = isDeprecatedBlockValue(props.value)
    this.state = {
      deprecatedSchema,
      deprecatedBlockValue,
      editorValue: (deprecatedSchema || deprecatedBlockValue)
        ? EMPTY_VALUE : deserialize(props.value, props.type)
    }
    this.unsubscribe = props.subscribe(this.receivePatches)
  }

  handleChange = (change, patches) => {
    const {onChange} = this.props
    this.setState({editorValue: change.value})
    console.log(patches)
    onChange(PatchEvent.from(patches))
  }

  receivePatches = ({snapshot, shouldReset, patches}) => {
    if (patches.some(patch => patch.origin === 'remote')) {
      this.setState({isOutOfSync: true})
    }

    if (shouldReset) {
      // @todo
      // eslint-disable-next-line no-console
      // console.warn('[BlockEditor] Reset state due to set patch that targeted ancestor path:', patches)
      // this.setState({value: deserialize(snapshot, this.props.type)})
    }// else {
    //   // console.log('TODO: Apply patches:', patches)
    // }
  }

  componentWillUnmount() {
    // This is a defensive workaround for an issue causing content to be overwritten
    // It cancels any pending saves, so if the component gets unmounted within the
    // 1 second window, work may be lost.
    // This is by no means ideal, but preferable to overwriting content in other documents
    // Should be fixed by making the block editor "real" realtime
    this.emitSet.cancel()

    this.unsubscribe()
  }

  focus() {
    if (this._input) {
      this._input.focus()
    }
  }

  setInput = el => {
    this._input = el
  }

  render() {
    const {editorValue, deprecatedSchema, deprecatedBlockValue} = this.state
    const {value} = this.props

    const isDeprecated = deprecatedSchema || deprecatedBlockValue
    const {type} = this.props
    return (
      <div className={styles.root}>
        {!isDeprecated && (
          <Input
            {...this.props}
            onChange={this.handleChange}
            value={value}
            editorValue={editorValue}
            ref={this.setInput}
          />)
        }

        {isDeprecated && (

          <FormField
            label={type.title}
          >
            <div className={styles.disabledEditor}>

              <strong>Heads up!</strong>
              <p>
                You&apos;re using a new version of the Studio with

                {deprecatedSchema && ' a block schema that hasn\'t been updated.'}

                {deprecatedSchema && deprecatedBlockValue && ' Also block text needs to be updated.'}

                {deprecatedBlockValue && !deprecatedSchema && ' block text that hasn\'t been updated.'}
              </p>
              <p>
                <a
                  href={generateHelpUrl('migrate-to-block-children')}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Read more
                </a>
              </p>
            </div>
          </FormField>
        )}
      </div>
    )
  }
})
