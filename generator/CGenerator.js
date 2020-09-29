var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
let fs = require("fs");
let path = require("path");
let fsp = require("fs").promises;
let JSZip = require("jszip");
const { files } = require("jszip");
const NEW_LINE = "\n";
const TAB = "\t";
const Project_Generator = (function () {
    let errors;
    let checkClass = function (class_obj) {
        if(!class_obj)return false
        if (Object.keys(class_obj).length === 0 )
            return false;
        return true;
    };
    let generat_cpp_file = function (file) {
        let fisier = "";
        if(file.includes.length===0 && file.defines.length===0 &&file.struct_obj.length===0 && !checkClass(file.class_obj))return "";
        let includes, defines, class_text, struct_text, variables;
        includes = defines = class_text = struct_text = variables = "";
        includes = create_includes(file.includes);
        defines = create_defines(file.defines);
        struct_text = create_structs(file.struct_obj);
        variables = create_variables(file.vars_obj);
        class_text = create_class(file.class_obj);
        fisier += includes + NEW_LINE;
        fisier += defines + NEW_LINE;
        fisier += class_text + NEW_LINE;
        fisier += struct_text + NEW_LINE;
        fisier += variables + NEW_LINE;
        if (fisier)
            console.log(`File ${file.file_name} generated successfully`);
        return fisier;
    };
    let generat_c_file = function (file) {
        let fisier, includes, defines, struct_text, variables;
        includes = defines = struct_text = variables = fisier = "";
        includes = create_includes(file.includes);
        defines = create_defines(file.defines);
        struct_text = create_structs(file.struct_obj);
        variables = create_variables(file.vars_obj);
        fisier += includes + NEW_LINE;
        fisier += defines + NEW_LINE;
        fisier += struct_text + NEW_LINE;
        fisier += variables + NEW_LINE;
        return fisier;
    };
    let create_variables = function (array_of_variables_to_create) {
        if (array_of_variables_to_create === undefined)
            return;
        let variables_text = "";
        array_of_variables_to_create.forEach(variable_to_be_created => {
            variables_text += create_var(variable_to_be_created) + NEW_LINE;
        });
        return variables_text;
    };
    let create_var = function (variable) {
        // Creeaza o variabila 
        let value;
        let type = variable.variable_type === "string" ? "std::string" : variable.variable_type;
        switch (type) {
            case "std::string": {
                value = `\"${variable.variable_value}\"`;
                break;
            }
            case "char": {
                value = `'${variable.variable_value[0]}'`;
                break;
            }
            default: {
                value = variable.variable_value;
            }
        }
        let variable_value = value !== null && value !== "" && value !== "\"\"" && value !== "\'undefined\'" ? ` = ${value};` : ";";
        return `${type} ${variable.variable_name}${variable_value}`;
    };
    let create_structs = function (structs) {
        if (structs === undefined)
            return;
        let structures = "";
        structs.forEach(structure => {
            structures += create_struct(structure);
            structures += NEW_LINE;
        });
        return structures;
    };
    let create_struct = function (struct) {
        // Creeaza o structura simpla care contine variabilele structurii
        if (struct === undefined)
            return;
        let vars = "";
        struct.struct_variables.forEach(variable => {
            vars += `${NEW_LINE}${TAB}${create_var(variable)}`;
        });
        let struct_text = `
struct ${struct.struct_name}{
    \/\*${struct.description ? struct.description : null}\*\/
            ${vars}
    };`;
        return struct_text;
    };
    let create_includes = function (includes) {
        if (includes === undefined)
            return;
        let includes_text = "";
        includes.forEach(include => {
            includes_text += `#include <${include}>${NEW_LINE}`;
        });
        return includes_text;
    };
    let create_defines = function (defines) {
        if (defines === undefined)
            return;
        let defines_text = "";
        defines.forEach(def => {
            defines_text += `#define ${def[0]} ${def[1]}${NEW_LINE}`;
        });
        return defines_text;
    };
    let create_class_variables = function (vars) {
        let private_variables_text = "";
        vars.forEach(variable => {
            private_variables_text += `${TAB}${create_var(variable)}${NEW_LINE}`;
        });
        return private_variables_text;
    };
    let find_var = function (var_name, vars) {
        for (let i = 0; i < vars.length; i++) {
            if (var_name === vars[i].variable_name) {
                return vars[i];
            }
        }
    };
    let does_var_exists = function (vars, to_find) {
        for (let i = 0; i < vars.length; i++) {
            if (vars[i].variable_name === to_find) {
                return true;
            }
        }
        return false;
    };
    let create_class_getters = function (vars, list_of_getters) {
        let getters = "";
        for (let i = 0; i < list_of_getters.length; i++) {
            if (does_var_exists(vars, list_of_getters[i])) {
                let variable = find_var(list_of_getters[i], vars);
                let getter = `\t${variable.variable_type === "string" ? "std::string" : variable.variable_type} get_${variable.variable_name}(){\n\t\treturn this->${variable.variable_name};${NEW_LINE}\t}${NEW_LINE}`;
                getters += getter;
            }
        }
        return getters;
    };
    let create_class_setters = function (vars, list_of_setters) {
        let setters = "";
        for (let i = 0; i < list_of_setters.length; i++) {
            if (does_var_exists(vars, list_of_setters[i])) {
                let variable = find_var(list_of_setters[i], vars);
                let setter = `\tvoid set_${variable.variable_name}(${variable.variable_type === "string" ? "std::string" : variable.variable_type} ${variable.variable_name}){\n\t\tthis->${variable.variable_name}=${variable.variable_name};${NEW_LINE}\t}${NEW_LINE}`;
                setters += setter;
            }
        }
        return setters;
    };
    let create_class_constructor = function (constructor, class_name, variables) {
        let class_constructor_text = "";
        let constructor_arguments = "";
        let constructor_values = "";
        if (constructor.constructor_values === "all") {
            for (let i = 0; i < variables.length; i++) {
                if (i < variables.length - 1) {
                    constructor_arguments += `${variables[i].variable_type} ${variables[i].variable_name},`;
                }
                else {
                    constructor_arguments += `${variables[i].variable_type} ${variables[i].variable_name}`;
                }
                constructor_values += `${TAB}${TAB}this->${variables[i].variable_name}=${variables[i].variable_name};\n`;
            }
        }
        class_constructor_text += `${TAB}${class_name}(${constructor_arguments}){\n${constructor_values}${TAB}}`;
        return class_constructor_text;
    };
    let create_class = function (class_obj) {
        let class_text = "";
        let isClass = checkClass(class_obj);
        if (!isClass)
            return "";
        let class_name = class_obj.class_name.split(" ").join("_");
        class_text += `class ${class_name}{${NEW_LINE}`;
        if (class_obj.description)
            class_text += `${NEW_LINE}\/\* ${class_obj.description} \*\/${NEW_LINE}`;
        if (class_obj.private.length > 0) {
            class_text += `${NEW_LINE}\/\* Private variables and functios \*\/${NEW_LINE}`;
            class_text += `private:${NEW_LINE}${create_class_variables(class_obj.private)}${NEW_LINE}`;
            if (class_obj.class_constructor.constructor_type === "private")
                class_text += `${NEW_LINE}${create_class_constructor(class_obj.class_constructor, class_name, class_obj.private.concat(class_obj.public))}`;
        }
        class_text += `${NEW_LINE}\/\* Public variables and functions  \*\/${NEW_LINE}`;
        class_text += `public:${NEW_LINE}${create_class_variables(class_obj.public)}${NEW_LINE}`;
        if (class_obj.class_constructor.constructor_type === "public")
            class_text += `${NEW_LINE}${create_class_constructor(class_obj.class_constructor, class_name, class_obj.private.concat(class_obj.public))}`;
        class_text += `${NEW_LINE}\/\* Getters \*\/${NEW_LINE}`;
        class_text += `${NEW_LINE}${create_class_getters(class_obj.private, class_obj.getters)}${NEW_LINE}`;
        class_text += `${NEW_LINE}\/\* Setters \*\/${NEW_LINE}`;
        class_text += `${NEW_LINE}${create_class_setters(class_obj.private, class_obj.setters)}${NEW_LINE}`;
        class_text += `${NEW_LINE}\/\* Destructor \*\/${NEW_LINE}`;
        class_text += `${NEW_LINE}${TAB}~${class_name}(){} ${NEW_LINE}};`;
        return class_text;
    };
    let generate_project = function (project) {
        let paths=[];
        if (Object.keys(project).length === 0)
            return {
                status: "fail",
                error: "Empty project"
            };
        let project_name = project.project_name.split(' ').join('_');
        let file_path = `./projects/${project_name}`;
        fs.mkdirSync(file_path+`/src`, { recursive: true });

        project.files.forEach(file_def => {
            let file;
            if (project.project_type === "cpp")
                file = generat_cpp_file(file_def);
            else
                file = generat_c_file(file_def);
                
                console.log("File starts: "+file.replace(/((\s)|(\n))/,'')+"Files end !")
                if (file.trim()!==""){
            fs.writeFile(`${file_path}/src/${file_def.file_name}.${file_def.file_type}`, file, (err => {
                if (err) {
                    console.log(err);
                }
                paths.push({path:path.join(__dirname,`${file_path}/src/${file_def.file_name}.${file_def.file_type}`),name:`${project_name}/src/${file_def.file_name}.${file_def.file_type}`})
            }));
        }
        });
    
        if (project.description)
            fs.writeFile(`${file_path}/README.TXT`, project.description, (err => {
                if (err)
                    console.log(err);
            }));
            paths.push({path:path.join(__dirname,`${file_path}/README.TXT`),name:`${project_name}/README.TXT`})

        return {project_id:project.id,paths:paths};
    };
    let generate_project_from_file = function (path_to_project_file) {
        return __awaiter(this, void 0, void 0, function* () {
            let project;
            let paths=[];
            try {
                let string_project = yield fsp.readFile(path_to_project_file);
                project = yield JSON.parse(string_project);
                if (Object.keys(project).length === 0)
                    return {
                        status: "fail",
                        error: "Empty project"
                    };
                let project_name = project.project_name.split(' ').join('_');
                let file_path = `./projects/${project_name}`;
                fs.mkdirSync(file_path + `/src`, { recursive: true });
                project.files.forEach(file_def => {
                    let file;
                    if (project.project_type === "cpp")
                        {file = generat_cpp_file(file_def);}
                    else
                      {  file = generat_c_file(file_def);}
                        console.log("file",file);
                        console.log(file.replace(/\s|\n/,''))
                    if (file.trim()!==""){
                    fs.writeFile(`${file_path}/src/${file_def.file_name}.${file_def.file_type}`, file, (err => {
                        if (err) {
                            console.log(err);
                        }
                        
                        paths.push(`${file_path}/src/${file_def.file_name}.${file_def.file_type}`)
                    }));}
                });
                if (project.description)
                    fs.writeFile(`${file_path}/README.TXT`, project.description, (err => {
                        if (err)
                            console.log(err);
                        paths.push(`${file_path}/README.TXT`)

                    }));
                return {project_id:project.id,paths:paths};
            }
            catch (err) {
                console.log(err);
                throw new Error("Fail to read file");
            }
        });
    };
    let  generate_zip=async (project_name,res)=> {
        let zip = new JSZip();
        zip.folder(project_name);
        zip.file(`${project_name}/README.txt`, fs.readFileSync(`./projects/${project_name}/README.TXT`));
        let files = fs.readdirSync(`./projects/${project_name}/src`);
        for (let i = 0; i < files.length; i++) {
            let file_info= fs.readFileSync(`./projects/${project_name}/src/${files[i]}`)
            console.log("File info", file_info)
            zip.file(`${project_name}/src/${files[i]}`,file_info);
        }
        zip
            // .generateAsync({type:"arraybuffer"})
            .generateNodeStream({ type: "nodebuffer"})
            // .then(nodeBuffer=>{
            //     res.send(nodeBuffer)
            //     // res.send(new Blob2([ arraybuffer]));
            // })
            .pipe(fs.createWriteStream(`./projects/${project_name}.zip`))
            .on('finish', function () {
                // res.send
            // JSZip generates a readable stream with a "end" event,
            // but is piped here in a writable stream which emits a "finish" event.
        });
    }
    return {
        // cpp: generat_cpp_file,
        // c:generat_c_file
        generate_project,
        generate_project_from_file,
        generate_zip
    };
})();
module.exports = {
    Project_Generator
};




