const express = require("express")
const router = express.Router()
const User = require("../models/User")

// CREATE USER
router.post("/", async (req, res) => {
    let user = new User(req.body)
    await user.save()
    res.send(user)
})


// GET ALL USER + SEARCH USERNAME
router.get("/", async (req, res) => {

    let query = { isDeleted: false }

    if (req.query.username) {
        query.username = {
            $regex: req.query.username,
            $options: "i"
        }
    }

    let users = await User.find(query).populate("role")

    res.send(users)
})


// GET USER BY ID
router.get("/:id", async (req, res) => {
    let user = await User.findById(req.params.id).populate("role")
    res.send(user)
})


// UPDATE USER
router.put("/:id", async (req, res) => {
    let user = await User.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    )

    res.send(user)
})


// SOFT DELETE USER
router.delete("/:id", async (req, res) => {

    let user = await User.findByIdAndUpdate(
        req.params.id,
        { isDeleted: true },
        { new: true }
    )

    res.send(user)
})


// ENABLE USER
router.post("/enable", async (req, res) => {

    let { email, username } = req.body

    let user = await User.findOne({
        email: email,
        username: username
    })

    if (!user) {
        return res.status(404).send("User not found")
    }

    user.status = true
    await user.save()

    res.send(user)
})


// DISABLE USER
router.post("/disable", async (req, res) => {

    let { email, username } = req.body

    let user = await User.findOne({
        email: email,
        username: username
    })

    if (!user) {
        return res.status(404).send("User not found")
    }

    user.status = false
    await user.save()

    res.send(user)
})

module.exports = router