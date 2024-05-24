---
to: src/schemas/index.ts
inject: true
at_line: 0
skip_if: "const <%= h.changeCase.camel(name) %>"
---
import <%= h.changeCase.camel(name) %> from './<%= name %>.schema';