// const express = require("express");
// const dotenv = require("dotenv");
// const cors = require("cors");
// const cookieParser = require("cookie-parser");

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";


import authRoutes from "./routes/auth.route.js";
import groupRoutes from "./routes/group.route.js";
import groupMemberRoutes from "./routes/groupMember.route.js";
import groupJoinRequestRoutes from "./routes/groupJoinRequest.route.js";
import groupInvitationRoutes from "./routes/groupInvitation.route.js";
import expenseRoutes from "./routes/expense.route.js";

import { PrismaClient } from "@prisma/client";
dotenv.config();

// const prisma = new PrismaClient();

// prisma.$use(async (params, next) => {
//   if (params.model == "User" && params.action == "post") {
    
//   }
//   return next(params);
// });

const app = express();

const corsOptions = {
  origin: "http://localhost:5173", // Replace with your frontend's origin
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

app.get("/", (req, res) => res.send("Hello world"));
app.use("/api/auth", authRoutes);
app.use("/api/group", groupRoutes);
app.use("/api/group-member", groupMemberRoutes);
app.use("/api/join-request", groupJoinRequestRoutes);
app.use("/api/invitation", groupInvitationRoutes);
app.use("/api/expense", expenseRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server is running on PORT:", PORT);
});
