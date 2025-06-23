import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const protectRoute = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
      return res
        .status(401)
        .json({ message: "Unauthorized - no access token provided" });
    }

    try {
      const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

      const user = await prisma.user.findUnique({
        where: {
          id: decoded.userId,
        },
        select: {
          id: true,
          email: true,
          fullName: true,
          role: true,
        },
      });

      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      req.user = user;
      next();
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res
          .status(401)
          .json({ message: "Unauthorized - Access token expired" });
      }
      throw error;
    }
  } catch (error) {
    console.log("Error in protectRoute middleware", error.message);
    return res
      .status(401)
      .json({ message: "Unauthorized - invalid access token" });
  }
};

const adminRoute = (req, res, next) => {
  if (req.user && req.user.role === "ADMIN") {
    next();
  } else {
    return res.status(403).json({ message: "Access denied - Admin only" });
  }
};

const groupCreatorRoute = async (req, res, next) => {
  const groupId = req.params.groupId;
  if(!groupId){
    return res.status(400).json({ message: "Group id not found" });
  }
  
  const existingGroup = await prisma.group.findUnique({
    where: { id: groupId },
  });
  
  //If group exists or not
  if (!existingGroup) {
    return res.status(404).json({ message: "Group not found" });
  }

  //Only the creator can delete
  if (existingGroup.creatorId !== req.user.id) {
    return res
      .status(403)
      .json({ message: "Access denided - Group creator only" });
  }

  next()
};

export { protectRoute, adminRoute, groupCreatorRoute };
