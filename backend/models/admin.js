const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');


const Schema = mongoose.Schema;

const AdminSchema = new Schema({
    center: {
        type: Schema.Types.ObjectId,
        ref: 'Center',
    },
    role: {
        type: String,
        enum: ["superAdmin", "admin"],
        default: "admin"
    },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    sex: { type: String, enum: ["male","female"], default: "male"},
    age: { type: Number, required: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "active"
    },

}, {
    timestamps: true
});
  
  AdminSchema.statics.login = async function(email, password) {
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
    
    if(user.status === "inactive") {
      
      throw Error("this account is not active");
    }
  
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      throw Error("Incorrect password");
    }
  
    return user;
  };

// Export the Admin model
module.exports = mongoose.model('Admin', AdminSchema);