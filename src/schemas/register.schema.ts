const register = {
  type: "object",
  properties: {
    email: {
      type: "string",
      format: "email",
      errorMessage: {
        format: "Please enter a valid email"
      }
    },
    password: {
      type: "string",
      minLength: 6,
      errorMessage: {
        minLength: "Password should have at least 6 characters"
      }
    },
    username: {
      type: "string",
      pattern: "^[\\w\\d\\s-]+$",
      minLength: 5,
      errorMessage: {
        pattern: "Please enter a valid username",
        minLength: "Username should have at least 4 characters"
      }
    },
    fistname: {
      type: "string",
      pattern: "^[\\w\\d\\s-]+$",
      errorMessage: {
        pattern: "Please enter a valid username",
      }
    },
    lastname: {
      type: "string",
      pattern: "^[\\w\\d\\s-]+$",
      errorMessage: {
        pattern: "Please enter a valid username",
      }
    },
    birthday: {
      type: "string",
      errorMessage: {
        type: "Please enter a valid birthday"
      }
    },
    roles: {
      type: "string",
      enum: ["ADMIN", "CUSTOMER", "CREATOR"],
      errorMessage: {
        enum: "Invalid type. Possible values: 'ADMIN', 'CUSTOMER', 'CREATOR'"
      }
    }
  },
  required: ["email", "birthday", "roles"],
  additionalProperties: true
}
export default register;