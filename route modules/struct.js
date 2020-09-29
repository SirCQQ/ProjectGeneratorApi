const express = require('express');
let router = express.Router();
const {StructSchema} = require("../model/Struct");
const { verify, decode } = require("../model/validation/verify");
const { structValidation } = require('../model/validation/validation')

router.get('/', verify, async (req, res) => {
    const token = req.header('auth-token');
    let user_id = decode(token);
    let user_structures = await StructSchema.find({ struct_owner: user_id })
    res.json({
        status: "success",
        structures: user_structures
    })
})


router.post('/', verify, async (req, res) => {
    console.log(req.body)
    const token = req.header('auth-token');
    let user_id = decode(token);
    let { error } = structValidation(req.body);
    if (error) return res.status(400).json({ status: "fail", error: error.details[0].message })

    let result = await StructSchema.findOne({ $and: [{ struct_name: req.body.struct_name }, { struct_owner: user_id }] });

    if (result) return res.json({
        status: "fail",
        error: "Struct name already exists"
    });

    const struct = new StructSchema({
        struct_owner: user_id,
        struct_name: req.body.struct_name,
        struct_variables: req.body.struct_variables,
        description: req.body.description
    })
    try {
        let result = await struct.save();
        res.json({
            status: "success",
            struct: result
        })
    }
    catch (e) {
        res.status(400).send(e)
    }
})


router.put("/", verify, (req, res) => {
    let { error } = structValidation(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message })

    StructSchema.findByIdAndUpdate({ _id: req.body._id }, req.body, (err, struct) => {
        if (err) return res.status(500).send(err);


        res.json({
            status: "success",
            structures: struct
        })

    })
})


router.delete("/", verify, (req, res) => {
    StructSchema.findByIdAndDelete({ _id: req.body._id }, (err, struct) => {
        if (err) return res.status(500).send(err);
        const response = {
            status: "success",
            id: struct._id
        };
        return res.status(200).send(response);
    })
})


router.get("/:struct_id", verify, (req, res) => {
    let { struct_id } = { ...req.params }
    StructSchema.findById(struct_id, (err, response) => {
        if (err || response === null) return res.json({ status: "fail", error: err })
        console.log(response)
        return res.json({
            status: "success",
            struct: response
        });
    })
})

module.exports = router;