
const { ClassSchema } = require("./model/Class");
const { StructSchema } = require("./model/Struct");
const { ProjectSchema } = require("./model/Project");
const User =require('./model/User')
const mogoose = require("mongoose");
mogoose.connect("mongodb+srv://licenta:parola@cluster0-qsztw.mongodb.net/licenta?retryWrites=true&w=majority",
    { useUnifiedTopology: true, useNewUrlParser: true },
    () => {
        console.log("Connected to database");
    })

//Create a new user 
const struct = new StructSchema({
    struct_owner: "5ece6971f8affb26b8010a9e",
    struct_name: "Reactor",
    struct_variables: [{
        variable_type: "int",
        variable_name: "max_temperature",
        variable_value: 256
    },
    {
        variable_type: "int",
        variable_name: "min_temperature",
        variable_value: 64
    },
    {
        variable_type: "int",
        variable_name: "actual_temperature",
        variable_value: 164
    }
    ],
    description: "This is a structure of data that represent a reactor"
})
//Saving into database

async function toDatabase(struct) {
    try {
        const savedStructure = await struct.save();
        // res.json({struct:savedStructure})
        // 
        console.log("Create success")
    }
    //Catching any errors
    catch (e) {
        // res.status(400).send(e)
        console.log(e)
    }
}

const class_for_db = new ClassSchema({
    class_owner: "5ece6971f8affb26b8010a9e",
    class_name: "NuclearReactor",
    public: [{
        variable_type: "int",
        variable_name: "temperature_till_optim",
        variable_value: 39
    }
    ],
    class_constructor: {
        constructor_type: 'public',
        constructor_values: 'empty'
    },
    private: [{
        variable_type: "int",
        variable_name: "uranium_grams",
        variable_value: 10
    },
    {
        variable_type: "int",
        variable_name: "min_temperature",
        variable_value: 128
    },
    {
        variable_type: "int",
        variable_name: "max_temperature",
        variable_value: 256
    },
    {
        variable_type: "int",
        variable_name: "temperature",
        variable_value: 186
    }
    ],
    getters: ["temperature", "max_temperature", "min_temperature"],
    setters: ["temperature_till_optim"]
    ,
    description: "Class for temperature of a nuclear reactor"
})


const project = new ProjectSchema({
    project_name: "Reactor Controll",
    project_owner: "5ece6971f8affb26b8010a9e",
    project_colabs: [{user_id:"5ece882050d340457081f039",name:"Gatu Cristian2"}],
    project_type: "cpp",
    files: [{
        file_name: "File_name_1",
        file_owner: 1,
        file_type: "cpp",
        file_structure: {
            includes: ["iostream", "string", "stdio.h"],
            defines: [
                ["DEFINE_NAME", 256],
                ["MAX_NUMBER_OF_ITERATIONS", "3"],
            ],
            vars_obj: [
                {
                    variable_type: "int",
                    variable_name: "name",
                    variable_value: 2,
                },
                {
                    variable_type: "int",
                    variable_name: "number_of_apples",
                    variable_value: 3,
                },
            ],
        },
    },
    {
        file_name: "File_name_2",
        file_owner: 1,
        file_type: "cpp",
        file_structure: {
            includes: ["iostream", "string", "stdio.h"],
            class_object: {
                class_name: "NuclearReactor",
                public: [{
                    variable_type: "int",
                    variable_name: "temperature_till_optim",
                    variable_value: 39
                }
                ],
                class_constructor: {
                    constructor_type: 'public',
                    constructor_values: 'empty'
                },
                private: [{
                    variable_type: "int",
                    variable_name: "uranium_grams",
                    variable_value: 10
                },
                {
                    variable_type: "int",
                    variable_name: "min_temperature",
                    variable_value: 128
                },
                {
                    variable_type: "int",
                    variable_name: "max_temperature",
                    variable_value: 256
                },
                {
                    variable_type: "int",
                    variable_name: "temperature",
                    variable_value: 186
                }
                ],
                getters: ["temperature", "max_temperature", "min_temperature"],
                setters: ["temperature_till_optim"]
                ,
                description: "Class for temperature of a nuclear reactor"
            }
        }
    },
    {
        file_name: "File_name_3",
        file_owner: 1,
        file_type: "cpp",
        file_structure: {
            includes: ["iostream", "string", "stdio.h"],
            defines: [
                ["DEFINE_NAME", 256],
                ["MAX_NUMBER_OF_ITERATIONS", "3"],
            ],
            struct_obj: [
                {
                    struct_name: "Reactor",
                    struct_variables: [{
                        variable_type: "int",
                        variable_name: "max_temperature",
                        variable_value: 256
                    },
                    {
                        variable_type: "int",
                        variable_name: "min_temperature",
                        variable_value: 64
                    },
                    {
                        variable_type: "int",
                        variable_name: "actual_temperature",
                        variable_value: 164
                    }
                    ],
                    description: "This is a structure of data that represent a reactor"
                },
            ],
            vars_obj: [
                {
                    variable_type: "int",
                    variable_name: "name",
                    variable_value: 2,
                },
                {
                    variable_type: "int",
                    variable_name: "number_of_apples",
                    variable_value: 3,
                },
            ],
        },
    },
    {
        file_name: "File_name_4",
        file_owner: 1,
        file_type: "cpp",
        file_structure: {
            includes: ["iostream", "string", "stdio.h"],
            defines: [
                ["DEFINE_NAME", 256],
                ["MAX_NUMBER_OF_ITERATIONS", "3"],
            ],
            class_object: {
                class_name: "NuclearReactor",
                public: [{
                    variable_type: "int",
                    variable_name: "temperature_till_optim",
                    variable_value: 39
                }
                ],
                class_constructor: {
                    constructor_type: 'public',
                    constructor_values: 'empty'
                },
                private: [{
                    variable_type: "int",
                    variable_name: "uranium_grams",
                    variable_value: 10
                },
                {
                    variable_type: "int",
                    variable_name: "min_temperature",
                    variable_value: 128
                },
                {
                    variable_type: "int",
                    variable_name: "max_temperature",
                    variable_value: 256
                },
                {
                    variable_type: "int",
                    variable_name: "temperature",
                    variable_value: 186
                }
                ],
                getters: ["temperature", "max_temperature", "min_temperature"],
                setters: ["temperature_till_optim"]
                ,
                description: "Class for temperature of a nuclear reactor"
            },
            struct_obj: [
                {
                    struct_name: "Reactor",
                    struct_variables: [{
                        variable_type: "int",
                        variable_name: "max_temperature",
                        variable_value: 256
                    },
                    {
                        variable_type: "int",
                        variable_name: "min_temperature",
                        variable_value: 64
                    },
                    {
                        variable_type: "int",
                        variable_name: "actual_temperature",
                        variable_value: 164
                    }
                    ],
                    description: "This is a structure of data that represent a reactor"
                },
            ],
            vars_obj: [
                {
                    variable_type: "int",
                    variable_name: "name",
                    variable_value: 2,
                },
                {
                    variable_type: "int",
                    variable_name: "number_of_apples",
                    variable_value: 3,
                },
            ],
        },
    }
    ],
    description: "This project is for the reactor controll"
})
// 5ece882050d340457081f039
// toDatabase(struct)
// toDatabase(class_for_db)
// toDatabase(project)



async function find_users(){
    
    // let users=["5ece6971f8affb26b8010a9e","5ece882050d340457081f039"]
    // let resp= await User.find({_id:users})
    // 

    let user_id="5ece882050d340457081f039"
    let response =await ProjectSchema.find({"project_colabs.user_id":user_id})
    console.log(response)

}
find_users();
    // 5ece6971f8affb26b8010a9e
// 5ece882050d340457081f039