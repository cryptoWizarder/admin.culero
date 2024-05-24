const confirmVerifyCode = {
  type: "object",
  properties: {
    email: {
      type: "string",
      format: "email",
      errorMessage: {
        format: "Please enter a valid email"
      }
    },
    code: {
      oneOf: [
        {
          type: "integer",
          maximum: 1000000,
          errorMessage: {
            minLength: "Verification Code should have at least 4 characters"
          }
        },
        {
          type: "string",
          pattern: "\\d{6,}",
          errorMessage: {
            pattern: "Verification Code should have at least 4 characters"
          }
        }
      ]
    },

  },
  required: ["email", "code"],
  additionalProperties: false
}
export default confirmVerifyCode;