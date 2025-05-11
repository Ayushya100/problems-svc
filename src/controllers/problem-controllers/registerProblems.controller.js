'use strict';

import { convertIdToPrettyString, convertPrettyStringToId, logger } from 'common-node-lib';
import { isProblemExist, getMultipleTagsByIds, getMultipleLanguagesByIds, getLastProblemCode } from '../../db/index.js';
import { batchSubmission, batchResult } from '../../utils/requestJudge0Svc.js';
import { saveProblemRecords } from '../../db/index.js';
import { getProblemById } from './getProblemInfo.controller.js';

const log = logger('Controller: register-problem');

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const verifyProblemExist = async (title) => {
  try {
    log.info('Controller function to validate if the problem with same title already exist in system activated');
    log.info('Call db query to validate if problem with title already exists');
    const problemDtl = await isProblemExist(title);
    if (problemDtl.rowCount > 0) {
      log.error('Problem with same title already exists in system');
      return {
        status: 409,
        message: 'Problem with same title already exists',
        data: [],
        errors: [],
        stack: 'verifyProblemExist function call',
        isValid: false,
      };
    }

    log.success('Problem title verification completed successfully');
    return {
      status: 200,
      message: 'Problem does not exists in system',
      data: {},
      isValid: true,
    };
  } catch (err) {
    log.error('Error while validating new problem in system');
    return {
      status: 500,
      message: 'An error occurred while validating problem in system',
      data: [],
      errors: err,
      stack: err.stack,
      isValid: false,
    };
  }
};

const verifyTagsForProblem = async (tags) => {
  try {
    log.info('Controller function to validate provided tags for problem system initiated');
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
          stack: 'verifyTagsForProblem function call',
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
    log.error('Error while validating provided tags for problem in system');
    return {
      status: 500,
      message: 'An error occurred while validating tags for problem in system',
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
    log.info('Call controller function to validate the reference solutions and test cases for the requested problems');
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
    log.error('Error while validating provided solutions for problem in system');
    return {
      status: 500,
      message: 'An error occurred while validating solutions for problem in system',
      data: [],
      errors: err,
      stack: err.stack,
      isValid: false,
    };
  }
};

const registerNewProblem = async (userId, userApproveStatus, payload) => {
  try {
    log.info('Call controller function to store problem details in db');
    userId = convertPrettyStringToId(userId);
    payload.tags = payload.tags.map((tag) => convertPrettyStringToId(tag));

    let problemCode;
    log.info('Call db query to fetch last running number for the problem code');
    let lastProblemCode = await getLastProblemCode();
    if (lastProblemCode.rowCount === 0) {
      problemCode = 1;
    } else {
      problemCode = lastProblemCode.rows[0].problem_cd + 1;
    }

    const tagPayload = [];
    const examplePayload = [];
    const hintsPayload = [];
    const testCasesPayload = [];
    const snippetPayload = [];
    const solutionPayload = [];

    const problemPayload = {
      typeId: convertPrettyStringToId(payload.typeId),
      problemCode: problemCode,
      problemTitle: payload.title,
      problemDesc: payload.description,
      difficulty: payload.difficulty,
      constraints: payload.constraints,
      approved: userApproveStatus,
    };

    for (const tag of payload.tags) {
      tagPayload.push(tag);
    }

    for (const example of payload.examples) {
      examplePayload.push({
        input: example.input,
        output: example.output,
        explanation: example.explanation,
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

    log.info('Call register query to store problem details in db');
    const problemInfo = await saveProblemRecords(problemPayload, tagPayload, examplePayload, hintsPayload, testCasesPayload, snippetPayload, solutionPayload);
    const problemId = problemInfo.rows[0].id;

    const newProblemDtl = await getProblemById(problemId);
    log.success('Problem registered successfully');
    return {
      status: 201,
      message: 'Problem registered successfully',
      data: newProblemDtl.data,
      isValid: true,
    };
  } catch (err) {
    log.error('Error while storing problem details in system');
    return {
      status: 500,
      message: 'An error occurred while storing problem details in system',
      data: [],
      errors: err,
      stack: err.stack,
      isValid: false,
    };
  }
};

export { verifyProblemExist, verifyTagsForProblem, validateSolutions, registerNewProblem };
