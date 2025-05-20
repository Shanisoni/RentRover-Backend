const mongoose = require('mongoose');
const bcryptjs = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name:{
    type: String,
    required: true,
    trim: true,
  },
  email:{
    type:String,
    required: true,
    unique: true, 
  },
  password:{
    type: String,
    required: true,
  },
  role:{
    type: String,
    required: true,
  },
  phone:{
    type: Number,
    required: true,
  },
  verified:{
    type: Boolean,
  }
},{
  timestamps: true,
})


userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcryptjs.genSalt(10);
  this.password = await bcryptjs.hash(this.password, salt);
  next();
});



module.exports = mongoose.model('User', userSchema);