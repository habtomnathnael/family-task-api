const User = require('../models/User')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')

// @desc Create new Admin user
// @route POST /users
// @access Private

const createNewTechAdmin = asyncHandler(async (req, res) => {
    
    const { username, password, isTechAdmin, roles } = req.body
    // Confirm data
    if (!username || !password || !Array.isArray(roles) || !roles.length) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    // Check for duplicate username
    const duplicate = await User.findOne({ username })
        .collation({
            locale: 'en',
            strength:2
        }).lean().exec()

    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate username' })
    }

    // Hash password 
    const hashedPwd = await bcrypt.hash(password, 10) // salt rounds

    const userObject = { username, "password": hashedPwd, roles }

    // Create and store new user 

    if (roles[0] === "TechAdmin") {

       const user = await User.create(userObject)

        if (user) { //created 
            res.status(201).json({ message: `New user ${username} created` })
        } else {
            res.status(400).json({ message: 'Invalid user data received' })
        } 
    }
    else {
        res.status(400).json({ message: 'Unauthoized register' })
    }
})

module.exports = {
    createNewTechAdmin,
}