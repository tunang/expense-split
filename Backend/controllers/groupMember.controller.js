import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const addMember = (req, res) => {};

const getMembers = async (req, res) => {
  try {
    const { groupId } = req.params;
    const members = await prisma.groupMember.findMany({
      where: { groupId },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            fullName: true,
          },
        },
      },
    });

    res.status(200).json({ members });
  } catch (error) {
    console.log("Error in getMembers controller", error.message);
    res.status(500).json({ message: error.message });
  }
};

const deleteMember = async (req, res) => {
  try {
    //Get groupId + memberId from params
    const { groupId, userId } = req.params;
    const deletedMember = await prisma.groupMember.delete({
      where: {
        groupId_userId: {
          groupId,
          userId,
        },
      },
    });

    res.status(200).json({
      deletedMember: deletedMember,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.log("Error in deleteMember controller", error.message);
    res.status(500).json({ message: error.message });
  }
};

const leaveGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { id } = req.user;
    await prisma.groupMember.delete({
      where: {
        groupId_userId: {
          userId: id,
          groupId,
        },
      },
    });

    res.status(200).json({ message: "Leave group successfully" });
  } catch (error) {
    console.log("Error in leaveGroup controller", error.message);
    res.status(500).json({ message: error.message });
  }
};

  export { deleteMember, leaveGroup, getMembers };
