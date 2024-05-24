const loginSchema: object  = {
  type: "object",
  properties: {
    email: {
      type: "string",
      format: "email",
      errorMessage: {
        format: "Invalid email type"
      }
    },
    password: {
      type: "string",
      minLength: 6,
      errorMessage: {
        minLength: "Password should have at least 6 characters"
      }
    }
  },
  required: ["email", "password"],
  additionalProperties: false
}

export default loginSchema;