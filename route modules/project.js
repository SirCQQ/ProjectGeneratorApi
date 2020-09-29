const express = require('express');
let router = express.Router();
const {ProjectSchema} = require("../model/Project");
const { verify, decode } = require("../model/validation/verify");
const { projectValidator } = require('../model/validation/validation')
const User =require('../model/User')
const {get_all_projects,get_user_project_by_id,save_project} =require("./functions/project_fnctions");
const CGenerator = require('../generator/CGenerator');
var zip = require('express-easy-zip');
const path=require("path");
router.use(zip())
let project_files={};

router.get('/', verify, async (req, res) => {
    const token = req.header('auth-token');
    let user_id = decode(token);
    res.json(await get_all_projects(user_id))
})


router.post('/', verify, async (req, res) => {

    const token = req.header('auth-token');
    let user_id = decode(token);
    let { error } = projectValidator(req.body);
    if (error) return res.status(400).json({
        status: "fail",
        error: error.details[0].message,
        error_message: "Mandatory fiedls are not completed"
    })

    let result = await ProjectSchema.findOne({ $and: [{ project_name: req.body.project_name }, { project_owner: user_id }] });

    if (result) return res.status(400).json({
        status: "fail",
        error: "Project name already exists"
    });
    
    const project = new ProjectSchema({
        project_owner: user_id,
        project_name: req.body.project_name,
        project_type: req.body.project_type,
        project_colabs: req.body.project_colabs,
        files: req.body.files,
        description: req.body.description,

    })
    try {
        let result = await project.save();
        res.json({
            status: "success",
            project: result
        })
    }
    catch (e) {
        res.status(400).json({
            status: "fail",
            errors: e
        }
        )
    }
})



router.put("/", verify, async (req, res) => {
    const token = req.header('auth-token');
    let { error } = projectValidator(req.body);
    let user_id = decode(token);
    if (error) return res.status(400).json({ error: error.details[0].message })
    return res.json(await save_project(req.body))

})


router.delete("/", verify, (req, res) => {
    ProjectSchema.findByIdAndDelete({ _id: req.body._id }, (err, project) => {
        if (err) return res.status(500).send(err);
        const response = {
            message: "Successfully deleted",
            id: project._id
        };
        return res.status(200).send(response);
    })
})



router.get("/:project_id", verify, async (req, res) => {
    let { project_id } = { ...req.params }
    const token = req.header('auth-token');
    let user_id = decode(token);
    let response= await  get_user_project_by_id(user_id._id,project_id)

    console.log(user_id)
    return res.json(response);
})


router.get("/generate_project/:project_id",verify,async (req,res)=>{
    let { project_id } = { ...req.params }
    const token = req.header('auth-token');
    let user_id = decode(token);

    try {
    let project=await ProjectSchema.findOne({_id:project_id});

    if(user_id._id!==project.project_owner
     && project.project_colabs.find(colab=>colab.user_id===user_id._id)==null)
    {
        console.log("FAIL")
      return res.json({
        status: "fail",
        error:"Access Unauthorized"
    })
}
    project_files = await CGenerator.Project_Generator.generate_project(project);
    let project_name = project.project_name.split(' ').join('_');
    res.json({
        href:`/api/projects/get_project/${project_name}`,
        download:`${project_name}.zip`
    })
}

    catch(err){
        console.log(err)
        res.send(err)
    }
})

router.get("/get_project/:project_name",(req,res)=>{
    let { project_name } = { ...req.params }
    res.zip({files:[{
        path:path.join(__dirname,`../projects/${project_name}`),
        name:`${project_name}`
    }]})
})


module.exports = router;


