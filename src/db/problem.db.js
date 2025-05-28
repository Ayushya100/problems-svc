'use strict';

import { exec } from 'common-node-lib';

const isSheetExistAvailable = async (typeCd) => {
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

const registerNewTagInfo = async (tagCd, tagDesc, category, metadata) => {
  const query = `INSERT INTO TAGS (TAG_CD, TAG_DESC, CATEGORY, METADATA)
    VALUES (?, ?, ?, ?)
    RETURNING ID;`;
  const params = [tagCd, tagDesc, category, metadata];

  return exec(query, params);
};

const getTagInfoById = async (tagId, deletedRecord) => {
  const query = `SELECT ID, TAG_CD, TAG_DESC, CATEGORY, METADATA, CORE, CREATED_DATE, MODIFIED_DATE FROM TAGS
    WHERE IS_DELETED = ? AND ID = ?;`;
  const params = [deletedRecord, tagId];

  return exec(query, params);
};

const getTags = async (category = null) => {
  let query = `SELECT ID, TAG_CD, TAG_DESC, CATEGORY FROM TAGS WHERE IS_DELETED = false`;
  const params = [];

  if (category) {
    query += ` AND CATEGORY = ?;`;
    params.push(category);
  }
  return exec(query, params);
};

const updateTagInfo = async (payload, userId, tagId) => {
  const query = `UPDATE TAGS SET TAG_DESC = ?, MODIFIED_BY = ?
    WHERE ID = ? AND IS_DELETED = false;`;
  const params = [payload.tagDesc, userId, tagId];

  return exec(query, params);
};

const deleteSheetTypeInfoById = async (typeId, userId) => {
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

const getDefaultLangForTypeId = async (typeId) => {
  const query = `SELECT ID FROM SUPPORT_LANGUAGE WHERE TYPE_ID = ? AND IS_DELETED = false;`;
  const params = [typeId];
  return exec(query, params);
};

const changeLangToNonDefaultById = async (userId, langId) => {
  const query = `UPDATE SUPPORT_LANGUAGE SET IS_DEFAULT = false, MODIFIED_BY = ? WHERE ID = ?;`;
  const params = [userId, langId];
  return exec(query, params);
};

const registerNewLanguage = async (typeId, langCode, language, metadata, isDefault) => {
  const query = `INSERT INTO SUPPORT_LANGUAGE (TYPE_ID, LANG_CD, LANGUAGE, METADATA, IS_DEFAULT)
    VALUES (?, ?, ?, ?, ?)
    RETURNING ID;`;
  const params = [typeId, langCode, language, metadata, isDefault];

  return exec(query, params);
};

const getLangInfoById = async (langId, deletedRecord) => {
  const query = `SELECT S.ID, S.TYPE_ID, S.LANG_CD, S.LANGUAGE, S.METADATA, S.IS_DEFAULT, P.TYPE_DESC, S.CREATED_DATE, S.MODIFIED_DATE
    FROM SUPPORT_LANGUAGE S
    INNER JOIN PROBLEM_TYPE P ON P.ID = S.TYPE_ID
    WHERE S.ID = ? AND S.IS_DELETED = ?;`;
  const params = [langId, deletedRecord];

  return exec(query, params);
};

const getAllLanguages = async () => {
  const query = `SELECT ID, LANG_CD, LANGUAGE, IS_DEFAULT FROM SUPPORT_LANGUAGE WHERE IS_DELETED = false;`;
  return exec(query);
};

const getLanguagesByTypeId = async (typeId, defaultLang = null) => {
  let query = `SELECT ID, LANG_CD, LANGUAGE, IS_DEFAULT FROM SUPPORT_LANGUAGE WHERE IS_DELETED = false AND TYPE_ID = ?`;
  const params = [typeId];

  if (defaultLang) {
    query += ` AND IS_DEFAULT = ?`;
    params.push(defaultLang);
  }
  return exec(query, params);
};

const updateLanguageInfo = async (langId, userId, payload) => {
  const query = `UPDATE SUPPORT_LANGUAGE SET TYPE_ID = ?, LANGUAGE = ?, METADATA = ?, MODIFIED_BY = ?
    WHERE ID = ?`;
  const params = [payload.typeId, payload.language, payload.metadata, userId, langId];

  return exec(query, params);
};

const deleteLanguageInfo = async (langId, userId) => {
  const query = `UPDATE SUPPORT_LANGUAGE SET IS_DELETED = true, MODIFIED_BY = ? WHERE ID = ?;`;
  const params = [userId, langId];

  return exec(query, params);
};

const isSheetExist = async (title, sheetId) => {
  let query = `SELECT ID FROM PROBLEMS WHERE PROBLEM_TITLE = ? AND IS_DELETED = false`;
  const params = [title];

  if (sheetId) {
    query += ` AND ID <> ?;`;
    params.push(sheetId);
  }
  return exec(query, params);
};

const getMultipleTagsByIds = async (getMultipleTagsRecords, multipleTags) => {
  const query = `SELECT ID FROM TAGS WHERE ID IN (${getMultipleTagsRecords}) AND IS_DELETED = false;`;
  const params = multipleTags;
  return exec(query, params);
};

const getMultipleLanguagesByIds = async (getMultipleLanguageRecords, languageIds) => {
  const query = `SELECT ID, LANG_CD, METADATA FROM SUPPORT_LANGUAGE WHERE ID IN (${getMultipleLanguageRecords}) AND IS_DELETED = false;`;
  const params = languageIds;
  return exec(query, params);
};

const getLastSheetCode = async () => {
  const query = `SELECT PROBLEM_CD FROM PROBLEMS WHERE IS_DELETED = false ORDER BY PROBLEM_CD DESC LIMIT 1;`;
  return exec(query);
};

const getSheetInfoById = async (sheetId, deletedRecord) => {
  const query = `SELECT P.ID, P.TYPE_ID, P.PROBLEM_CD, P.PROBLEM_TITLE, P.PROBLEM_DESC, P.DIFFICULTY, P.CONSTRAINTS, P.CREATED_DATE, P.MODIFIED_DATE
    FROM PROBLEMS P
    WHERE P.ID = ? AND P.IS_DELETED = ?;`;
  const params = [sheetId, deletedRecord];

  return exec(query, params);
};

const getSheetTagsById = async (sheetId, deletedRecord) => {
  const query = `SELECT TAG.ID TAG_ID, TAG.TAG_DESC
    FROM PROBLEMS P
    INNER JOIN PROBLEM_TAGS T ON T.PROBLEM_ID = P.ID AND T.IS_DELETED = false
    INNER JOIN TAGS TAG ON TAG.ID = T.TAG_ID AND TAG.IS_DELETED = false
    WHERE P.ID = ? AND P.IS_DELETED = ?`;
  const params = [sheetId, deletedRecord];
  return exec(query, params);
};

const getSheetExampleById = async (sheetId, deletedRecord) => {
  const query = `SELECT E.ID EXAMPLE_ID, E.INPUT, E.OUTPUT, E.EXPLANATION
    FROM PROBLEMS P
    INNER JOIN PROBLEM_EXAMPLES E ON E.PROBLEM_ID = P.ID AND E.IS_DELETED = false
    WHERE P.ID = ? AND P.IS_DELETED = ?;`;
  const params = [sheetId, deletedRecord];
  return exec(query, params);
};

const getSheetHintById = async (sheetId, deletedRecord) => {
  const query = `SELECT H.ID HINT_ID, H.HINT_NO, H.HINT
    FROM PROBLEMS P
    INNER JOIN PROBLEM_HINTS H ON H.PROBLEM_ID = P.ID AND H.IS_DELETED = false
    WHERE P.ID = ? AND P.IS_DELETED = ?;`;
  const params = [sheetId, deletedRecord];
  return exec(query, params);
};

const getSheetTestCasesById = async (sheetId, deletedRecord, privateRecords) => {
  let query = `SELECT C.ID TEST_CASE_ID, C.INPUT, C.OUTPUT, C.IS_PUBLIC
    FROM PROBLEMS P
    INNER JOIN PROBLEM_TEST_CASES C ON C.PROBLEM_ID = P.ID AND C.IS_DELETED = false
    WHERE P.ID = ? AND P.IS_DELETED = ?`;
  const params = [sheetId, deletedRecord];

  if (!privateRecords) {
    query += ` AND C.IS_PUBLIC = true`;
  }
  return exec(query, params);
};

const getSheetSnippetsById = async (sheetId, deletedRecord, defaultLang) => {
  let query = `SELECT S.ID SNIPPET_ID, S.LANGUAGE_ID, S.SNIPPET
    FROM PROBLEMS P
    INNER JOIN PROBLEM_SNIPPET S ON S.PROBLEM_ID = P.ID AND S.IS_DELETED = false
    INNER JOIN SUPPORT_LANGUAGE L ON L.ID = S.LANGUAGE_ID
    WHERE P.ID = ? AND P.IS_DELETED = ?`;
  const params = [sheetId, deletedRecord];

  if (defaultLang) {
    query += ` AND L.LANG_CD = ?;`;
    params.push(defaultLang);
  }
  return exec(query, params);
};

const getSheetSolutionsById = async (sheetId) => {
  const query = `SELECT S.ID SOLUTION_ID, S.LANGUAGE_ID, S.SOLUTION
    FROM PROBLEMS P
    INNER JOIN PROBLEM_SOLUTION S ON S.PROBLEM_ID = P.ID AND S.IS_DELETED = false
    WHERE P.ID = ? AND P.IS_DELETED = false;`;
  const params = [sheetId];

  return exec(query, params);
};

const getAllSheetInfo = async (typeId = null, tagId = null, limit, offset, difficulty, approved) => {
  let query = `SELECT P.ID, P.TYPE_ID, P.PROBLEM_CD, P.PROBLEM_TITLE, P.DIFFICULTY`;
  const params = [];

  if (tagId) {
    query += `, TAG.ID TAG_ID, TAG.TAG_DESC`;
  }
  query += ` FROM PROBLEMS P`;

  if (tagId) {
    query += ` INNER JOIN PROBLEM_TAGS T ON T.PROBLEM_ID = P.ID AND T.IS_DELETED = false
      INNER JOIN TAGS TAG ON TAG.ID = T.TAG_ID AND TAG.IS_DELETED = false AND TAG.ID = ?`;
    params.push(tagId);
  }

  query += ` WHERE P.IS_DELETED = false AND P.APPROVED = ?`;
  params.push(approved);

  if (typeId) {
    query += ` AND P.TYPE_ID = ?`;
    params.push(typeId);
  }

  if (difficulty) {
    query += ` AND P.DIFFICULTY = ?`;
    params.push(difficulty);
  }

  query += ` ORDER BY PROBLEM_CD
    LIMIT ? OFFSET ?;`;
  params.push(limit, offset);
  return exec(query, params);
};

const getTypeInfoByCode = async (typeCd, deletedRecord) => {
  const query = `SELECT ID, TYPE_CD, TYPE_DESC, EXECUTOR, CORE, CREATED_DATE, MODIFIED_DATE
        FROM PROBLEM_TYPE
        WHERE IS_DELETED = ? AND TYPE_CD = ?;`;
  const params = [deletedRecord, typeCd];

  return exec(query, params);
};

const getTagInfoByCd = async (tagCd, deletedRecord) => {
  const query = `SELECT ID, TAG_CD, TAG_DESC, CORE, CREATED_DATE, MODIFIED_DATE FROM TAGS
    WHERE IS_DELETED = ? AND TAG_CD = ?;`;
  const params = [deletedRecord, tagCd];

  return exec(query, params);
};

const getPerformanceDtlBySheetId = async (sheetId, deletedRecord) => {
  const query = `SELECT R.LANGUAGE_ID, R.SOURCE_CODE, R.STATUS, R.COMPILE_OUTPUT, R.RUNTIME_MSG, R.MEMORY_MSG
    , R.ERROR_MSG, R.MAX_MEMORY, R.MAX_TIME, R.AVG_MEMORY, R.AVG_TIME, U.FIRST_NAME, U.LAST_NAME, R.CREATED_DATE
    FROM PROBLEM_VALIDATION_RUNS R
    LEFT JOIN USERS U ON U.ID = R.RUN_BY
    WHERE R.IS_DELETED = ? AND R.PROBLEM_ID = ?
    ORDER BY R.CREATED_DATE DESC`;
  const params = [deletedRecord, sheetId];

  return exec(query, params);
};

const getSheetCount = async (typeId, tagId, difficulty, approved) => {
  let query = `SELECT COUNT(*) AS TOTAL FROM PROBLEMS P`;
  const params = [];

  if (tagId) {
    query += ` INNER JOIN PROBLEM_TAGS T ON T.PROBLEM_ID = P.ID AND T.IS_DELETED = false AND T.TAG_ID = ?`;
    params.push(tagId);
  }
  query += ` WHERE P.IS_DELETED = false AND P.APPROVED = ?`;
  params.push(approved);

  if (typeId) {
    query += ` AND P.TYPE_ID = ?`;
    params.push(typeId);
  }
  if (difficulty) {
    query += ` AND P.DIFFICULTY = ?`;
    params.push(difficulty);
  }

  return exec(query, params);
};

const isPlaylistAvailable = async (userId, name) => {
  const query = `SELECT ID, PLAYLIST_NAME, PLAYLIST_DESC FROM PLAYLIST
    WHERE USER_ID = ? AND PLAYLIST_NAME = ? AND IS_DELETED = false;`;
  const params = [userId, name];

  return exec(query, params);
};

const registerNewPlaylist = async (userId, payload) => {
  const query = `INSERT INTO PLAYLIST (USER_ID, PLAYLIST_NAME, PLAYLIST_DESC)
    VALUES (?, ?, ?)
    RETURNING ID;`;
  const params = [userId, payload.name, payload.description];

  return exec(query, params);
};

const getPlaylistByReqId = async (id, userId, deletedRecord) => {
  const query = `SELECT ID, USER_ID, PLAYLIST_NAME, PLAYLIST_DESC, CREATED_DATE, MODIFIED_DATE
    FROM PLAYLIST
    WHERE ID = ? AND USER_ID = ? AND IS_DELETED = ?;`;
  const params = [id, userId, deletedRecord];

  return exec(query, params);
};

const getPlaylistInfoForUser = async (userId) => {
  const query = `SELECT ID, USER_ID, PLAYLIST_NAME FROM PLAYLIST
    WHERE USER_ID = ? AND IS_DELETED = false;`;
  const params = [userId];

  return exec(query, params);
};

export {
  isSheetExistAvailable,
  registerNewType,
  getTypeInfoById,
  getAllTypeInfo,
  updateTypeInfoById,
  isTagExist,
  registerNewTagInfo,
  getTagInfoById,
  getTags,
  updateTagInfo,
  deleteSheetTypeInfoById,
  deleteTagInfoById,
  isLanguageExistAvailable,
  getDefaultLangForTypeId,
  changeLangToNonDefaultById,
  registerNewLanguage,
  getLangInfoById,
  getAllLanguages,
  getLanguagesByTypeId,
  updateLanguageInfo,
  deleteLanguageInfo,
  isSheetExist,
  getMultipleTagsByIds,
  getMultipleLanguagesByIds,
  getLastSheetCode,
  getSheetInfoById,
  getSheetTagsById,
  getSheetExampleById,
  getSheetHintById,
  getSheetTestCasesById,
  getSheetSnippetsById,
  getSheetSolutionsById,
  getAllSheetInfo,
  getTypeInfoByCode,
  getTagInfoByCd,
  getPerformanceDtlBySheetId,
  getSheetCount,
  isPlaylistAvailable,
  registerNewPlaylist,
  getPlaylistByReqId,
  getPlaylistInfoForUser,
};
