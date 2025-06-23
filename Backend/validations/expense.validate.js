import Joi from "joi";

const discountTypes = ["NONE", "PERCENTAGE", "FIXED_AMOUNT"];
const splitTypes = ["EQUAL", "PERCENTAGE", "FIXED_AMOUNT", "CUSTOM"];

const expenseValidate = Joi.object({
  id: Joi.string().optional(),

  description: Joi.string().required().messages({
    "string.base": "Description must be a string.",
    "string.empty": "Description is required.",
    "any.required": "Description is required.",
  }),

  totalAmount: Joi.number().precision(2).required().messages({
    "number.base": "Total amount must be a number.",
    "any.required": "Total amount is required.",
  }),

  expenseDate: Joi.date().required().messages({
    "date.base": "Expense date must be a valid date.",
    "any.required": "Expense date is required.",
  }),

  paidById: Joi.string().required().messages({
    "string.base": "PaidById must be a string.",
    "string.empty": "PaidById is required.",
    "any.required": "PaidById is required.",
  }),

  groupId: Joi.string().optional().allow(null).messages({
    "string.base": "GroupId must be a string or null.",
  }),

  discountType: Joi.string()
    .valid(...discountTypes)
    .default("NONE")
    .messages({
      "any.only": `Discount type must be one of ${discountTypes.join(", ")}.`,
    }),

  discountValue: Joi.number().precision(2).default(0).messages({
    "number.base": "Discount value must be a number.",
  }),

  // discountedAmount: Joi.number().precision(2).required().messages({
  //   "number.base": "Discounted amount must be a number.",
  //   "any.required": "Discounted amount is required.",
  // }),

  splitType: Joi.string()
    .valid(...splitTypes)
    .default("EQUAL")
    .messages({
      "any.only": `Split type must be one of ${splitTypes.join(", ")}.`,
    }),

  participants: Joi.array().items(Joi.object()).optional().messages({
    "array.base": "Participants must be an array.",
  }),

  splits: Joi.array().items(Joi.object()).optional().messages({
    "array.base": "Splits must be an array.",
  }),

  proofOfPayments: Joi.array().items(Joi.object()).optional().messages({
    "array.base": "Proof of payments must be an array.",
  }),

  createdAt: Joi.date().optional(),
  updatedAt: Joi.date().optional(),
});
export { expenseValidate };
