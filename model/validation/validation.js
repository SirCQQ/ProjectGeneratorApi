//Validation 

const Joi = require("@hapi/joi")

//Register validation 

const variables=Joi.object({
    variable_type:Joi.string().required(),
    variable_name:Joi.string().required(),
    variable_value:Joi.any().required(),
    _id:Joi.string()
})
const class_constructor=Joi.object({
    _id:Joi.string(),
    constructor_type:Joi.string(),
    constructor_values:Joi.string()
})

const struct= Joi.object({
    struct_variables: Joi.array().items(variables),
    struct_name: Joi.string(),
    description: Joi.string(),
    struct_owner:Joi.string(),
    __v:Joi.number(),
    _id:Joi.string()
})

const class_validator= Joi.object({
    class_constructor:class_constructor,
    public:Joi.array().items(variables),
    private:Joi.array().items(variables),
    getters:Joi.array().items(Joi.string()),
    setters:Joi.array().items(Joi.string()),
    class_name: Joi.string(),
    description: Joi.string(),
    class_owner:Joi.string(),
    __v:Joi.number(),
    _id:Joi.string()
})


const file=Joi.object({
    file_name:Joi.string().required(),
    file_type:Joi.string().required(),
    includes:Joi.array().items(Joi.string()).required(),
    defines:Joi.array().required(),
    class_obj:class_validator||null,
    struct_obj:Joi.array().items(struct),
    vars_obj:Joi.array().items(variables)
})

const project=Joi.object({
    project_name: Joi.string().required(),
    project_colabs: Joi.array(),
    project_type: Joi.string(),
    files: Joi.array().items(file),
    description: Joi.string(),
    _id:Joi.string(),
    __v:Joi.number(),
    project_owner:Joi.string()
})

const login = Joi.object({
    password: Joi.string().required().min(6).max(1024),
    email: Joi.string().required().email()
})

const register = Joi.object({
    name: Joi.string().required(),
    password: Joi.string().required().min(6).max(1024),
    email: Joi.string().required().email(),
    projects: Joi.array()
})

const registerValidation = (body) => {
    return register.validate(body)
}


const loginValidation = (body) => {
    return login.validate(body);
}

const structValidation = (body) => {
    return struct.validate(body)
}


const classValidation = (body) => {
    return class_validator.validate(body)
}
const projectValidator = (body) => {
        return project.validate(body)
}


module.exports.registerValidation = registerValidation
module.exports.loginValidation = loginValidation
module.exports.structValidation = structValidation
module.exports.classValidation = classValidation
module.exports.projectValidator = projectValidator

