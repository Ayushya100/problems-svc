'use strict';

import { convertIdToPrettyString, convertPrettyStringToId, logger } from 'common-node-lib';
import { isSheetExist, getMultipleTagsByIds, getMultipleLanguagesByIds, getLastSheetCode, saveSheetRecords } from '../../db/index.js';
import { batchSubmission, batchResult } from '../../utils/requestJudge0Svc.js';
import { getSheetDetailsById } from './getSheetInfo.controller.js';

const log = logger('Controller: register-sheet');

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const verifySheetExist = async (title) => {
  try {
    log.info('Controller function to validate if the sheet with same title already exist in system activated');
    log.info('Call db query to validate if sheet with title already exists');
    const sheetDtl = await isSheetExist(title);
    if (sheetDtl.rowCount > 0) {
      log.error('Sheet with same title already exists in system');
      return {
        status: 409,
        message: 'Sheet with same title already exists',
        data: [],
        errors: [],
        stack: 'verifySheetExist function call',
        isValid: false,
      };
    }

    log.success('Sheet title verification completed successfully');
    return {
      status: 200,
      message: 'Sheet does not exists in system',
      data: {},
      isValid: true,
    };
  } catch (err) {
    log.error('Error while validating new sheet in system');
    return {
      status: 500,
      message: 'An error occurred while validating sheet in system',
      data: [],
      errors: err,
      stack: err.stack,
      isValid: false,
    };
  }
};

const verifyTagsForSheet = async (tags) => {
  try {
    log.info('Controller function to validate provided tags for sheet system initiated');
    if (tags.length > 0) {
      const getMultipleTagsRecords = tags.map(() => '?').join(', ');
      const multipleTags = tags.map((tag) => convertPrettyStringToId(tag));

      const tagRecords = await getMultipleTagsByIds(getMultipleTagsRecords, multipleTags);
      if (tagRecords.rowCount !== tags.length) {
        log.error('Provided tags holds incorrect tag ids');
        return {
          status: 400,
          message: 'Provided tags id incorrect',
          data: [],
          errors: [],
          stack: 'verifyTagsForSheet function call',
          isValid: false,
        };
      }
    }

    log.success('Provided tags verification completed successfully');
    return {
      status: 200,
      message: 'Provided tags verification completed',
      data: {},
      isValid: true,
    };
  } catch (err) {
    log.error('Error while validating provided tags for sheet in system');
    return {
      status: 500,
      message: 'An error occurred while validating tags for sheet in system',
      data: [],
      errors: err,
      stack: err.stack,
      isValid: false,
    };
  }
};

const pollBatchResults = async (protocol, params) => {
  while (true) {
    const result = await batchResult(protocol, params);
    const submission = result.data.submissions;

    const isAllCasesVerified = submission.every((result) => result.status.id !== 1 && result.status.id !== 2);
    if (isAllCasesVerified) {
      return submission;
    }
    await sleep(1000);
  }
};

const validateSolutions = async (protocol, payload) => {
  try {
    log.info('Call controller function to validate the reference solutions and test cases for the requested sheets');
    const referenceSolutions = payload.referenceSolutions;
    const testCases = payload.testCases;

    const languageIds = referenceSolutions.map((solution) => convertPrettyStringToId(solution.languageId));
    const getMultipleLanguageRecords = referenceSolutions.map(() => '?').join(', ');

    let languageRecords = await getMultipleLanguagesByIds(getMultipleLanguageRecords, languageIds);
    if (languageIds.length !== languageRecords.rowCount) {
      log.error('Incorrect language id provided for one of the reference solutions');
      return {
        status: 400,
        message: 'Incorrect language id for one of the reference solutions',
        data: [],
        errors: [],
        stack: 'validateSolutions function call',
        isValid: false,
      };
    }
    languageRecords = languageRecords.rows.map((record) => {
      return {
        id: convertIdToPrettyString(record.id),
        langCode: record.lang_cd,
        metadata: Number(record.metadata),
      };
    });

    for (const { languageId, solution } of referenceSolutions) {
      const lang = languageRecords.find((language) => language.id === languageId);
      const judge0Language = lang.langCode;
      const judge0LanguageCode = lang.metadata;

      if (judge0LanguageCode === null || judge0LanguageCode < 45 || judge0LanguageCode > 74) {
        log.error('Invalid Judge0 ID');
        return {
          status: 400,
          message: 'Invalid executor id',
          data: [],
          errors: [],
          stack: 'validateSolutions function call',
          isValid: false,
        };
      }

      const submissions = testCases.map((record) => {
        return {
          source_code: solution,
          language_id: judge0LanguageCode,
          stdin: record.input,
          expected_output: record.output,
        };
      });

      const submissionResults = await batchSubmission(protocol, submissions);
      if (!submissionResults.isValid) {
        log.error('Failed to submit the reference solutions to the Judge0 executor');
        return submissionResults;
      }
      const tokens = submissionResults.data.map((res) => res.token);
      const params = {
        tokens: tokens.join(','),
        base64_encoded: false,
      };

      const submission = await pollBatchResults(protocol, params);

      for (let i = 0; i < submission.length; i++) {
        const submissionResult = submission[i];
        if (submissionResult.status.id !== 3) {
          let status = 200;

          if (submissionResult.status.id === 4) {
            status = 422;
          } else if (submissionResult.status.id === 5) {
            status = 408;
          } else if (submissionResult.status.id === 6) {
            status = 400;
          } else if (submissionResult.status.id === 13) {
            status = 500;
          } else if (submissionResult.status.id === 14) {
            status = 415;
          } else {
            status = 500;
          }

          log.error(`Testcase ${i + 1} failed for language ${judge0Language}`);
          return {
            status: status,
            message: `Testcase ${i + 1} failed for language ${judge0Language}`,
            data: [],
            errors: [],
            stack: 'validateSolutions function call',
            isValid: false,
          };
        }
      }
    }

    log.success('Testcases verification completed successfully');
    return {
      status: 200,
      message: 'Solution validation completed',
      data: {},
      isValid: true,
    };
  } catch (err) {
    log.error('Error while validating provided solutions for sheet in system');
    return {
      status: 500,
      message: 'An error occurred while validating solutions for sheet in system',
      data: [],
      errors: err,
      stack: err.stack,
      isValid: false,
    };
  }
};

const registerNewSheet = async (userId, userApproveStatus, payload) => {
  try {
    log.info('Call controller function to store sheet details in db');
    userId = convertPrettyStringToId(userId);
    payload.tags = payload.tags.map((tag) => convertPrettyStringToId(tag));

    let sheetCode;
    log.info('Call db query to fetch last running number for the sheet code');
    let lastSheetCode = await getLastSheetCode();
    if (lastSheetCode.rowCount === 0) {
      sheetCode = 1;
    } else {
      sheetCode = lastSheetCode.rows[0].problem_cd + 1;
    }

    const tagPayload = [];
    const examplePayload = [];
    const hintsPayload = [];
    const testCasesPayload = [];
    const snippetPayload = [];
    const solutionPayload = [];

    const sheetPayload = {
      typeId: convertPrettyStringToId(payload.typeId),
      sheetCode: sheetCode,
      sheetTitle: payload.title,
      sheetDesc: payload.description,
      difficulty: payload.difficulty,
      constraints: payload.constraints,
      approved: userApproveStatus,
    };
    console.log(sheetPayload);

    for (const tag of payload.tags) {
      tagPayload.push(tag);
    }

    for (const example of payload.examples) {
      examplePayload.push({
        input: example.input,
        output: example.output,
        explanation: example.explanation || null,
      });
    }

    for (const hint of payload.hints) {
      hintsPayload.push({
        hintNo: hint.orderNo,
        hint: hint.hint,
      });
    }

    for (const testCase of payload.testCases) {
      testCasesPayload.push({
        input: testCase.input,
        output: testCase.output,
        isPublic: testCase.isPublic,
      });
    }

    for (const snippet of payload.codeSnippets) {
      snippetPayload.push({
        languageId: convertPrettyStringToId(snippet.languageId),
        snippet: snippet.snippet,
      });
    }

    for (const solution of payload.referenceSolutions) {
      solutionPayload.push({
        languageId: convertPrettyStringToId(solution.languageId),
        solution: solution.solution,
      });
    }

    log.info('Call register query to store sheet details in db');
    const sheetInfo = await saveSheetRecords(sheetPayload, tagPayload, examplePayload, hintsPayload, testCasesPayload, snippetPayload, solutionPayload);
    const sheetId = sheetInfo.rows[0].id;

    const newSheetDtl = await getSheetDetailsById(sheetId);
    log.success('Sheet registered successfully');
    return {
      status: 201,
      message: 'Sheet registered successfully',
      data: newSheetDtl.data,
      isValid: true,
    };
  } catch (err) {
    log.error('Error while storing sheet details in system');
    return {
      status: 500,
      message: 'An error occurred while storing sheet details in system',
      data: [],
      errors: err,
      stack: err.stack,
      isValid: false,
    };
  }
};

export { verifySheetExist, verifyTagsForSheet, validateSolutions, registerNewSheet };
