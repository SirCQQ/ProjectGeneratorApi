
const {ProjectSchema} = require("../../model/Project");
const { report } = require("../auth");

let get_all_projects= async (user_id)=>{
    let user_projects = await ProjectSchema.find({ project_owner: user_id._id })
    let user_colab_projects = await ProjectSchema.find({"project_colabs.user_id":user_id._id})
    return {
        message: "success",
        owned_projects: user_projects,
        project_colabs: user_colab_projects
    }
}

let get_user_project_by_id = async (user_id, project_id)=>{
    let admin =false;
    try{
    let response = await ProjectSchema.findOne({_id:project_id})
    if (response===null) return { status: "fail", error: "Porject does not exists " }
    if (user_id===response.project_owner) {admin=true};
    let project=response;
    if(user_id!==project.project_owner && project.project_colabs.find(colab=>colab.user_id===user_id)==null) return {
            status: "fail",
            error:"Access Unauthorized"
        }
    return {
                status: "success",
                project: project,
                admin:admin,
                user_id:user_id
            };
    }
    catch(err){
    return { status: "fail", error: err }
    }
}

let save_project=async (project_req)=>{
        let nameTaken = false
        // 
        // let { error } = projectValidator(project);
        // if (error) socket.emit("save_response", json({ error: error.details[0].message })
        let project = await ProjectSchema.find({ project_owner: project_req.project_owner })
        for (let i = 0; i < project.length; i++) {
            if (project[i].project_name.trim() === project_req.project_name.trim() && project[i]._id != project_req._id) {
                nameTaken = true;
                break;
            }
        }

        if (nameTaken) return {
            status: "fail",
            error: "Project name already exists"
        };
        try{
        let response = await ProjectSchema.findOneAndUpdate({ _id: project_req._id }, project_req, {new : true});
        
        return {
            status: "success",
            project:project_req 
        }}
        catch(err){
        if (err) return res.status(500).send(err);
   }
}


module.exports={
    get_all_projects,
    get_user_project_by_id,
    save_project
}