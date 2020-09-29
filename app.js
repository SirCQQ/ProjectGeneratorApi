const cors = require('cors')
const express = require("express")
const router = require("./route modules/auth")
const class_route = require("./route modules/class")
const project_route = require("./route modules/project")
const struct_route = require("./route modules/struct")
let app = express()
const mogoose = require("mongoose");
const dotenv = require("dotenv");
const bodyParser = require('body-parser');

const http = require("http")
const { get_user_project_by_id,save_project} = require('./route modules/functions/project_fnctions')
dotenv.config();
//Connect to db 

mogoose.connect(process.env.DB_URL,
    { useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: true },
    () => {
        console.log("Connected to database");
    })
app.use(express.json());
//cors for API
app.use(cors());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

//User Routes
app.use('/api/user', router);

// app.use('/api/post',post_route);
//Classes routes
app.use('/api/classes', class_route);
//Structure routes
app.use('/api/structs', struct_route);
//Projects routes
app.use('/api/projects', project_route);


let server=app.listen(process.env.PORT, () => {
    console.log(`Server starts at http://localhost:${process.env.PORT}`)
})
// const server = http.createServer(app)
const io = require('socket.io')(server)
io.on("connection", (socket) => {
    console.log("We have a new connection!!!");

    socket.on("errors",({resp,project_id})=>{
        console.log(resp,project_id)
        socket.in(project_id).emit('project_error',resp);
    })
    
    socket.on('project',async  ({user_id,project_id}) => {

        let resp=await get_user_project_by_id(user_id,project_id);
        socket.emit('get_project', resp );

        socket.join(project_id)        
    })

    // socket.on("saveProject1", async ({project})=>{
    //     console.log(project)
    //     // let response=await save_project(project)
    //     // console.log(response)
    //     // socket.to(project._id).emit("save_response",response)
    // })
  
    socket.on("saveProject", async (project)=>{
        // console.log(project);
        let response=await save_project(project);
        // console.log(response.project.files[0].file_name);
        socket.in(project._id).emit("save_response",response)
    })
    // socket.on("error_save",({resp,project_id})=>{
    //     console.log(resp,project_id)
    //     socket.in(project_id).emit('project_error',resp);
    // })

    
    socket.on("disconnect", () => {
        console.log("User have left");
    })
})







    // 5ece6971f8affb26b8010a9e
    // 5ece882050d340457081f039