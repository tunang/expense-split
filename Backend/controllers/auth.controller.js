import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { redis } from "../lib/redis.js";
import {
  loginValidate,
  registerValidate,
} from "../validations/auth.validate.js";
const prisma = new PrismaClient();

const generateToken = (userId) => {
  const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "60s",
  });

  const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });

  return { accessToken, refreshToken };
};

const storeRefreshToken = async (userId, refreshToken) => {
  await redis.set(
    `refresh_token:${userId}`,
    refreshToken,
    "EX",
    7 * 24 * 60 * 60
  );
};

const setCookies = (res, accessToken, refreshToken) => {
  res.cookie("accessToken", accessToken, {
    httpOnly: true, //prevent XSS attack, cross site scripting attack
    secure: process.nextTick.NODE_ENV === "production",
    sameSite: "strict", //prevents CSRF, cross-site request forgery attack
    maxAge: 60 * 1000, //60minutes
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true, //prevent XSS attack, cross site scripting attack
    secure: process.nextTick.NODE_ENV === "production",
    sameSite: "strict", //prevents CSRF, cross-site request forgery attack
    maxAge: 7 * 24 * 60 * 60 * 1000, //15minutes
  });
};
const signup = async (req, res) => {
  try {
    const { email, password, fullName, username } = req.body;

    const { error } = registerValidate.validate(req.body);
    if (error) {
      console.log("Error in registerValidate");
      return res.status(400).json({ message: `${error.details[0].message}` });
    }

    const usernameExists = await prisma.user.findUnique({
      where: {
        username: username,
      },
    });

    const emailExists = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (usernameExists) {
      return res.status(400).json({
        message: "This username is already in use. Please try another one",
      });
    }

    if (emailExists) {
      return res.status(400).json({
        message: "This email is already in use. Please try another one",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email: email,
        username: username,
        password: hashedPassword,
        fullName: fullName,
      },
    });
    res.status(201).json({ user: user, message: "User created successfully" });
  } catch (error) {
    console.log("Error in signup controller", error.message);
    res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    //Get username, password from request
    const { username, password } = req.body;
    const { error } = loginValidate.validate(req.body);
    if (error) {
      console.log("Error in loginValidate");
      return res.status(400).json({ message: `${error.details[0].message}` });
    }
    //Check if user exist
    const user = await prisma.user.findUnique({
      where: {
        username: username,
      },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Incorrect username/password" });
    }

    //Check if password correct
    const comparePasswordResult = await bcrypt.compare(password, user.password);

    //If user exist and password correct, generate new token, bind token with cookie
    if (user && comparePasswordResult) {
      const { accessToken, refreshToken } = generateToken(user.id);
      await storeRefreshToken(user.id, refreshToken);
      setCookies(res, accessToken, refreshToken);
      res.status(200).json({
        user: {
          id: user.id,
          name: user.fullName,
          email: user.email,
          role: user.role,
        },
        message: "User created successfully",
      });
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Incorrect username/password" });
    }
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ message: error.message });
  }
};

const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
      // Decode JWT without verifying signature (just to extract data)
      const decoded = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET
      );

      // Get expiration time (convert to milliseconds)
      const expiryTime = decoded.exp ? new Date(decoded.exp * 1000) : null;

      // Delete from Redis
      await redis.del(`refresh_token:${decoded.userId}`);

      // Store invalidated token in DB
      await prisma.InvalidatedToken.create({
        data: {
          token: refreshToken,
          expiryTime: expiryTime, // Store expiry time in DB
        },
      });
    }

    // Clear cookies
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    res.json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Error in logout controller:", error.message);
    res.status(500).json({ message: error.message });
  }
};

const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ message: "No refresh token provided" });
    }
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    const storedToken = await redis.get(`refresh_token:${decoded.userId}`);

    if (storedToken !== refreshToken) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    const accessToken = jwt.sign(
      { userId: decoded.userId },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "60m" }
    );

    res.cookie("accessToken", accessToken, {
      httpOnly: true, //prevent XSS attack, cross site scripting attack
      secure: process.nextTick.NODE_ENV === "production",
      sameSite: "strict", //prevents CSRF, cross-site request forgery attack
      maxAge: 60 * 1000, //60 minutes
    });
    
    res.json({ 
      message: "Token refreshed successfully",
      token: accessToken 
    });
  } catch (error) {
    console.log("Error in refreshToken controller", error.message);
    res.status(500).json({ message: error.message });
  }
};

const me = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.user.id,
      },
    });
    res.status(200).json({
      user: {
        id: user.id,
        name: user.fullName,
        email: user.email,
        role: user.role,
      },
      message: "User fetched successfully",
    });
  }
  catch (error) {
    console.log("Error in me controller", error.message);
    res.status(500).json({ message: error.message });
  }
};
export { signup, login, logout, refreshToken, me };
