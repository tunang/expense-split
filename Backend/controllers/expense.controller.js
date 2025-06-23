import { Prisma } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
import { expenseValidate } from "../validations/expense.validate.js";
const prisma = new PrismaClient();



const getExpense = async (req, res) => {
  try {
    const { id } = req.user;
    const { groupId } = req.params;
    const expense = await prisma.expense.findMany({
      where: {
        groupId,
      },
      include: {
        participants: {
          include: {
            user: true,
          }
        },
        splits: true,
        proofOfPayments: true,
        paidBy: true,
      }
    });
    res.status(200).json({expenses: expense, message: "Get expenses successfully"});
  } catch (error) {
    console.log("Error in getExpense controller", error.message);
    res.status(500).json({ message: error.message });
  }
};

const createExpense = async (req, res) => {
  try {
    const { id } = req.user;
    const {
      description,
      totalAmount,
      expenseDate,
      paidById,
      groupId,
      discountType,
      discountValue,
      splitType,
      participants,
    } = req.body;

    const { error } = expenseValidate.validate(req.body);
    if (error) {
      console.log("Error in expenseValidate");
      return res.status(400).json({ message: `${error.details[0].message}` });
    }
    
    // Calculate discountedAmount based on discount information
    let discountedAmount = totalAmount; // Initialize with totalAmount

    // If discountType exists and is not NONE
    if (discountType && discountType !== "NONE") {
      switch (discountType) {
        case "PERCENTAGE":
          discountedAmount = totalAmount - totalAmount * (discountValue / 100);
          break;
        case "FIXED_AMOUNT":
          discountedAmount = totalAmount - discountValue;
          break;
        default:
          throw new Error("Invalid discount type");
      }
    }

    // Ensure discountedAmount never goes below zero
    discountedAmount = Math.max(0, discountedAmount);

    // Start a transaction to ensure all operations succeed or fail together
    const result = await prisma.$transaction(async (tx) => {
      const expense = await tx.expense.create({
        data: {
          description,
          totalAmount: parseFloat(totalAmount),
          expenseDate: new Date(expenseDate),
          paidById,
          groupId,
          discountType: discountType,
          discountValue: parseFloat(discountValue),
          discountedAmount: parseFloat(discountedAmount.toFixed(2)),
          splitType,
        },
      });

      for (const participant of participants) {
        const participantRecord = await tx.expenseParticipant.create({
          data: {
            expenseId: expense.id,
            userId: participant.userId,
            percentage: participant.percentage
              ? parseFloat(participant.percentage)
              : null,
            fixedAmount: participant.fixedAmount
              ? parseFloat(participant.fixedAmount)
              : null,
          },
        });
      }

      switch (splitType) {
        //Chia đều cho tất cả người tham gia
        case "EQUAL":
          if (discountType === "NONE") {
            const splitAmount = totalAmount / participants.length;
            for (const participant of participants) {
              const split = await tx.expenseSplit.create({
                data: {
                  expenseId: expense.id,
                  userId: participant.userId,
                  individualTotal: parseFloat(splitAmount.toFixed(2)),
                  splitAmount: parseFloat(splitAmount.toFixed(2)),
                  isPaid: false,
                },
              });
            }
            break;
          }
          //Chia đều cho tất cả người tham gia và có discount tự động tính và chia đều discount cho tất cả người tham gia
          if (discountType !== "NONE") {
            const splitAmount = totalAmount / participants.length;
            const splitDiscount = (totalAmount - discountedAmount) / participants.length;
            
            for (const participant of participants) {
              const split = await tx.expenseSplit.create({
                data: {
                  expenseId: expense.id,
                  userId: participant.userId,
                  individualTotal: parseFloat(splitAmount.toFixed(2)),
                  splitAmount: parseFloat((splitAmount - splitDiscount).toFixed(2)),
                  isPaid: false,
                },
              });
            }
          }
          break;

        //Chia theo phần trăm tổng số tiền
        case "PERCENTAGE":
          if (discountType === "NONE") {
            for (const participant of participants) {
              const splitAmount = totalAmount * (participant.percentage / 100);
              const split = await tx.expenseSplit.create({
                data: {
                  expenseId: expense.id,
                  userId: participant.userId,
                  individualTotal: parseFloat(splitAmount.toFixed(2)),
                  splitAmount: parseFloat(splitAmount.toFixed(2)),
                  isPaid: false,
                },
              });
            }
            break;
          }
          //Chia theo phần trăm tổng số tiền và có discount tự động tính và chia đều discount theo % cho tất cả người tham gia
          if(discountType !== "NONE"){
            for(const participant of participants){
              const splitAmount = totalAmount * (participant.percentage / 100);
              const participantDiscount = (totalAmount - discountedAmount) * (participant.percentage / 100);
              
              const split = await tx.expenseSplit.create({
                data: {
                  expenseId: expense.id,
                  userId: participant.userId,
                  individualTotal: parseFloat(splitAmount.toFixed(2)),
                  splitAmount: parseFloat((splitAmount - participantDiscount).toFixed(2)),
                  isPaid: false,
                },
              });
            }
          }
          break;
        
        //Chia theo số tiền cố định
        case "FIXED_AMOUNT":
          if(discountType === "NONE"){
            for(const participant of participants){
              const splitAmount = participant.fixedAmount;
              const split = await tx.expenseSplit.create({
                data: {
                  expenseId: expense.id,
                  userId: participant.userId,
                  individualTotal: parseFloat(splitAmount.toFixed(2)),
                  splitAmount: parseFloat(splitAmount.toFixed(2)),
                  isPaid: false,
                },
              });
            }
            break;
          }

          if(discountType !== "NONE"){
            for(const participant of participants){
              const splitAmount = participant.fixedAmount;
              const participantDiscount = (totalAmount - discountedAmount) * (participant.fixedAmount / totalAmount);
              
              const split = await tx.expenseSplit.create({
                data: {
                  expenseId: expense.id,
                  userId: participant.userId,
                  individualTotal: parseFloat(splitAmount.toFixed(2)),
                  splitAmount: parseFloat((splitAmount - participantDiscount).toFixed(2)),
                  isPaid: false,
                },
              });
            }
          }
          break;
        case "CUSTOM":
          break;
        default:
          throw new Error("Invalid split type");
      }
      
      // Return the expense with its related records
      const expenseWithRelations = await tx.expense.findUnique({
        where: { id: expense.id },
        include: {
          participants: {
            include: {
              user: true,
            }
          },
          splits: true,
          proofOfPayments: true,
          paidBy: true,
        }
      });

      return expenseWithRelations;
    });

    res.status(201).json({expense: result, message: "Create expense successfully"});
  } catch (error) {
    console.log("Error in createExpense controller", error.message);
    res.status(500).json({ message: error.message });
  }
};

const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const query = [];

    query.push(prisma.expenseParticipant.deleteMany({
      where: {
        expenseId: id,
      }
    }));
    query.push(prisma.expenseSplit.deleteMany({
      where: {
        expenseId: id,
      }
    }));

    query.push(prisma.proofOfPayment.deleteMany({
      where: {
        expenseId: id,
      }
    }));

    query.push(prisma.expense.delete({
      where: {
        id: id,
      }
    }));


    const result = await prisma.$transaction(query);
    console.log(result);

    res.status(200).json({ message: "Delete expense successfully", deletedExpense: result[3] });
  } catch (error) {
    console.log("Error in deleteExpense controller", error.message);
    res.status(500).json({ message: error.message });
  }
}

export { createExpense , getExpense, deleteExpense};
