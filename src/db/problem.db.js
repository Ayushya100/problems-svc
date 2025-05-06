'use strict';

import { exec } from 'common-node-lib';

const isProblemExistAvailable = async (typeCd) => {
  const query = `SELECT ID, TYPE_CD, TYPE_DESC, IS_DELETED FROM PROBLEM_TYPE
        WHERE TYPE_CD = ? AND IS_DELETED = false;`;
  const params = [typeCd];

  return exec(query, params);
};

const registerNewType = async (payload) => {
  const query = `INSERT INTO PROBLEM_TYPE (TYPE_CD, TYPE_DESC)
        VALUES(?, ?)
        RETURNING ID;`;
  const params = [payload.typeCode, payload.typeDesc];

  return exec(query, params);
};

const getTypeInfoById = async (typeId) => {
  const query = `SELECT ID, TYPE_CD, TYPE_DESC, CREATED_DATE, MODIFIED_DATE
        FROM PROBLEM_TYPE
        WHERE IS_DELETED = false AND ID = ?;`;
  const params = [typeId];

  return exec(query, params);
};

const getAllTypeInfo = async () => {
  const query = `SELECT ID, TYPE_CD, TYPE_DESC FROM PROBLEM_TYPE WHERE IS_DELETED = false;`;
  return exec(query);
};

const updateTypeInfoById = async (payload, userId, typeId) => {
  const query = `UPDATE PROBLEM_TYPE SET TYPE_DESC = ?, MODIFIED_BY = ?
    WHERE ID = ? AND IS_DELETED = false;`;
  const params = [payload.typeDesc, userId, typeId];

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

const getTagInfoById = async (tagId) => {
  const query = `SELECT ID, TAG_CD, TAG_DESC, CREATED_DATE, MODIFIED_DATE FROM TAGS
    WHERE IS_DELETED = false AND ID = ?;`;
  const params = [tagId];

  return exec(query, params);
};

const getTags = async () => {
  const query = `SELECT ID, TAG_CD, TAG_DESC FROM TAGS WHERE IS_DELETED = false;`;
  return exec(query);
};

export { isProblemExistAvailable, registerNewType, getTypeInfoById, getAllTypeInfo, updateTypeInfoById, isTagExist, registerNewTagInfo, getTagInfoById, getTags };
