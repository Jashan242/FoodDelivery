const User = require("../models/user");
const { generationToken } = require("../connection/auth");
const user = require("../models/user");

exports.signup = async (req, res) => {
  try {
    const { fullname, username, email, password, address, phone, role } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).send({
        status: "error",
        message: "User with this email or username already exists",
      });
    }

    const user = await User.create({ 
      fullname, 
      username, 
      email, 
      password, 
      address, 
      phone, 
      role 
    });

    // Generate token for new user
    const token = generationToken(user);

    res.status(201).send({
      status: "success",
      message: "User signed up successfully",
      token,
      userId: user._id,
      role: user.role
    });
  } catch (err) {
    res.status(400).send({
      status: "error",
      message: "User creation failed",
      error: err.message,
    });
  }
};

exports.login = (req, res) => {
  const { username, password } = req.body;
  User.find({ username, password })
    .then((User) => {
      if (!User || User.length === 0)
        return res.status(401).send({
          message: "user credentials do not match any account",
        });
      console.log("User : ", User);
      const token = generationToken(User[0]);
      // const token = JSON.stringify({
      //   _id:user[0]._id,
      //   username:user[0].username,
      // });
      const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      return res
        .status(200)
        .cookie("token", token, {
          httpOnly: true,
          secure: false,
          sameSite: "Lax",
          priority: "High",
          maxAge: 7 * 24 * 60 * 60 * 1000,
          expires,
        })
        .send({
          token,
          username:User[0].username,
          userId:User[0]._id,
          role:User[0].role,
          status: "success",
          message: "User logged in successfully",
        });
    })
    .catch((err) => {
      res.send({
        status: "error",
        message: "User cannot be logged in...",
        error: err.message,
      });
    });
};

exports.getUserDetails=(req,res)=>{
  const {username}=req.params;
  User.findOne({username})
  .then((user)=>{
    res.status(200).send({user})
  })
  .catch((err)=>{
    res.status(400).send({message:err})
  })
}

// exports.getUserByRole=(req, res)=>{
//     // const {role}=req.params.role;
//     const role = req.params.role.replace(':role=', '');
//     console.log(role);
//     User.find({role})
//     .then((user)=>{
//         console.log(user);
//         res.status(200).send({user})
//     })
//     .catch((err)=>{
//         res.status(400).send({message:err})
//     })
// }
