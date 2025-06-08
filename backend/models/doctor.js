const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const validator = require('validator');

const doctorSchema = new mongoose.Schema({
    experience: {
        type: Number,
        required: true
    },
    contactNumber: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: [validator.isEmail, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: true,
    },
    firstName: {
        type: String,
        required: true
    },  
    lastName: {
        type: String,
        required:true
    },

    desc: {
        type: String,
        required: true,
        default: "No description provided"
    },



    center: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Center',
        required: true
    },
    specialization: {
        type: String,
        enum: ["prescripteur","radiologue"],
        required: true
    },
    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "active"
    },
    img: {
        type: String,
        default: "uploads/doctors/default.png"
    },
}, { timestamps: true });

doctorSchema.statics.login = async function(email, password) {
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

const Doctor = mongoose.model('Doctor', doctorSchema);

module.exports = Doctor;