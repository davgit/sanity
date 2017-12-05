// @flow
import type {SlateValue, Type, SlateChange} from '../typeDefs'
import type {Node} from 'react'

import React from 'react'
import {Inline} from 'slate'

import PatchEvent from '../../../PatchEvent'
import {applyAll} from '../../../simplePatch'

import {removeSpan} from '../utils/changes'

import {FormBuilderInput} from '../../../FormBuilderInput'
import DefaultButton from 'part:@sanity/components/buttons/default'
import EditItemPopOver from 'part:@sanity/components/edititem/popover'

import styles from './styles/Span.css'

function isEmpty(object, ignoreKeys) {
  for (const key in object) {
    if (!ignoreKeys.includes(key)) {
      return false
    }
  }
  return true
}

type Props = {
  attributes: {},
  children: Node,
  editorValue: SlateValue,
  node: Inline,
  onChange: SlateChange,
  type: Type
}

type State = {
  focusedAnnotationName: ?string,
  isEditing: boolean
}

export default class Span extends React.Component<Props, State> {

  state = {isEditing: false, focusedAnnotationName: undefined}

  _clickCounter = 0
  _isMarkingText = false

  componentWillMount() {
    const focusedAnnotationName = this.props.node.data
      && this.props.node.data.get('focusedAnnotationName')
    this.setState({
      isEditing: false,
      focusedAnnotationName
    })
  }

  componentDidMount() {
    if (this.state.focusedAnnotationName) {
      this.setState({isEditing: true})
    }
  }

  shouldComponentUpdate(nextProps: Props, nextState: State) {
    const {editorValue} = nextProps
    return nextState.isEditing !== this.state.isEditing
      || nextState.focusedAnnotationName !== this.state.focusedAnnotationName
      || editorValue.focusOffset !== this.props.editorValue.focusOffset
      || nextProps.node.data !== this.props.node.data
  }

  componentWillUpdate(nextProps: Props, nextState: State) {
    // If annotations where emptied, just destroy this span (unwrap it to text actually)
    if (!nextProps.node.data.get('annotations')) {
      this.destroy()
    }
  }

  componentDidUpdate() {
    // Close popover and clean up if it is unnanotated and no annotation type is in focus
    if (this.isUnannotated()
        && this.state.isEditing && !this.state.focusedAnnotationName) {
      this.handleCloseInput()
    }
  }

  destroy = () => {
    const {editorValue, onChange} = this.props
    const change = editorValue.change()
    change.call(removeSpan, this.props.node)
    onChange(change)
  }

  isUnannotated() {
    const annotations = this.getAnnotations()
    if (!annotations) {
      return true
    }
    return !Object.keys(annotations).filter(key => {
      return !this.isEmptyAnnotation(annotations[key])
    }).length === 0
  }

  isEmptyAnnotation = (annotation: {}) => {
    return isEmpty(annotation, ['_type', '_key'])
  }

  getAnnotations() {
    return this.props.node.data.get('annotations')
  }

  handleCloseInput = () => {
    if (this.state.isEditing) {
      this.setState({isEditing: false, focusedAnnotationName: undefined})
    }
    this.garbageCollect()
  }

  garbageCollect() {
    const {editorValue, node, onChange} = this.props
    const nextAnnotations = {...this.getAnnotations()}
    Object.keys(nextAnnotations).forEach(key => {
      if (this.isEmptyAnnotation(nextAnnotations[key])) {
        delete nextAnnotations[key]
      }
    })
    const data = {
      ...node.data.toObject(),
      focusedAnnotationName: undefined,
      annotations: Object.keys(nextAnnotations).length === 0
        ? undefined
        : nextAnnotations
    }
    const change = editorValue.change()
    change
      .setNodeByKey(node.key, {data})
      .focus()
    onChange(change)
  }

  focusAnnotation(annotationName: string) {
    const {editorValue, node, onChange} = this.props
    this.setState({focusedAnnotationName: annotationName})
    const data = {
      ...node.data.toObject(),
      focusedAnnotationName: annotationName
    }
    const change = editorValue.change()
    change.setNodeByKey(node.key, {data})
    onChange(change)
  }

  // Open dialog when user clicks the node,
  // but support double clicks, and mark text as normal
  handleMouseDown = () => {
    this._isMarkingText = true
    setTimeout(() => {
      if (this._clickCounter === 1 && !this._isMarkingText) {
        this.setState({isEditing: true})
      }
      this._clickCounter = 0
    }, 350)
    this._clickCounter++
  }

  handleMouseUp = () => {
    this._isMarkingText = false
  }

  handleClick = () => {
    const {type} = this.props
    // Don't do anyting if this type doesn't support any annotations.
    if (!type.annotations || type.annotations.length === 0) {
      return
    }
    const annotations = this.getAnnotations()
    // Try to figure out which annotation that should be focused when user clicks the span
    let focusedAnnotationName
    if (type.annotations && type.annotations.length === 1) { // Only one annotation type, always focus this one
      focusedAnnotationName = type.annotations[0].name
    } else if (annotations && Object.keys(annotations).length === 1) { // Only one annotation value, focus it
      focusedAnnotationName = annotations[Object.keys(annotations)[0]]._type
    }
    if (focusedAnnotationName) {
      this.focusAnnotation(focusedAnnotationName)
    }
    // If no focusedAnnotationName was found, buttons to edit respective annotations will be show
  }

  handleAnnotationChange = (event: PatchEvent) => {
    const {editorValue, node, onChange} = this.props
    const name = this.state.focusedAnnotationName
    const annotations = this.getAnnotations()
    const nextAnnotations = {
      ...annotations,
      [name]: applyAll(annotations[name], event.patches)
    }
    const data = {
      ...node.data.toObject(),
      focusedAnnotationName: this.state.focusedAnnotationName,
      annotations: nextAnnotations
    }
    const change = editorValue.change()
    change.setNodeByKey(node.key, {data})
    onChange(change)
  }

  renderInput() {
    const annotations = this.getAnnotations()
    const annotationTypes = this.props.type.annotations
    const {focusedAnnotationName} = this.state

    const annotationTypeInFocus = annotationTypes && annotationTypes.find(type => {
      return type.name === focusedAnnotationName
    })
    const focusedAnnotationKey = Object.keys(annotations).find(key => {
      return annotations[key]._type === focusedAnnotationName
    })
    const annotationValue = focusedAnnotationKey
      && annotations && annotations[focusedAnnotationKey]

    return (
      <span className={styles.editSpanContainer}>
        <EditItemPopOver
          onClose={this.handleCloseInput}
        >
          { /* Buttons for selecting annotation when there are several, and none is focused  */ }
          { !focusedAnnotationName && Object.keys(annotations).length > 1 && (
            <div>
              <h3>Which annotation?</h3>
              {
                Object.keys(annotations).map(annotationKey => {
                  if (!annotations[annotationKey]) {
                    return null
                  }
                  const setFieldFunc = () => {
                    this.focusAnnotation(annotations[annotationKey]._type)
                  }
                  const annotationType = annotationTypes && annotationTypes
                    .find(type => type.name === annotations[annotationKey]._type)

                  return (
                    <DefaultButton
                      key={`annotationButton${annotationKey}`}
                      onClick={setFieldFunc}
                    >
                      {annotationType ? annotationType.title : null}
                    </DefaultButton>
                  )
                })
              }
            </div>
          )}

          { /* Render input for focused annotation  */ }
          { focusedAnnotationName && (
            <div>
              <FormBuilderInput
                value={annotationValue}
                type={annotationTypeInFocus}
                level={0}
                onChange={this.handleAnnotationChange}
                autoFocus
              />
            </div>
          )}
        </EditItemPopOver>
      </span>
    )
  }

  render() {
    const {isEditing} = this.state
    const {attributes} = this.props
    return (
      <span
        {...attributes}
        onMouseDown={this.handleMouseDown}
        onMouseUp={this.handleMouseUp}
        onClick={this.handleClick}
        className={styles.root}
      >
        {this.props.children}

        { isEditing && this.renderInput() }

      </span>
    )
  }
}
