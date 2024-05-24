const resendCode = {
  type: "object",
  properties: {
    email: {
      type: "string",
      format: "email",
      errorMessage: {
        type: "Please enter a valid email"
      }
    },
    type: {
      type: "string",
      enum: ["forgot-password", "validate-email"],
      errorMessage: {
        enum: "Invalid type. Possible values: 'forgot-password', 'validate-email'"
      }
    },

  },
  required: ["email",  "type"],
  additionalProperties: false
}
export default resendCode;