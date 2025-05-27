const { PrismaClient } = require("../generated/prisma/client.js"); 
const prisma = new PrismaClient();

const getUserById = async (userId) => {
    try {
        const user = await prisma.user.findUnique({
        where: { Id: userId },
        select: {
            Id: true,
            Avatar: true,
            FirstName: true,
            LastName: true,
        }
        });
        return user;
    } catch (error) {
        console.error("Error fetching user:", error);
        throw new Error("Error fetching user: " + error.message);
    }
}

module.exports = {
    getUserById,
};