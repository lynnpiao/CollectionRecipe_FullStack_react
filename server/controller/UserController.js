const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");
const {validateUser } = require("../middlewares/SchemaMiddleware");

const { sign } = require("jsonwebtoken");


const createAccount = async (req, res) => {
    const { email, password } = req.body;
    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the user with the hashed password
        const user = await prisma.user.create({
            data: {
                email: email,
                password: hashedPassword,
            },
        });
        res.status(201).json({ msg: 'Create Account successfully', user })
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Created failure' });
    }
};


const loginAccount = async (req, res) => {
    const {email, password } = req.body;
  
    const user = await prisma.user.findUnique({
        where: {
          email: email,
        },
      })
  
    if (!user) res.json({ error: "User Doesn't Exist" });
  
    bcrypt.compare(password, user.password).then(async (match) => {
      if (!match) res.json({ error: "Wrong Username And Password Combination" });
  
      const accessToken = sign(
        { email: user.email, id: user.id },
        "importantSecret"
      );
      res.json({ token: accessToken, email: email, id: user.id });
    });
  };


const auth = (req, res) => {
    res.json(req.user);
  };


module.exports = {
    createAccount:[validateUser, createAccount],
    loginAccount,
    auth
};
