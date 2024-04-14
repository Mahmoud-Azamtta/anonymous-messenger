import joi from "joi";

export const registerSchema = {
  body: joi.object({
    username: joi.string().alphanum().min(3).max(20).required(),
    email: joi.string().email().required(),
    password: joi.string().min(8).max(100).required(),
    cPassword: joi.valid(joi.ref("password")).required(),
    age: joi.number().min(18).positive().integer(),
    gender: joi.string().alphanum().valid("Male", "Female"),
  }),
  // this query part is just for testing it does not has anything to do with the registeration functionality
  // query: joi.object({
  //   test: joi.boolean().required(),
  // }),
};

export const loginSchema = {
  body: joi.object({
    email: joi.string().email().required(),
    password: joi.string().min(8).max(100).required(),
  }),
};
