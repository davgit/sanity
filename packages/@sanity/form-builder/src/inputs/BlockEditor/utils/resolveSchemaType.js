export function getSpanType(blockArrayType) {
  return getSpansField(blockArrayType)
    .type.of.find(type => type.name === 'span')
}

export function getSpansField(blockArrayType) {
  return getBlockField(blockArrayType)
    .fields.find(field => field.name === 'spans')
}

export function getBlockField(blockArrayType) {
  return blockArrayType.of.find(ofType => ofType.type.name === 'block')
}

export default function resolveSchemaType(blockArrayType, nodeType) {
  switch (nodeType) {
    case 'span':
      return getSpanType(blockArrayType)
    default:
      throw new Error(`Unknown node type ${nodeType}`)
  }
}
