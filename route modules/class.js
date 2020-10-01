const express = require('express');
let router = express.Router();
const { ClassSchema } = require("../model/Class");
const { verify, decode } = require("../model/validation/verify");
const { classValidation } = require('../model/validation/validation')
router.get('/', verify, async (req, res) => {
    const token = req.header('auth-token');
    let user_id = decode(token);
    let user_classes = await ClassSchema.find({ class_owner: user_id })
    res.json({
        status: "success",
        classes: user_classes
    })
})


router.post('/', verify, async (req, res) => {

    const token = req.header('auth-token');
    let user_id = decode(token);
    let { error } = classValidation(req.body);
    if (error) return res.status(400).json({ status: "fail", error: error.details[0].message })

    let result = await ClassSchema.findOne({ $and: [{ class_name: req.body.class_name }, { class_owner: user_id }] });

    if (result) return res.json({
        status: "fail",
        error: "Class name already exists"
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
    })
    try {
        let result = await class_object.save();
        res.json({
            status: "success",
            class: result
        })
    }
    catch (e) {
        res.status(400).send(e)
    }
})



router.put("/", verify, (req, res) => {
    let { error } = classValidation(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message })

    ClassSchema.findByIdAndUpdate({ _id: req.body._id }, req.body, (err, class_obj) => {
        if (err) return res.status(500).send(err);


        res.json({
            status: "success",
            structures: class_obj
        })

    })
})


router.delete("/", verify, (req, res) => {
    ClassSchema.findByIdAndDelete({ _id: req.body._id }, (err, class_obj) => {
        if (err) return res.status(500).send(err);
        const response = {
            status: "success",
            id: class_obj._id
        };
        return res.status(200).send(response);
    })
})


router.get("/:class_id", verify, (req, res) => {
    let { class_id } = { ...req.params }
    ClassSchema.findById(class_id, (err, response) => {
        if (err || response === null) return res.json({ status: "fail", error: err })
        return res.json({
            status: "success",
            class: response
        });
    })
})

module.exports = router;