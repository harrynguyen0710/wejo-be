const { getUser } = require("../services/user.service");

const { PrismaClient } = require("../generated/prisma/client"); 
const prisma = new PrismaClient();

const FirebaseAuth = require("./firebaseAuth.controller");


const FIREBASE_API_KEY = process.env.FIREBASE_API_KEY;

const firebase = new FirebaseAuth(FIREBASE_API_KEY);


class UserController {
 async login(req, res) {  
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const firebaseUser = await firebase.signIn(email, password);
    if (!firebaseUser || !firebaseUser.idToken) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    return res.status(200).json({
      success: true,
      firebaseUser,
    });
  } catch (error) { 
      console.error("Error fetching user:", error);
      return res.status(500).json({ message: "Internal server error." });
  }
 }

async signup(req, res) {
  try {
    console.log('req.body:::', req.body);
    const { email, password, firstName, lastName   } = req.body;
    
    var phoneNumber = '0';
    var avatar = 'https://cdn-icons-png.flaticon.com/128/16683/16683469.png';
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ message: "Email, password, phone number, and name are required" });
    }

    // Create user in Firebase
    const firebaseUser = await firebase.signUp(email, password);
    if (!firebaseUser || !firebaseUser.idToken) {
      return res.status(400).json({ message: "Failed to create user in Firebase" });
    }
    console.log('firebaseUser:::', firebaseUser);

    // Create user in database
    const user = await prisma.user.create({
      data: {
        Email: email,
        PhoneNumber: phoneNumber || '',
        Id: firebaseUser.localId,
        FirstName: firstName || '',
        LastName: lastName || '',
        CreatedOn: new Date() || null,
        Avatar: avatar || null,
        Password: password || '123456',
      }
    });

    return res.status(201).json({
      success: true,
      user,
      token: firebaseUser.idToken
    });
  } catch (error) {
    console.error("Error signing up user:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
}
  async getUserById(req, res) {
    try {
      const { userId } = req.params;
      const user = await getUser(userId);

      if (!user)
        return res
          .status(404)
          .json({ success: false, message: "User not found" });

      return res.status(200).json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      return res.status(500).json({ message: "Internal server error." });
    }
  }

  


  async checkUserExist(req, res) {
    const phone = req.query.phoneNumber;
    console.log('Phone::', phone);
    console.log('typeoff::', typeof phone);
    if (!phone) {
      return res.status(400).json({ message: "Phone number is required" });
    }

    try {
      const user = await prisma.user.findFirst({
        where: {
          PhoneNumber: phone,
        },
      });

      if (user) {
        return res.status(200).json({ exists: true, userId: user.Id });
      } else {
        return res.status(404).json({ exists: false });
      }
    } catch (error) {
      console.error("Error checking user:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}

module.exports = new UserController();
