const changePassword = {
  type: "object",
  properties: {
    user_id: {
      type: "string",
      minLength: 24,
      errorMessage: {
        minLength: "User ID should have at least 24 hex characters"
      }
    },
    old_password: {
      type: "string",
      minLength: 6,
      errorMessage: {
        minLength: "Password should have at least 6 characters"
      }
    },
    new_password: {
      type: "string",
      minLength: 6,
      errorMessage: {
        minLength: "Password should have at least 6 characters"
      }
    }
  },
  required: ["user_id", "old_password",  "new_password"],
  additionalProperties: false
}
export default changePassword;