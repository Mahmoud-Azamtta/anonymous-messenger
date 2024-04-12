import joi from "joi";

export const newPasswordSchema = {
  body: joi.object({
    email: joi.string().email().required(),
    newPassword: joi.string().min(8).max(100).required(),
    confNewPassword: joi.valid(joi.ref("newPassword")).required(),
  }),
};
