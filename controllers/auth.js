import User from "../models/User.js";
import generateToken from "../middlewares/jwtToken.js";
import bcrypt from "bcryptjs";

export async function registerUser(req, res) {
  const email = req.body.email;
  const existingUser = await User.findOne({
    email: email,
  });

  if (existingUser) {
    return res.status(403).json("User already exists!");
  }

  try {
    let encryptedPassword = "";
    const salt = bcrypt.genSaltSync(10);
    encryptedPassword = bcrypt.hashSync(req.body.password, salt);

    const newUser = new User({
      email: req.body.email,
      name: req.body.name,
      password: encryptedPassword,
    });
    const savedUser = await newUser.save();
    return res.status(200).json("User registered!");
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
}

export async function loginUser(req, res) {
  const email = req.body.email;
  const user = await User.findOne({ email: email });
  if (!user) {
    return res.status(404).json("User not found!");
  }

  if (!user.password) {
    return res.status(404).json("Password not found!");
  }
  try {
    const isValid = await bcrypt.compare(req.body.password, user.password);
    if (!isValid) {
      return res.status(401).json("Invalid Credentials!!");
    }

    const token = generateToken(user?._id);
    await User.findByIdAndUpdate(
      (user?._id).toString(),
      {
        accessToken: token,
      },
      { $new: true }
    );

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      _id: user._id,
      email: user.email,
      accessToken: token,
    });
  } catch (error) {
    return res.status(500).json(error);
  }
}

export async function logoutUser(req, res) {
  try {
    const user = res.user;
    if (!user) {
      return res.status(204).json("User logged out!");
    }
    console.log(user);
    await User.findByIdAndUpdate(user._id, {
      accessToken: "",
    });

    res.clearCookie("token");
    return res.status(204).json("User logged out!");
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
}
