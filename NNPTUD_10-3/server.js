const express = require("express")
const mongoose = require("mongoose")

const userRoutes = require("./routes/userRoutes")
const roleRoutes = require("./routes/roleRoutes")

const app = express()

app.use(express.json())

mongoose.connect("mongodb://127.0.0.1:27017/testdb")
    .then(() => console.log("✅ MongoDB Connected..."))
    .catch(err => console.error("❌ MongoDB Connection Error:", err))

app.use("/users", userRoutes)
app.use("/roles", roleRoutes)

app.listen(3000, () => {
    console.log("Server running at http://localhost:3000")
})