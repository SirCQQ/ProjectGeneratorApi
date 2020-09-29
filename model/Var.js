const mongoose = require("mongoose");

const varSchema = new mongoose.Schema({
    variable_type: String,
    variable_name: String,
    variable_value:mongoose.Schema.Types.Mixed
})

module.exports.varSchema = varSchema