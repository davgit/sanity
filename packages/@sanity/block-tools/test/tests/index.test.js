import assert from 'assert'
import defaultSchema from '../fixtures/defaultSchema'
import blockTools from '../../src'

describe('blockTools', () => {

  describe('getBlockContentTypeFeatures', () => {

    it('gives blockType features', () => {
      const blockContentType = defaultSchema.get('blogPost')
        .fields.find(field => field.name === 'body').type

      const expected = {
        annotations: ['link'],
        decorators: [
          'strong',
          'em',
          'code',
          'underline',
          'strike-through'
        ],
        styles: [
          'normal',
          'h1',
          'h2',
          'h3',
          'h4',
          'h5',
          'h6',
          'blockquote'
        ]
      }
      assert.deepEqual(blockTools.getBlockContentFeatures(blockContentType), expected)
    })
  })

})
