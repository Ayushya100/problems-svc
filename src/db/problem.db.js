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

const registerNewLanguage = async (typeId, langCode, language, metadata) => {
  const query = `INSERT INTO SUPPORT_LANGUAGE (TYPE_ID, LANG_CD, LANGUAGE, METADATA)
    VALUES (?, ?, ?, ?)
    RETURNING ID;`;
  const params = [typeId, langCode, language, metadata];

  return exec(query, params);
};

const getLangInfoById = async (langId, deletedRecord) => {
  const query = `SELECT S.ID, S.TYPE_ID, S.LANG_CD, S.LANGUAGE, S.METADATA, P.TYPE_DESC, S.CREATED_DATE, S.MODIFIED_DATE
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

const isProblemExist = async (title) => {
  const query = `SELECT ID FROM PROBLEMS WHERE PROBLEM_TITLE = ? AND IS_DELETED = false;`;
  const params = [title];
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

const getLastProblemCode = async () => {
  const query = `SELECT PROBLEM_CD FROM PROBLEMS WHERE IS_DELETED = false ORDER BY PROBLEM_CD DESC LIMIT 1;`;
  return exec(query);
};

const getProblemInfoById = async (problemId, deletedRecord) => {
  // const query = `SELECT P.ID, P.PROBLEM_CD, P.PROBLEM_TITLE, P.PROBLEM_DESC, P.DIFFICULTY, P.CONSTRAINTS
  //   , H.ID HINT_ID, H.HINT_NO, H.HINT, C.ID TEST_CASE_ID, C.INPUT, C.OUTPUT, S.ID SNIPPET_ID, S.LANGUAGE_ID, S.SNIPPET
  //   FROM PROBLEMS P
  //
  //   INNER JOIN PROBLEM_SNIPPET S ON S.PROBLEM_ID = P.ID AND S.IS_DELETED = false
  //   INNER JOIN SUPPORT_LANGUAGE L ON L.ID = S.LANGUAGE_ID AND L.LANG_CD = ?
  //   WHERE P.ID = ? AND P.IS_DELETED = ?;`;
  const query = `SELECT P.ID, P.PROBLEM_CD, P.PROBLEM_TITLE, P.PROBLEM_DESC, P.DIFFICULTY, P.CONSTRAINTS FROM PROBLEMS P
    WHERE P.ID = ? AND P.IS_DELETED = ?;`;
  const params = [problemId, deletedRecord];

  return exec(query, params);
};

const getProblemTagsById = async (problemId, deletedRecord) => {
  const query = `SELECT TAG.ID TAG_ID, TAG.TAG_DESC
    FROM PROBLEMS P
    INNER JOIN PROBLEM_TAGS T ON T.PROBLEM_ID = P.ID AND T.IS_DELETED = false
    INNER JOIN TAGS TAG ON TAG.ID = T.TAG_ID AND TAG.IS_DELETED = false
    WHERE P.ID = ? AND P.IS_DELETED = ?;`;
  const params = [problemId, deletedRecord];
  return exec(query, params);
};

const getProblemExampleById = async (problemId, deletedRecord) => {
  const query = `SELECT E.ID EXAMPLE_ID, E.INPUT, E.OUTPUT, E.EXPLANATION
    FROM PROBLEMS P
    INNER JOIN PROBLEM_EXAMPLES E ON E.PROBLEM_ID = P.ID AND E.IS_DELETED = false
    WHERE P.ID = ? AND P.IS_DELETED = ?;`;
  const params = [problemId, deletedRecord];
  return exec(query, params);
};

const getProblemHintById = async (problemId, deletedRecord) => {
  const query = `SELECT H.ID HINT_ID, H.HINT_NO, H.HINT
    FROM PROBLEMS P
    INNER JOIN PROBLEM_HINTS H ON H.PROBLEM_ID = P.ID AND H.IS_DELETED = false
    WHERE P.ID = ? AND P.IS_DELETED = ?;`;
  const params = [problemId, deletedRecord];
  return exec(query, params);
};

const getProblemTestCasesById = async (problemId, deletedRecord) => {
  const query = `SELECT C.ID TEST_CASE_ID, C.INPUT, C.OUTPUT
    FROM PROBLEMS P
    INNER JOIN PROBLEM_TEST_CASES C ON C.PROBLEM_ID = P.ID AND C.IS_DELETED = false AND C.IS_PUBLIC = true
    WHERE P.ID = ? AND P.IS_DELETED = ?;`;
  const params = [problemId, deletedRecord];
  return exec(query, params);
};

const getProblemSnippetsById = async (problemId, deletedRecord, defaultLang) => {
  const query = `SELECT S.ID SNIPPET_ID, S.LANGUAGE_ID, S.SNIPPET
    FROM PROBLEMS P
    INNER JOIN PROBLEM_SNIPPET S ON S.PROBLEM_ID = P.ID AND S.IS_DELETED = false
    INNER JOIN SUPPORT_LANGUAGE L ON L.ID = S.LANGUAGE_ID AND L.LANG_CD = ?
    WHERE P.ID = ? AND P.IS_DELETED = ?;`;
  const params = [defaultLang, problemId, deletedRecord];
  return exec(query, params);
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
  updateLanguageInfo,
  deleteLanguageInfo,
  isProblemExist,
  getMultipleTagsByIds,
  getMultipleLanguagesByIds,
  getLastProblemCode,
  getProblemInfoById,
  getProblemTagsById,
  getProblemExampleById,
  getProblemHintById,
  getProblemTestCasesById,
  getProblemSnippetsById,
};
