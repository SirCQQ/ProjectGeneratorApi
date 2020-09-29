const mongoose = require("mongoose");
const { varSchema } = require("./Var")
const { structSchema } = require('./Struct')
const { classSchema } = require("./Class")

// console.log(classSchema)
// const fileSchema = new mongoose.Schema({
//     includes: [String],
//     defines: Array,
//     class_object: [classSchema],
//     struct_obj: [structSchema],
//     vars_obj: [varSchema],
// })

const projectSchema = new mongoose.Schema({

    project_name: {
        type: String,
        required: true
    },
    project_owner: {
        type: String,
        required: true
    },
    project_colabs: {
        type: [Object]
    },
    project_type: {
        type: String,
        enum: ["c", "cpp"],
        required: true
    },
    files: {
        // type: [fileSchema]
        type:Object
    },
    description: {
        type: String
    }

});


module.exports.ProjectSchema = mongoose.model("Project", projectSchema)