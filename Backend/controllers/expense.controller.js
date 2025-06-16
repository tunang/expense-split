import { Prisma } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
import { expenseValidate } from "../validations/expense.validate.js";
const prisma = new PrismaClient();

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
    let discountedAmount = 0;

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
          discountedAmount,
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
                  individualTotal: parseFloat(totalAmount),
                  splitAmount: parseFloat(splitAmount.toFixed(2)),
                  isPaid: false,
                },
              });
            }
            break;
          }

          if (discountType !== "NONE") {
            for (const participant of participants) {
              const splitAmount = totalAmount / participants.length;
              const discountedAmount = discountedAmount / participants.length;

              const split = await tx.expenseSplit.create({
                data: {
                  expenseId: expense.id,
                  userId: participant.userId,
                  individualTotal: parseFloat(totalAmount),
                  splitAmount: parseFloat(
                    (splitAmount - discountedAmount).toFixed(2)
                  ),
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
                  individualTotal: parseFloat(totalAmount),
                  splitAmount: parseFloat(splitAmount.toFixed(2)),
                  isPaid: false,
                },
              });
            }
            break;
          }

          if(discountType !== "NONE"){
            for(const participant of participants){
              const splitAmount = totalAmount * (participant.percentage / 100);
              const discountedAmount = discountedAmount * (participant.percentage / 100);
              const split = await tx.expenseSplit.create({
                data: {
                  expenseId: expense.id,
                  userId: participant.userId,
                  individualTotal: parseFloat(totalAmount),
                  splitAmount: parseFloat(
                    (splitAmount - discountedAmount).toFixed(2)
                  ),
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
              const discountedAmount = discountedAmount * (participant.fixedAmount / totalAmount );
              const split = await tx.expenseSplit.create({
                data: {
                  expenseId: expense.id,
                  userId: participant.userId,
                  individualTotal: parseFloat(totalAmount),
                  splitAmount: parseFloat(
                    (splitAmount - discountedAmount).toFixed(2)
                  ),
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
      return {
        expense,
        splits,
      };
    });

    res.status(201).json(result);
  } catch (error) {
    console.log("Error in createExpense controller", error.message);
    res.status(500).json({ message: error.message });
  }
};

export { createExpense };
