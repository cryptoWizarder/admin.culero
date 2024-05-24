import mongoose, { InferSchemaType } from 'mongoose';
// import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      default: '',
    },
    email: {
      type: String,
      default: '',
    },
    firstname: {
      type: String,
      default: '',
    },
    lastname: {
      type: String,
      default: '',
    },
    picture: {
      type: String,
      default: '',
    },
    avg_score: {
      type: Number,
      default: 0,
    },
    github: {
      type: String,
      default: '',
    },
    linkedin: {
      type: String,
      default: '',
    },
    active: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);


const User = mongoose.model('User', userSchema);

export default User;
