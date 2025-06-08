const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");
const validator = require("validator");

const userSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  sex: { type: String, enum: ["male","female"], default: "male"},
  age: { type: Number, required: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin","doctor", "user","super-admin"], default: "user" },
}, { timestamps: true });

userSchema.statics.signup = async function( email, password, firstName, lastName, sex, age, phone) {

  if (!email || !password) {
    throw Error("Email or password cannot be empty!");
  }
  if (!validator.isEmail(email)) {
    throw Error("Invalid email format");
  }
  
  const exist = await this.findOne({ email });
  if (exist) {
    throw Error("Email is already in use, try to login");
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const user = await this.create({
    email,
    password: hash,
    firstName,
    lastName,
    sex,
    age,  
    phone,
    role: "user",
  });
  
  return user;
};

userSchema.statics.login = async function(email, password) {
  if (!email || !password) {
    throw Error("Email or password cannot be empty!");
  }
  if (!validator.isEmail(email)) {
    throw Error("Invalid email format");
  }

  const user = await this.findOne({ email });
  if (!user) {
    throw Error("No user found with this email");
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw Error("Incorrect password");
  }

  return user;
};

module.exports = mongoose.model("User", userSchema);
