const dataMethods = ["body", "query", "headers"];

const validate = (schema) => {
  return (req, res, next) => {
    const validationResults = [];
    dataMethods.forEach((method) => {
      if (schema[method]) {
        const methodValidationResult = schema[method].validate(req[method], {
          abortEarly: false,
        });
        if (methodValidationResult.error)
          validationResults.push(methodValidationResult.error.details);
      }
    });
    if (validationResults.length > 0) {
      return res.status(400).json({
        message: "Validation error",
        errors: validationResults,
      });
    }
    next();
  };
};

export default validate;
