const ResourceNotFound = require("../errors/ResourceNotFound");
const AccessForbidden = require("../errors/AccessForbidden");

// eslint-disable-next-line valid-typeof
const isObjectEmpty = (obj) => obj === null || typeof obj === undefined;
const isArrayEmpty = (arr) => {
  if (arr === null || typeof arr === "undefined") {
    return true;
  }
  return arr.length === 0;
};

const toJson = (obj) => JSON.parse(JSON.stringify(obj));

const deleteSensitiveFields = (obj) => {
  if (!obj || typeof obj !== "object") {
    return obj;
  }
  delete obj.password;
  delete obj.emailVerificationCode;
  delete obj.passwordResetCode;
  // delete obj.createdAt;
  delete obj.updatedAt;
  delete obj.rankPoints;
  delete obj.gallery_otp_details;
  delete obj.gallery_sms_otp_details;
  Object.values(obj).forEach(deleteSensitiveFields);
  return obj;
};

const hideSensitiveInfo = (obj) => {
  if (!obj) {
    return null;
  }
  if (typeof obj !== "object") {
    return obj;
  }
  const jsonObj = toJson(obj);
  deleteSensitiveFields(jsonObj);
  return jsonObj;
};

const OrFields = (obj) => ({
  [Op.or]: Object.entries(obj)
    .filter(([, value]) => typeof value !== "undefined")
    .map(([key, value]) => ({ [key]: [value] })),
});
const findById = async (model, id) => {
  const r = await model.findOne({
    where: {
      id,
    },
  });
  if (isObjectEmpty(r)) {
    throw new ResourceNotFound(`${model.name || "Resource"} not found`);
  }
  return toJson(r);
};

function removeUndefineds(obj) {
  Object.keys(obj).forEach((key) =>
    obj[key] === undefined ? delete obj[key] : {}
  );
  return obj;
}

function removeUndefinedsArray(arr) {
  return arr.filter((element) => typeof element !== "undefined");
}

function checkUserIds(currentUserId, userId) {
  if (currentUserId !== userId) {
    throw new AccessForbidden("Acess forbidden");
  }
}

function checkNotNull(obj, msg) {
  if (!obj) {
    throw new ResourceNotFound(msg || "Resource not found");
  }
}

module.exports = {
  isArrayEmpty,
  isObjectEmpty,
  findById,
  toJson,
  hideSensitiveInfo,
  OrFields,
  removeUndefineds,
  removeUndefinedsArray,
  checkUserIds,
  checkNotNull,
};
