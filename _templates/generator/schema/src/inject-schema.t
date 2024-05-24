---
to: src/schemas/index.ts
inject: true
after: "export default {"
skip_if: "<%= h.changeCase.camel(name) %>,"
---
  <%= h.changeCase.camel(name) %>,