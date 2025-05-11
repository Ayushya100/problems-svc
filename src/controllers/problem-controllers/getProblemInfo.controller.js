'use strict';

import { convertIdToPrettyString, convertPrettyStringToId, convertToNativeTimeZone, logger } from 'common-node-lib';
import { getProblemInfoById, getProblemTagsById, getProblemExampleById, getProblemHintById, getProblemTestCasesById, getProblemSnippetsById } from '../../db/index.js';

const log = logger('Controller: get-problem-type');

const getProblemById = async (problemId, deletedRecord = false) => {
  try {
    log.info('Controller function to fetch problem details for requested id process initiated');
    problemId = convertPrettyStringToId(problemId);
    const langCode = 'JAVASCRIPT';

    log.info(`Default Language Code: ${langCode}`);
    log.info(`Call db queries to fetch problem details for provided id: ${problemId}`);
    let problemDtl = await getProblemInfoById(problemId, deletedRecord);
    if (problemDtl.rowCount === 0) {
      log.error('Problem detail requested for the provided id does not exists in system');
      return {
        status: 404,
        message: 'Problem details not found',
        data: [],
        errors: [],
        stack: 'getProblemById function call',
        isValid: false,
      };
    }
    problemDtl = problemDtl.rows[0];

    const data = {
      id: convertIdToPrettyString(problemDtl.id),
      problemCode: problemDtl.problem_cd,
      title: problemDtl.problem_title,
      description: problemDtl.problem_desc,
      difficulty: problemDtl.difficulty,
      constraints: problemDtl.constraints,
      tags: [],
      examples: [],
      hints: [],
      testCases: [],
      codeSnippet: [],
    };

    let tagDtl = await getProblemTagsById(problemId, deletedRecord);
    if (tagDtl.rowCount > 0) {
      tagDtl = tagDtl.rows;
      for (const tag of tagDtl) {
        data.tags.push({
          id: convertIdToPrettyString(tag.tag_id),
          tag: tag.tag_desc,
        });
      }
    }

    let exampleDtl = await getProblemExampleById(problemId, deletedRecord);
    if (exampleDtl.rowCount > 0) {
      exampleDtl = exampleDtl.rows;
      for (const example of exampleDtl) {
        data.examples.push({
          id: convertIdToPrettyString(example.example_id),
          input: example.input,
          output: example.output,
          explanation: example.explanation,
        });
      }
    }

    let hintDtl = await getProblemHintById(problemId, deletedRecord);
    if (hintDtl.rowCount > 0) {
      hintDtl = hintDtl.rows;
      for (const hint of hintDtl) {
        data.hints.push({
          id: convertIdToPrettyString(hint.hint_id),
          orderNo: Number(hint.hint_no),
          hint: hint.hint,
        });
      }
    }

    let testCasesDtl = await getProblemTestCasesById(problemId, deletedRecord);
    if (testCasesDtl.rowCount > 0) {
      testCasesDtl = testCasesDtl.rows;
      for (const testCase of testCasesDtl) {
        data.testCases.push({
          id: convertIdToPrettyString(testCase.test_case_id),
          input: testCase.input,
          output: testCase.output,
        });
      }
    }

    let snippetsDtl = await getProblemSnippetsById(problemId, deletedRecord, langCode);
    if (snippetsDtl.rowCount > 0) {
      snippetsDtl = snippetsDtl.rows;
      for (const snippet of snippetsDtl) {
        data.codeSnippet.push({
          id: convertIdToPrettyString(snippet.snippet_id),
          languageId: convertIdToPrettyString(snippet.language_id),
          snippet: snippet.snippet,
        });
      }
    }

    log.success('Requested Problem details fetched successfully');
    return {
      status: 200,
      message: 'Problem details fetched successfully',
      data: data,
      isValid: true,
    };
  } catch (err) {
    log.error('Error while fetching support problem detail for requested id from system');
    return {
      status: 500,
      message: 'An error occurred while fetching problem detail for requested id from system',
      data: [],
      errors: err,
      stack: err.stack,
      isValid: false,
    };
  }
};

export { getProblemById };
