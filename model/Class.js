const mongoose = require("mongoose");
const {varSchema} = require('./Var')

const constructorSchema = new mongoose.Schema({
    constructor_type: {
        type:String,
        enum: ["public", "private"]
    },
    constructor_values:{
        type:String,
        enum: ["empty", "all"]
    },
})


const classSchema = new mongoose.Schema({

    class_owner: {
        type: String,
        required: true
    },
    class_name: {
        type: String,
        required: true
    },
    class_constructor: {
        type:constructorSchema,
        required:true
    },
    public: {
        type: [varSchema],
        required: true,
    },
    private: {
        type: [varSchema],
        required: true
    },
    getters: {
        type: Array,
        required: true
    },
    setters: {
        type: Array,
        required: true
    },
    description: {
        type: String
    }

});


// console.log(classSchema)
module.exports.ClassSchema = mongoose.model("Class", classSchema)
module.exports.classSchema = classSchema