---
to: src/schemas/<%= name %>.schema.ts
---
const <%= name %> = {
  type: "object",
  properties: {
    foo: {
      type: "string",
      errorMessage: {
        type: "Invalid value"
      }
    }
  },
  required: [],
  additionalProperties: false
}
export default <%= name %>;