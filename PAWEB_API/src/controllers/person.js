const model = require("../models/person");
const modelUser = require("../models/user");
const modelRole = require("../models/role");

function senResponse(res, type, data, status = 200) {
  const result = {
    type: type,
    data: data,
  };
  return res.status(status).send(result);
}

async function generateUserName(identityDocument, roleId, personId) {
  const user = await modelUser.findOne({ userName: identityDocument });
  if (!user) {
    const newUser = new modelUser({
      userName: identityDocument,
      password: identityDocument,
      role: roleId,
      person: personId,
    });
    await newUser.save();
    return { userName: identityDocument, password: identityDocument };
  } else {
    return { userName: "", password: "" };
  }
}

exports.create = async (req, res) => {
  try {
    const body = req.body;
    const role = await modelRole.findOne({ roleName: req.body.roleName });
    body.role = role.id;
    const found = await model.findOne({
      identityDocument: body.identityDocument,
    });

    if (!found) {
      const person = new model(body);
      const result = await person.save();
      // Asignar usuario por defecto
      generateUserName(body.identityDocument, role.id, result.id).then(
        (user) => {
          result._doc.user = user;
          senResponse(res, "ok", result, 201);
        }
      );
    } else {
      const result = await model.findByIdAndUpdate(found.id, body, {
        new: true,
      });
      senResponse(res, "ok", result);
    }
  } catch (error) {
    senResponse(res, "error", error, 500);
  }
};

exports.updateById = async (req, res) => {
  // try {
  const id = req.params.id;
  const people = await model
    .findByIdAndUpdate(id, req.body, { new: true })
    .populate("role");
  senResponse(res, "ok", people);
  // } catch (error) {
  //   senResponse(res, "error", error, 500);
  // }
};

exports.getAll = async (req, res) => {
  try {
    const { roleName } = req.query;
    if (!roleName) {
      const people = await model.find().populate("role");
      senResponse(res, "ok", people);
    } else {
      // const role = await modelRole.findOne({ roleName });
      // var ObjectId = require("mongoose").Types.ObjectId;
      const people = await model.find({ roleName }).populate("role");
      senResponse(res, "ok", people);
    }
  } catch (error) {
    senResponse(res, "error", error, 500);
  }
};

exports.getById = async (req, res) => {
  try {
    const id = req.params.id;
    const people = await model.findById({ _id: id }).populate("role");
    senResponse(res, "ok", people);
  } catch (error) {
    senResponse(res, "error", error, 500);
  }
};