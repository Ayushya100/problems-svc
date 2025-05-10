'use strict';

import { exec } from 'common-node-lib';

const isProblemExistAvailable = async (typeCd) => {
  const query = `SELECT ID, TYPE_CD, TYPE_DESC, IS_DELETED FROM PROBLEM_TYPE
        WHERE TYPE_CD = ? AND IS_DELETED = false;`;
  const params = [typeCd];

  return exec(query, params);
};

const registerNewType = async (payload) => {
  const query = `INSERT INTO PROBLEM_TYPE (TYPE_CD, TYPE_DESC, EXECUTOR)
        VALUES(?, ?, ?)
        RETURNING ID;`;
  const params = [payload.typeCode, payload.typeDesc, payload.executor];

  return exec(query, params);
};

const getTypeInfoById = async (typeId, deletedRecord) => {
  const query = `SELECT ID, TYPE_CD, TYPE_DESC, EXECUTOR, CORE, CREATED_DATE, MODIFIED_DATE
        FROM PROBLEM_TYPE
        WHERE IS_DELETED = ? AND ID = ?;`;
  const params = [deletedRecord, typeId];

  return exec(query, params);
};

const getAllTypeInfo = async () => {
  const query = `SELECT ID, TYPE_CD, TYPE_DESC, EXECUTOR FROM PROBLEM_TYPE WHERE IS_DELETED = false;`;
  return exec(query);
};

const updateTypeInfoById = async (payload, userId, typeId) => {
  const query = `UPDATE PROBLEM_TYPE SET TYPE_DESC = ?, EXECUTOR = ?, MODIFIED_BY = ?
    WHERE ID = ? AND IS_DELETED = false;`;
  const params = [payload.typeDesc, payload.executor, userId, typeId];

  return exec(query, params);
};

const isTagExist = async (tagCd) => {
  const query = `SELECT ID FROM TAGS WHERE IS_DELETED = false AND TAG_CD = ?;`;
  const params = [tagCd];
  return exec(query, params);
};

const registerNewTagInfo = async (tagCd, tagDesc) => {
  const query = `INSERT INTO TAGS (TAG_CD, TAG_DESC)
    VALUES (?, ?)
    RETURNING ID;`;
  const params = [tagCd, tagDesc];

  return exec(query, params);
};

const getTagInfoById = async (tagId, deletedRecord) => {
  const query = `SELECT ID, TAG_CD, TAG_DESC, CORE, CREATED_DATE, MODIFIED_DATE FROM TAGS
    WHERE IS_DELETED = ? AND ID = ?;`;
  const params = [deletedRecord, tagId];

  return exec(query, params);
};

const getTags = async () => {
  const query = `SELECT ID, TAG_CD, TAG_DESC FROM TAGS WHERE IS_DELETED = false;`;
  return exec(query);
};

const updateTagInfo = async (payload, userId, tagId) => {
  const query = `UPDATE TAGS SET TAG_DESC = ?, MODIFIED_BY = ?
    WHERE ID = ? AND IS_DELETED = false;`;
  const params = [payload.tagDesc, userId, tagId];

  return exec(query, params);
};

const deleteProblemTypeInfoById = async (typeId, userId) => {
  const query = `UPDATE PROBLEM_TYPE SET IS_DELETED = true, MODIFIED_BY = ?
    WHERE ID = ?;`;
  const params = [userId, typeId];

  return exec(query, params);
};

const deleteTagInfoById = async (tagId, userId) => {
  const query = `UPDATE TAGS SET IS_DELETED = true, MODIFIED_BY = ?
    WHERE ID = ?;`;
  const params = [userId, tagId];

  return exec(query, params);
};

const isLanguageExistAvailable = async (typeId, langCode) => {
  const query = `SELECT ID FROM SUPPORT_LANGUAGE WHERE TYPE_ID = ? AND LANG_CD = ? AND IS_DELETED = false;`;
  const params = [typeId, langCode];
  return exec(query, params);
};

const registerNewLanguage = async (typeId, langCode, language) => {
  const query = `INSERT INTO SUPPORT_LANGUAGE (TYPE_ID, LANG_CD, LANGUAGE)
    VALUES (?, ?, ?)
    RETURNING ID;`;
  const params = [typeId, langCode, language];

  return exec(query, params);
};

const getLangInfoById = async (langId, deletedRecord) => {
  const query = `SELECT S.ID, S.LANG_CD, S.LANGUAGE, P.TYPE_DESC, S.CREATED_DATE, S.MODIFIED_DATE
    FROM SUPPORT_LANGUAGE S
    INNER JOIN PROBLEM_TYPE P ON P.ID = S.TYPE_ID
    WHERE S.ID = ? AND S.IS_DELETED = ?;`;
  const params = [langId, deletedRecord];

  return exec(query, params);
};

const getAllLanguages = async () => {
  const query = `SELECT ID, LANG_CD, LANGUAGE FROM SUPPORT_LANGUAGE WHERE IS_DELETED = false;`;
  return exec(query);
};

export {
  isProblemExistAvailable,
  registerNewType,
  getTypeInfoById,
  getAllTypeInfo,
  updateTypeInfoById,
  isTagExist,
  registerNewTagInfo,
  getTagInfoById,
  getTags,
  updateTagInfo,
  deleteProblemTypeInfoById,
  deleteTagInfoById,
  isLanguageExistAvailable,
  registerNewLanguage,
  getLangInfoById,
  getAllLanguages,
};
