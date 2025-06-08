const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');   


const Schema = mongoose.Schema;

const patientSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    sex: { type: String, enum: ["male","female"], default: "male"},
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    age: { type: Number, required: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
}, { timestamps: true });

patientSchema.statics.signup = async function( email, password, firstName, lastName, sex, age, phone) {

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

patientSchema.statics.login = async function(email, password) {
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
  
  if(user.status === "inactive") {
      
      throw Error("this account is not active");
  }
  return user;
};

module.exports = mongoose.model('Patient', patientSchema);