const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true, lowercase: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    bio: { type: String, default: "" },
    image: { type: String, default: "" },
    token: { type: String, default: "" },
    favorited: [{ type: mongoose.Schema.Types.ObjectId, ref: "Article" }]
})

userSchema.pre("save", async function (next) {
    if (this.password && this.modifiedPaths().includes("password")) {
        const hash = await bcrypt.hash(this.password, 10)
        this.password = hash
    }
    next()
})

const User = mongoose.model("User", userSchema)

const createUser = async (userData) => {
    const user = new User(userData)
    await user.save()
    return user
}

const getUserByUsername = async (username) => {
    const user = await User.findOne({ username })
    return user
}

const login = async (email, password) => {
    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
        return user;
    }
    return null;
};

// const updateUser = async (email, username, password, image, bio) => {
//     const user = req.user.userId
//     const filter = { _id: `${user}` }
//     User.findByIdAndUpdate(filter, {$set: {email: email, username: username, password: password, image: image, bio:bio}}, {new: true}, (err, doc) => {
//         if (err) {
//           console.log("Something wrong when updating data!")
//         }
//         res.redirect("/api/")
//       })
// } ///


module.exports = { createUser, getUserByUsername, login }