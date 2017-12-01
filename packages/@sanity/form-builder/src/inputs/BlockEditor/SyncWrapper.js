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
import PatchEvent from '../../PatchEvent'
import withPatchSubscriber from '../../utils/withPatchSubscriber'
import styles from './styles/SyncWrapper.css'

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
      isOutOfSync: false,
      editorValue: (deprecatedSchema || deprecatedBlockValue)
        ? EMPTY_VALUE : deserialize(props.value, props.type)
    }
    this.unsubscribe = props.subscribe(this.receivePatches)
  }

  handleChange = (change, patches) => {
    const {onChange} = this.props
    this.setState({editorValue: change.value})
    // console.log(patches)
    onChange(PatchEvent.from(patches))
  }

  receivePatches = ({patches, shouldReset, snaphot}) => {
    if (patches.some(patch => patch.origin === 'remote')) {
      this.setState({isOutOfSync: true})
    }
  }

  componentWillReceiveProps(nextProps) {
    const {value} = nextProps
    if (this.state.isOutOfSync) {
      this.setState({
        editorValue: deserialize(value, this.props.type),
        isOutOfSync: false
      })
    }
  }

  componentWillUnmount() {
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
