const express = require("express")
const router = express.Router()
const Role = require("../models/Role")
const User = require("../models/User")

// CREATE ROLE
router.post("/", async (req, res) => {
    let role = new Role(req.body)
    await role.save()
    res.send(role)
})

// GET ALL ROLE
router.get("/", async (req, res) => {
    try {
        let roles = await Role.find({ isDeleted: false })
        res.send(roles)
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
})

// GET ROLE BY ID
router.get("/:id", async (req, res) => {
    try {
        let role = await Role.findOne({ _id: req.params.id, isDeleted: false })
        if (!role) return res.status(404).send({ message: "Role không tồn tại hoặc đã bị xóa" })
        res.send(role)
    } catch (error) {
        res.status(400).send({ message: "ID không hợp lệ" })
    }
})

// UPDATE ROLE
router.put("/:id", async (req, res) => {
    try {
        let role = await Role.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        )
        res.send(role)
    } catch (error) {
        res.status(400).send({ message: error.message })
    }
})

// DELETE ROLE (SOFT DELETE)
router.delete("/:id", async (req, res) => {
    try {
        let role = await Role.findByIdAndUpdate(
            req.params.id,
            { isDeleted: true },
            { new: true }
        )
        res.send({ message: "Đã xóa mềm Role", role })
    } catch (error) {
        res.status(400).send({ message: "Xóa thất bại" })
    }
})

// GET USERS BY ROLE
router.get("/:id/users", async (req, res) => {

    let users = await User.find({
        role: req.params.id,
        isDeleted: false
    }).populate("role")

    res.send(users)
})

module.exports = router