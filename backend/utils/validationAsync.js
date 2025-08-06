const validate = require("./validation/index");

module.exports = (validationReq) => async (req, res, next) => {
  if (!validate[validationReq]) {
    return res
      .status(404)
      .json({ success: false, message: "Validation request is not found...!" });
  }

  try {
    const value = await validate[validationReq].validateAsync(req.body);
    req.body = value;

    next();
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};
