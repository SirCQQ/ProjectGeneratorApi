const cors = require("cors");
const zip = require("express-easy-zip");
const express = require("express");
const path = require("path");
let app = express();
const mogoose = require("mongoose");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("./model/User");
const {ClassSchema} = require("./model/Class");
const {StructSchema} = require("./model/Struct");
const { ProjectSchema } = require("./model/Project");

const { classValidation } = require("./model/validation/validation");
const { structValidation } = require("./model/validation/validation");
const {
  registerValidation,
  loginValidation,
} = require("./model/validation/validation");

const { verify, decode } = require("./model/validation/verify");
const { projectValidator } = require("./model/validation/validation");
const {
  get_all_projects,
  get_user_project_by_id,
  save_project,
} = require("./route modules/functions/project_fnctions");
const CGenerator = require("./generator/CGenerator");

let project_files = {};
dotenv.config();
// app.use(function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
// });
//Connect to db

mogoose.connect(
  process.env.DB_URL,
  { useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: true },
  () => {
    console.log("Connected to database");
  }
);
app.use(cors());
app.use(zip());
app.use(express.json());
//cors for API
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

//User Routes
app.post("/", (req, res) => {
//   
  res.append("gege", "ges");
  res.status(200).json({ message: "index" });
});
app.get("/", (req, res) => {
  // 
  res.append("gege", "ges");
  res.status(200).json({ message: "index" });
});
app.post("/api/user/register", async (req, res) => {
  //Validate
  const { error } = registerValidation(req.body);
  if (error) {
    return res.status(400).json({ status: "fail", error: error.details[0] });
  }
  //Check for user
  const emailExists = await User.findOne({ email: req.body.email });
  if (emailExists)
    return res.status(400).json({
      status: "fail",
      error: "Email already exists",
    });

  // Hasing the password
  const salt = await bcrypt.genSalt(10);
  const hashPass = await bcrypt.hash(req.body.password, salt);

  //Create a new user
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashPass,
  });
  //Saving into database
  try {
    const savedUser = await user.save();
    res.json({
      status: "success",
      user: savedUser._id,
    });
  } catch (e) {
    //Catching any errors
    res.status(400).send(e);
  }
});
app.post("/api/user/login", async (req, res) => {
  //Validate
  // res.setHeader("Access-Control-Allow-Origin","*")
  // return res.send({message:"success"})
  const { error } = loginValidation(req.body);
  if (error)
    return res
      .status(400)
      .json({ status: "fail", error: error.details[0].message });

  //Check for user
  const user = await User.findOne({ email: req.body.email });
  if (!user)
    return res
      .status(400)
      .json({ status: "fail", error: "Email ''or Password ''is wrong" });

  //Password is correct
  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass)
    return res
      .status(400)
      .json({ status: "fail", error: "''Email or'' Password is wrong" });

  //Create and asign a token
  const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET, {
    expiresIn: "7d",
  });
  res
    .header("auth-token", token)
    .json({ status: "success", jwt: token, user: user });
});
app.get("/api/user/:user_id", (req, res) => {
  let { user_id } = { ...req.params };
  User.findById(user_id, (err, response) => {
    if (err || response === null)
      return res.json({ status: "fail", error: err });
    return res.json({
      status: "success",
      user: response,
    });
  });
});

// app.use('/api/post',post_route);
//Classes routes
// app.use('/api/classes', class_route);

app.get("/api/classes/", verify, async (req, res) => {
  const token = req.header("auth-token");
  let user_id = decode(token);
  let user_classes = await ClassSchema.find({ class_owner: user_id });
  res.json({
    status: "success",
    classes: user_classes,
  });
});
app.post("/api/classes/", verify, async (req, res) => {
  const token = req.header("auth-token");
  let user_id = decode(token);
  let { error } = classValidation(req.body);
  if (error)
    return res
      .status(400)
      .json({ status: "fail", error: error.details[0].message });

  let result = await ClassSchema.findOne({
    $and: [{ class_name: req.body.class_name }, { class_owner: user_id }],
  });

  if (result)
    return res.json({
      status: "fail",
      error: "Class name already exists",
    });
  const class_object = new ClassSchema({
    class_owner: user_id,
    class_name: req.body.class_name,
    description: req.body.description,
    class_constructor: req.body.class_constructor,
    public: req.body.public,
    private: req.body.private,
    getters: req.body.getters,
    setters: req.body.setters,
    // date:Date.now()
  });
  try {
    let result = await class_object.save();
    res.json({
      status: "success",
      class: result,
    });
  } catch (e) {
    res.status(400).send(e);
  }
});
app.put("/api/classes/", verify, (req, res) => {
  let { error } = classValidation(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  ClassSchema.findByIdAndUpdate(
    { _id: req.body._id },
    req.body,
    (err, class_obj) => {
      if (err) return res.status(500).send(err);

      res.json({
        status: "success",
        structures: class_obj,
      });
    }
  );
});
app.delete("/api/classes/", verify, (req, res) => {
  ClassSchema.findByIdAndDelete({ _id: req.body._id }, (err, class_obj) => {
    if (err) return res.status(500).send(err);
    const response = {
      status: "success",
      id: class_obj._id,
    };
    return res.status(200).send(response);
  });
});
app.get("/api/classes/:class_id", verify, (req, res) => {
  let { class_id } = { ...req.params };
  ClassSchema.findById(class_id, (err, response) => {
    if (err || response === null)
      return res.json({ status: "fail", error: err });
    return res.json({
      status: "success",
      class: response,
    });
  });
});

//Structure routes
// app.use('/api/structs', struct_route);

app.get("/api/structs/", verify, async (req, res) => {
  const token = req.header("auth-token");
  let user_id = decode(token);
  let user_structures = await StructSchema.find({ struct_owner: user_id });
  res.json({
    status: "success",
    structures: user_structures,
  });
});
app.post("/api/structs/", verify, async (req, res) => {
  const token = req.header("auth-token");
  let user_id = decode(token);
  let { error } = structValidation(req.body);
  if (error)
    return res
      .status(400)
      .json({ status: "fail", error: error.details[0].message });

  let result = await StructSchema.findOne({
    $and: [{ struct_name: req.body.struct_name }, { struct_owner: user_id }],
  });

  if (result)
    return res.json({
      status: "fail",
      error: "Struct name already exists",
    });

  const struct = new StructSchema({
    struct_owner: user_id,
    struct_name: req.body.struct_name,
    struct_variables: req.body.struct_variables,
    description: req.body.description,
  });
  try {
    let result = await struct.save();
    res.json({
      status: "success",
      struct: result,
    });
  } catch (e) {
    res.status(400).send(e);
  }
});
app.put("/api/structs/", verify, (req, res) => {
  let { error } = structValidation(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  StructSchema.findByIdAndUpdate(
    { _id: req.body._id },
    req.body,
    (err, struct) => {
      if (err) return res.status(500).send(err);

      res.json({
        status: "success",
        structures: struct,
      });
    }
  );
});
app.delete("/api/structs/", verify, (req, res) => {
  StructSchema.findByIdAndDelete({ _id: req.body._id }, (err, struct) => {
    if (err) return res.status(500).send(err);
    const response = {
      status: "success",
      id: struct._id,
    };
    return res.status(200).send(response);
  });
});
app.get("/api/structs/:struct_id", verify, (req, res) => {
  let { struct_id } = { ...req.params };
  StructSchema.findById(struct_id, (err, response) => {
    if (err || response === null)
      return res.json({ status: "fail", error: err });
    return res.json({
      status: "success",
      struct: response,
    });
  });
});
//Projects routes
// app.use('/api/projects', project_route);

app.get("/api/projects", verify, async (req, res) => {
  
  
  const token = req.header("auth-token");
  let user_id = decode(token);
  res.json(await get_all_projects(user_id));
});
app.post("/api/projects", verify, async (req, res) => {
  const token = req.header("auth-token");
  let user_id = decode(token);
  let { error } = projectValidator(req.body);
  if (error)
    return res.status(400).json({
      status: "fail",
      error: error.details[0].message,
      error_message: "Mandatory fiedls are not completed",
    });

  let result = await ProjectSchema.findOne({
    $and: [{ project_name: req.body.project_name }, { project_owner: user_id }],
  });

  if (result)
    return res.status(400).json({
      status: "fail",
      error: "Project name already exists",
    });

  const project = new ProjectSchema({
    project_owner: user_id,
    project_name: req.body.project_name,
    project_type: req.body.project_type,
    project_colabs: req.body.project_colabs,
    files: req.body.files,
    description: req.body.description,
  });
  try {
    let result = await project.save();
    res.json({
      status: "success",
      project: result,
    });
  } catch (e) {
    res.status(400).json({
      status: "fail",
      errors: e,
    });
  }
});
app.put("/api/projects/", verify, async (req, res) => {
  const token = req.header("auth-token");
  let { error } = projectValidator(req.body);
  let user_id = decode(token);
  if (error) return res.status(400).json({ error: error.details[0].message });
  return res.json(await save_project(req.body));
});
app.delete("/api/projects/", verify, (req, res) => {
  ProjectSchema.findByIdAndDelete({ _id: req.body._id }, (err, project) => {
    if (err) return res.status(500).send(err);
    const response = {
      message: "Successfully deleted",
      id: project._id,
    };
    return res.status(200).send(response);
  });
});
app.get("/api/projects/:project_id", verify, async (req, res) => {
  let { project_id } = { ...req.params };
  const token = req.header("auth-token");
  let user_id = decode(token);
  let response = await get_user_project_by_id(user_id._id, project_id);

  return res.json(response);
});
app.get("/api/projects/generate_project/:project_id",verify,async (req, res) => {
    let { project_id } = { ...req.params };
    const token = req.header("auth-token");
    let user_id = decode(token);
    try {
      let project = await ProjectSchema.findOne({ _id: project_id });

      if (
        user_id._id !== project.project_owner &&
        project.project_colabs.find((colab) => colab.user_id === user_id._id) ==
          null
      ) {
        return res.json({
          status: "fail",
          error: "Access Unauthorized",
        });
      }
      project_files = await CGenerator.Project_Generator.generate_project(project);
      let project_name = project.project_name.split(" ").join("_");
      res.json({
        href: `/api/projects/get_project/${project_name}`,
        download: `${project_name}.zip`,
      });
    } catch (err) {
      console.log(err);
      res.send(err);
    }
  }
);
app.get("/api/projects/get_project/:project_name", async (req, res) => {
  let { project_name } = { ...req.params };
//   res.append("content-type","application/zip");
// res.download(`../projects/${project_name}`)
let dir_path=path.join(__dirname, `./projects\\${project_name}`);  

res.zip({
  files: [
    {path: dir_path,name: `${project_name}`
    },
    
],
  filename:`${project_name}.zip`
});
});

let server = app.listen(process.env.PORT, () => {
  console.log(`Server starts at http://localhost:${process.env.PORT}`);
});

// const server = http.createServer(app)
const io = require("socket.io")(server);
io.on("connection", (socket) => {
  console.log("We have a new connection!!!");

  socket.on("errors", ({ resp, project_id }) => {
    // 
    socket.in(project_id).emit("project_error", resp);
  });

  socket.on("project", async ({ user_id, project_id }) => {
    let resp = await get_user_project_by_id(user_id, project_id);
    socket.emit("get_project", resp);

    socket.join(project_id);
  });

  socket.on("saveProject", async (project) => {
    let response = await save_project(project);
    socket.in(project._id).emit("save_response", response);
  });

  socket.on("disconnect", () => {
    console.log("User have left");
  });
});

// 5ece6971f8affb26b8010a9e
// 5ece882050d340457081f039
