'use strict';

import { convertPrettyStringToId, logger } from 'common-node-lib';
import { getSheetDetailsById } from './getSheetInfo.controller.js';
import { updateSheetRecords } from '../../db/index.js';

const log = logger('Controller: update-sheet');

const getDifferences = (newArr, existingArr, idList = ['id']) => {
  const updatePayload = [];
  const deletePayload = [];

  for (const existingObj of existingArr) {
    const newFilterArr = newArr.filter((newObj) => newObj.id === existingObj.id);
    let formatedObj = {};
    if (newFilterArr.length > 0) {
      const newFilterObj = newFilterArr[0];

      for (const key of Object.keys(newFilterObj)) {
        if (idList.includes(key)) {
          formatedObj[key] = convertPrettyStringToId(newFilterObj[key]);
        } else {
          formatedObj[key] = newFilterObj[key];
        }
      }
      updatePayload.push(formatedObj);
    }

    formatedObj = {};
    const isRecordExist = newArr.some((newObj) => newObj.id === existingObj.id);
    if (!isRecordExist) {
      for (const key of Object.keys(existingObj)) {
        if (idList.includes(key)) {
          formatedObj[key] = convertPrettyStringToId(existingObj[key]);
        } else {
          formatedObj[key] = existingObj[key];
        }
      }
      deletePayload.push(formatedObj);
    }
  }

  const insertPayloadArr = newArr.filter((obj) => !obj.id);
  const insertPayload = [];

  for (const obj of insertPayloadArr) {
    const formatedObj = {};

    for (const key of Object.keys(obj)) {
      if (idList.includes(key)) {
        formatedObj[key] = convertPrettyStringToId(obj[key]);
      } else {
        formatedObj[key] = obj[key];
      }
    }
    insertPayload.push(formatedObj);
  }

  return { insertPayload, updatePayload, deletePayload };
};

const updateSheet = async (userId, sheetId, payload, performanceData) => {
  try {
    log.info('Controller operation to update the sheet details for the requested id process initiated');
    let existingSheetInfo = await getSheetDetailsById(sheetId, false);
    existingSheetInfo = existingSheetInfo.data;

    const sheetUpdatePayload = {
      id: convertPrettyStringToId(sheetId),
      typeId: convertPrettyStringToId(payload.typeId),
      userId: convertPrettyStringToId(userId),
      title: payload.title || existingSheetInfo.title,
      description: payload.description || existingSheetInfo.description,
      difficulty: payload.difficulty || existingSheetInfo.difficulty,
      constraints: payload.constraints || existingSheetInfo.constraints,
    };

    sheetUpdatePayload.performanceLog = [];
    if (performanceData) {
      for (const perf of performanceData) {
        let solution = payload.referenceSolutions.filter((ref) => ref.languageId === perf.langId);
        solution = solution[0].solution;

        sheetUpdatePayload.performanceLog.push({
          langId: convertPrettyStringToId(perf.langId),
          code: solution,
          status: 'SUCCESS',
          maxMemoConsumption: parseFloat(perf.maxMemoConsumption.toFixed(3)),
          maxTimeConsumption: parseFloat(perf.maxTimeConsumption.toFixed(3)),
          avgMemoConsumption: parseFloat(perf.avgMemoConsumption.toFixed(3)),
          avgTimeConsumption: parseFloat(perf.avgTimeConsumption.toFixed(3)),
          runBy: convertPrettyStringToId(userId),
        });
      }
    }

    // Tags Payload
    const existingTagArr = existingSheetInfo.tags.map((tag) => tag.id).flat();
    const existingTagToValidate = new Set(existingTagArr);
    const newTagsToValidate = new Set(payload.tags);

    sheetUpdatePayload.insertTagPayload = payload.tags.filter((tag) => !existingTagToValidate.has(tag)).map((tag) => convertPrettyStringToId(tag));
    sheetUpdatePayload.deleteTagPayload = existingTagArr.filter((tag) => !newTagsToValidate.has(tag)).map((tag) => convertPrettyStringToId(tag));

    // Example Payload
    const examplePayloads = getDifferences(payload.examples, existingSheetInfo.examples);
    sheetUpdatePayload.insertExamplePayload = examplePayloads.insertPayload;
    sheetUpdatePayload.updateExamplePayload = examplePayloads.updatePayload;
    sheetUpdatePayload.deleteExamplePayload = examplePayloads.deletePayload;

    // Hints Payload
    const hintPayloads = getDifferences(payload.hints, existingSheetInfo.hints);
    sheetUpdatePayload.insertHintPayload = hintPayloads.insertPayload;
    sheetUpdatePayload.updateHintPayload = hintPayloads.updatePayload;
    sheetUpdatePayload.deleteHintPayload = hintPayloads.deletePayload;

    // Test Cases Payload
    const testCasePayloads = getDifferences(payload.testCases, existingSheetInfo.testCases);
    sheetUpdatePayload.insertTestCasePayload = testCasePayloads.insertPayload;
    sheetUpdatePayload.updateTestCasePayload = testCasePayloads.updatePayload;
    sheetUpdatePayload.deleteTestCasePayload = testCasePayloads.deletePayload;

    // Code Snippets Payload
    const codeSnippetsPayloads = getDifferences(payload.codeSnippets, existingSheetInfo.codeSnippets, ['id', 'languageId']);
    sheetUpdatePayload.insertCodeSnippetsPayload = codeSnippetsPayloads.insertPayload;
    sheetUpdatePayload.updateCodeSnippetsPayload = codeSnippetsPayloads.updatePayload;
    sheetUpdatePayload.deleteCodeSnippetsPayload = codeSnippetsPayloads.deletePayload;

    // Reference Solutions Payload
    const referenceSolutionsPayloads = getDifferences(payload.referenceSolutions, existingSheetInfo.referenceSolutions, ['id', 'languageId']);
    sheetUpdatePayload.insertReferenceSolutionsPayload = referenceSolutionsPayloads.insertPayload;
    sheetUpdatePayload.updateReferenceSolutionsPayload = referenceSolutionsPayloads.updatePayload;
    sheetUpdatePayload.deleteReferenceSolutionsPayload = referenceSolutionsPayloads.deletePayload;

    await updateSheetRecords(sheetUpdatePayload);
    const updatedSheetDtl = await getSheetDetailsById(sheetId, false);

    log.success('Requested sheet info updated successfully');
    return {
      status: 200,
      message: 'Sheet info updated successfully',
      data: updatedSheetDtl.data,
      isValid: true,
    };
  } catch (err) {
    log.error('Error while updating sheet details in system');
    return {
      status: 500,
      message: 'An error occurred while updating sheet details in system',
      data: [],
      errors: err,
      stack: err.stack,
      isValid: false,
    };
  }
};

export { updateSheet };
