const mongoose = require("mongoose");
const {varSchema} =require("./Var")
const structSchema = new mongoose.Schema({

    struct_owner: {
        type: String,
        required: true
    },
    struct_name: {
        type: String,
        required: true
    },
    struct_variables: {
        type: [varSchema],
        required: true
    },
    description: {
        type: String
    }

});

module.exports.structSchema = structSchema
module.exports.StructSchema = mongoose.model("Struct", structSchema)