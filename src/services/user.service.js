const { getUserById } = require("../repositories/user.repository.js");


const getUser = async (userId) => {
    return await getUserById(userId)
}


module.exports = {
    getUser,
}