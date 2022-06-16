const mongoose = require("mongoose");

const voterWorkSchema = new mongoose.Schema(
  {
    
    name: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      trim: true,
      required: false,
    },
    mobile: {
      type: String,
      trim: true,
    },
    whatsapp: {
      type: String,
      trim: true,
    },
    same: {
      type: Boolean,
      trim: true,
    },
    cnic: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      trim: true,
      required: false,
    },
    block_code: {
      type: String,
      trim: true,
    },
    gender: {
      type: String,
      trim: true,
    },
    district: {
      type: String,
      trim: true,
    },
    tehsil: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      trim: true,
    },
    area: {
      type: String,
      trim: true,
    },
    block_number: {
      type: String,
      trim: true,
    },

    street_number: {
      type: String,
      trim: true
    },
    street_name: {
      type: String,
      trim: true,
    },
    near: {
      type: String,
      trim: true,
    },
    house_number: {
      type: String,
      trim: true,
    },
    remarks: {
      type: String,
      trim: true,
    },
    voter_type: {
      type: String,
      trim: true,
    },

  



    //detail 
    na: {
      type: String,
      trim: true,
    },

    pp: {
      type: String,
      trim: true,
    },

    gender: {
      type: String,
      trim: true,
    },

    qualification: {
      type: String,
      trim: true,
    },

    occupation: {
      type: String,
      trim: true,
    },

    martial_status: {
      type: String,
      trim: true,
    },

    relation: {
      type: String,
      trim: true,
    },


  },
  { timestamps: true }

);
module.exports = mongoose.model("voter", voterWorkSchema);
