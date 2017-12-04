export default {
  name: 'richText',
  type: 'document',
  title: 'Rich text',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string'
    },
    {
      name: 'body',
      type: 'array',
      title: 'Content',
      of: [
        {
          title: 'Block',
          type: 'block',
          styles: [
            {title: 'Normal', value: 'normal'},
            {title: 'H1', value: 'h1'},
            {title: 'H2', value: 'h2'}
          ]
        },
        {
          title: 'Image',
          type: 'image',
          fields: [
            {
              name: 'caption',
              type: 'string',
              title: 'Caption'
            }
          ]
        }
      ]
    }
  ]
}
