import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getReceivedInvitations = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const invitations = await prisma.groupInvitation.findMany({
      where: {
        invitedUserId: userId,
      },
    });

    return res.status(200).json({
      invitations: invitations,
      message: "Get invitations successfully",
    });
  } catch (error) {
    console.log("Error in createInvitation controller", error.message);
    res.status(500).json({ message: error.message });
  }
};

const getSentInvitations = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const invitations = await prisma.groupInvitation.findMany({
      where: {
        senderId: userId,
      },
    });

    return res.status(200).json({
      invitations: invitations,
      message: "Get invitations successfully",
    });
  } catch (error) {
    console.log("Error in createInvitation controller", error.message);
    res.status(500).json({ message: error.message });
  }
};

const createInvitation = async (req, res) => {
  try {
    const { id: senderId } = req.user;
    const { groupId, userId: invitedUserId } = req.params;

    //Check if group exist
    const group = await prisma.group.findUnique({
      where: {
        id: groupId,
      },
    });
    if (!group) {
      return res.status(401).json({ message: "Group does not exist" });
    }
    //Check if user exist
    const invitedUser = await prisma.user.findUnique({
      where: {
        id: invitedUserId,
      },
    });
    if (!invitedUser) {
      return res.status(401).json({ message: "User does not exist" });
    }

    //Check if user is already member of group
    const isMember = await prisma.groupMember.findFirst({
      where: {
        userId: invitedUserId,
        groupId: groupId,
      },
    });
    if (isMember) {
      return res
        .status(409)
        .json({ message: "Already a member of this group." });
    }

    //Check if a pending request already exists
    const existingInvitation = await prisma.groupInvitation.findFirst({
      where: {
        groupId: groupId,
        invitedUserId: invitedUserId,
        status: "PENDING",
      },
    });
    if (existingInvitation) {
      return res
        .status(409)
        .json({ message: "Already requested to join this group." });
    }

    const invitations = await prisma.groupInvitation.create({
      data: {
        invitedUserId: invitedUserId,
        senderId: senderId,
        groupId: groupId,
      },
    });

    return res.status(200).json({
      invitations: invitations,
      message: "Invitations sent successfully",
    });
  } catch (error) {
    console.log("Error in createInvitation controller", error.message);
    res.status(500).json({ message: error.message });
  }
};

const handleInvitaion = async (req, res) => {
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
    const invitation = await prisma.groupInvitation.findUnique({
      where: { id: requestId },
    });

    console.log(invitation);
    if (!invitation || invitation.groupId !== groupId) {
      return res
        .status(404)
        .json({ message: "Join request not found for this group." });
    }

    //Validate if this is current user's invitation
    if (invitation.invitedUserId !== userId) {
      return res
        .status(404)
        .json({
          message: "You do not have a pending invitation to join this group.",
        });
    }

    // Update the request
    const updatedInvitation = await prisma.groupInvitation.update({
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
          userId: invitation.invitedUserId,
          groupId: groupId,
        },
      });
    }

    res.status(200).json({
      message: `Invitation ${
        action === "ACCEPT" ? "accepted" : "declined"
      } successfully.`,
      updatedInvitation,
    });
  } catch (error) {
    console.log("Error in handleJoinRequest controller", error.message);
    res.status(500).json({ message: error.message });
  }
};

export {
  getReceivedInvitations,
  getSentInvitations,
  createInvitation,
  handleInvitaion,
};
