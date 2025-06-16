import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const createJoinRequest = async (req, res) => {
  try {
    const { id } = req.user;
    const { groupId } = req.params;
    const { password } = req.body;

    //Check if group exist or not
    const group = await prisma.group.findUnique({
      where: {
        id: groupId,
      },
    });
    if (!group) {
      return res.status(401).json({ message: "Group does not exist" });
    }

    //Check group's password
    if (password !== group.password) {
      return res.status(401).json({ message: "Incorrect group password" });
    }

    //Check if user is already member of group
    const isMember = await prisma.groupMember.findFirst({
      where: {
        userId: id,
        groupId: groupId,
      },
    });
    if (isMember) {
      return res
        .status(409)
        .json({ message: "You are already a member of this group." });
    }

    //Check if a pending request already exists
    const existingRequest = await prisma.groupJoinRequest.findFirst({
      where: {
        groupId: groupId,
        userId: id,
        status: "PENDING",
      },
    });
    if (existingRequest) {
      return res
        .status(409)
        .json({ message: "You have already requested to join this group." });
    }

    const joinRequest = await prisma.groupJoinRequest.create({
      data: {
        groupId: groupId,
        userId: id,
      },
    });

    res.status(200).json({
      joinRequest: joinRequest,
      message: "Join request sent successfully",
    });
  } catch (error) {
    console.log("Error in createjoinRequest controller", error.message);
    res.status(500).json({ message: error.message });
  }
};

const handleJoinRequest = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const { groupId, requestId } = req.params;
    const { action } = req.body;

    // Validate action
    if (!["ACCEPT", "DECLINE"].includes(action)) {
      return res
        .status(400)
        .json({ message: "Invalid action. Use 'ACCEPT' or 'DECLINE'." });
    }

    // Fetch group and validate creator
    const group = await prisma.group.findUnique({
      where: { id: groupId },
    });

    if (!group) {
      return res.status(404).json({ message: "Group does not exist" });
    }

    // Find the join request
    const joinRequest = await prisma.groupJoinRequest.findUnique({
      where: { id: requestId },
    });

    if (!joinRequest || joinRequest.groupId !== groupId) {
      return res
        .status(404)
        .json({ message: "Join request not found for this group." });
    }

    // Update the request
    const updatedRequest = await prisma.groupJoinRequest.update({
      where: { id: requestId },
      data: {
        status: action === "ACCEPT" ? "ACCEPTED" : "DECLINED",
        respondedAt: new Date(),
      },
    });

    // Optional: Add user to group members if accepted
    if (action === "ACCEPT") {
      await prisma.groupMember.create({
        data: {
          userId: joinRequest.userId,
          groupId: groupId,
        },
      });
    }

    res.status(200).json({
      message: `Join request ${
        action === "ACCEPT" ? "accepted" : "declined"
      } successfully.`,
      updatedRequest,
    });
  } catch (error) {
    console.log("Error in handleJoinRequest controller", error.message);
    res.status(500).json({ message: error.message });
  }
};

export { createJoinRequest, handleJoinRequest };
