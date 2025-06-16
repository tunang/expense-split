import { groupValidate } from "../validations/group.validate.js";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();



const getGroups = async (req, res) => {
  try {
    const groups = await prisma.group.findMany({
      where: {
        creatorId: req.user.id,
      },
      select: {
        id: true,
        name: true,
        description: true,
        creatorId: true,
        createdAt: true,
        updatedAt: true,
        // password is omitted
      },
    });
    res.status(200).json({ groups });
  } catch (error) {
    console.log("Error in getGroups controller", error.message);
    res.status(500).json({ message: error.message });
  }
};


const getGroupById = async (req, res) => {
  try {
    console.log("getGroupById controller", req.params.id);
    const groupId = req.params.id;
    const group = await prisma.group.findUnique({ where: { id: groupId } });
    res.status(200).json({ group });
  } catch (error) {
    console.log("Error in getGroupById controller", error.message);
    res.status(500).json({ message: error.message });
  }
};


const createGroup = async (req, res) => {
  try {
    const { name, description, password } = req.body;

    const { error } = groupValidate.validate(req.body);

    if (error) {
      console.log("Error in groupValidate");
      return res.status(400).json({ message: `${error.details[0].message}` });
    }

    const group = await prisma.group.create({
      data: {
        name: name,
        description: description,
        password: password,
        creatorId: req.user.id,
      },
    });

     // Optional: Add user to group members if created
 
      await prisma.groupMember.create({
        data: {
          userId: req.user.id,
          groupId: group.id,
          role: "OWNER"
        },
      });

    res
      .status(201)
      .json({ group: group, message: "Group created successfully" });
  } catch (error) {
    console.log("Error in createGroup controller", error.message);
    res.status(500).json({ message: error.message });
  }
};

const editGroup = async (req, res) => {
  try {
    const groupId = req.params.id;
    const { name, description, password } = req.body;

    const { error } = groupValidate.validate(req.body, { abortEarly: false });
    if (error) {
      console.log("Error in groupValidate (edit)");
      return res
        .status(400)
        .json({ message: error.details.map((err) => err.message) });
    }

    const updatedGroup = await prisma.group.update({
      where: { id: groupId },
      data: {
        name,
        description,
        password,
      },
    });

    res
      .status(200)
      .json({ group: updatedGroup, message: "Group updated successfully" });
  } catch (error) {
    console.log("Error in editGroup controller", error.message);
    res.status(500).json({ message: error.message });
  }
};

const deleteGroup = async (req, res) => {
  try {
    const groupId = req.params.id;

    await prisma.group.delete({ where: { id: groupId } });

    res.status(200).json({ message: "Group deleted successfully" });
  } catch (error) {
    console.log("Error in deleteGroup controller", error.message);
    res.status(500).json({ message: error.message });
  }
};

  export { createGroup, editGroup, deleteGroup, getGroups, getGroupById};
