'use strict';

import { convertIdToPrettyString, convertPrettyStringToId, convertToNativeTimeZone, logger } from 'common-node-lib';
import {
  getSheetInfoById,
  getSheetTagsById,
  getSheetExampleById,
  getSheetHintById,
  getSheetTestCasesById,
  getSheetSnippetsById,
  getAllSheetInfo,
  getLanguagesByTypeId,
  getSheetSolutionsById,
  getLangInfoById,
  getPerformanceDtlBySheetId,
  getSheetCount,
} from '../../db/index.js';

const log = logger('Controller: get-sheet-type');

const data = {};

const formatMemory = (kb) => {
  return (kb / 1024).toFixed(2) + ' MB';
};
const formatTime = (sec) => {
  return (sec * 1000).toFixed(0) + ' ms';
};

const getSheetBasicInfoById = async (sheetId, deletedRecord = false) => {
  try {
    sheetId = convertPrettyStringToId(sheetId);
    log.info(`Call db queries to fetch sheet details for provided id: ${sheetId}`);
    let sheetDtl = await getSheetInfoById(sheetId, deletedRecord);
    if (sheetDtl.rowCount === 0) {
      log.error('Sheet detail requested for the provided id does not exists in system');
      return {
        status: 404,
        message: 'Sheet details not found',
        data: [],
        errors: [],
        stack: 'getSheetById function call',
        isValid: false,
      };
    }
    sheetDtl = sheetDtl.rows[0];

    data.id = convertIdToPrettyString(sheetDtl.id);
    data.typeId = convertIdToPrettyString(sheetDtl.type_id);
    data.sheetCode = sheetDtl.problem_cd;
    data.title = sheetDtl.problem_title;
    data.description = sheetDtl.problem_desc;
    data.difficulty = sheetDtl.difficulty;
    data.constraints = sheetDtl.constraints;
    data.createdDate = convertToNativeTimeZone(sheetDtl.created_date);
    data.modifiedDate = convertToNativeTimeZone(sheetDtl.modified_date);

    log.success('Sheet basic details for requested id fetched successfully');
    return {
      status: 200,
      message: 'Sheet info found',
      data: data,
      isValid: true,
    };
  } catch (err) {
    log.error('An error occurred while fetching sheet basic detail for requested id from system');
    return {
      status: 500,
      message: 'An error occurred while fetching sheet basic detail for requested id from system',
      data: [],
      errors: err,
      stack: err.stack,
      isValid: false,
    };
  }
};

const sheetDetails = async (sheetId, deletedRecord, privateRecords = false) => {
  try {
    log.info('Call db query to fetch the sheet tags for the provided sheet id');
    data.tags = [];
    let tagDtl = await getSheetTagsById(sheetId, deletedRecord);
    if (tagDtl.rowCount > 0) {
      tagDtl = tagDtl.rows;
      for (const tag of tagDtl) {
        data.tags.push({
          id: convertIdToPrettyString(tag.tag_id),
          tag: tag.tag_desc,
        });
      }
    }

    log.info('Call db query to fetch sheet examples for the provided sheet id');
    data.examples = [];
    let exampleDtl = await getSheetExampleById(sheetId, deletedRecord);
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

    log.info('Call db query to fetch sheet hints for the provided sheet id');
    data.hints = [];
    let hintDtl = await getSheetHintById(sheetId, deletedRecord);
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

    log.info('Call db query to fetch sheet test cases for the provided sheet id');
    data.testCases = [];
    let testCasesDtl = await getSheetTestCasesById(sheetId, deletedRecord, privateRecords);
    if (testCasesDtl.rowCount > 0) {
      testCasesDtl = testCasesDtl.rows;
      for (const testCase of testCasesDtl) {
        data.testCases.push({
          id: convertIdToPrettyString(testCase.test_case_id),
          input: testCase.input,
          output: testCase.output,
          isPublic: testCase.is_public,
        });
      }
    }

    log.success('Sheet tags, examples, hints, and test cases for requested sheet id fetch operation completed successfully');
    return {
      isValid: true,
    };
  } catch (err) {
    log.error('An error occurred while fetching sheet details for requested id from system');
    return {
      status: 500,
      message: 'An error occurred while fetching sheet details for requested id from system',
      data: [],
      errors: err,
      stack: err.stack,
      isValid: false,
    };
  }
};

const getSnippetsById = async (sheetId, deletedRecord, langCode = null) => {
  try {
    log.info('Call db query to fetch sheet snippets for the provided sheet id');
    data.codeSnippets = [];
    let snippetsDtl = await getSheetSnippetsById(sheetId, deletedRecord, langCode);
    if (snippetsDtl.rowCount > 0) {
      snippetsDtl = snippetsDtl.rows;
      for (const snippet of snippetsDtl) {
        data.codeSnippets.push({
          id: convertIdToPrettyString(snippet.snippet_id),
          languageId: convertIdToPrettyString(snippet.language_id),
          snippet: snippet.snippet,
        });
      }
    }

    log.success('Sheet snippets for requested sheet id fetch operation completed successfully');
    return {
      isValid: true,
    };
  } catch (err) {
    log.error('An error occurred while fetching sheet snippet for requested id from system');
    return {
      status: 500,
      message: 'An error occurred while fetching sheet snippet for requested id from system',
      data: [],
      errors: err,
      stack: err.stack,
      isValid: false,
    };
  }
};

const getSolutionsBySheetId = async (sheetId) => {
  try {
    sheetId = convertPrettyStringToId(sheetId);
    log.info('Call db query to fetch all reference solutions for requested sheet id');
    data.referenceSolutions = [];
    let sheetSolutionsDtl = await getSheetSolutionsById(sheetId);
    if (sheetSolutionsDtl.rowCount > 0) {
      sheetSolutionsDtl = sheetSolutionsDtl.rows;
      for (const solution of sheetSolutionsDtl) {
        data.referenceSolutions.push({
          id: convertIdToPrettyString(solution.solution_id),
          languageId: convertIdToPrettyString(solution.language_id),
          solution: solution.solution,
        });
      }
    }

    log.success('Sheet reference solutions for requested sheet id fetched completely');
    return {
      status: 200,
      message: 'Reference solutions found',
      data: data.referenceSolutions,
      isValid: true,
    };
  } catch (err) {
    log.error('An error occurred while fetching sheet reference solutions for requested id from system');
    return {
      status: 500,
      message: 'An error occurred while fetching reference solutions for requested id from system',
      data: [],
      errors: err,
      stack: err.stack,
      isValid: false,
    };
  }
};

const getSheetMetadata = async (typeId, tagId, difficulty, page, limit) => {
  try {
    log.info('Call db query to fetch total number of records for sheets available');
    const sheetCount = await getSheetCount(typeId, tagId, difficulty, true);
    const totalItems = sheetCount.rows[0].total;

    const totalPages = Math.ceil(totalItems / limit);
    const currentPageItems = Math.min(limit, totalItems - (page - 1) * limit);

    data.currentPageItems = currentPageItems;
    data.limit = Number(limit);
    data.page = Number(page);
    data.totalItems = Number(totalItems);
    data.totalPages = totalPages;
    data.nextPage = page < totalPages;
    data.previousPage = page > 1;

    log.success('Sheets metadata fetched successfully');
    return {
      status: 200,
      message: 'Sheets metadata fetched successfully',
      data: {
        currentPageItems: currentPageItems,
        nextPage: page < totalPages,
        previousPage: page > 1,
        totalItems: totalItems,
        totalPages: totalPages,
      },
      isValid: true,
    };
  } catch (err) {
    log.error('An error occurred while fetching sheet metadata from system');
    return {
      status: 500,
      message: 'An error occurred while fetching sheet metadata from system',
      data: [],
      errors: err,
      stack: err.stack,
      isValid: false,
    };
  }
};

const getSheetById = async (sheetId, deletedRecord = false) => {
  try {
    log.info('Controller function to fetch sheet details for requested id process initiated');
    sheetId = convertPrettyStringToId(sheetId);
    let langCode = '';

    const sheetInfo = await getSheetBasicInfoById(sheetId, deletedRecord);
    if (!sheetInfo.isValid) {
      return sheetInfo;
    }

    log.info('Call db query to fetch the default language for the sheet type assigned to the current sheet');
    const typeId = convertPrettyStringToId(data.typeId);
    const langDtl = await getLanguagesByTypeId(typeId, true);
    if (langDtl.rowCount === 0) {
      log.error('No default language found');
      return {
        status: 400,
        message: 'No default language found',
        data: [],
        errors: [],
        stack: 'getSheetById function call',
        isValid: false,
      };
    }
    langCode = langDtl.rows[0].lang_cd;

    const sheetBasicDtl = await sheetDetails(sheetId, deletedRecord);
    if (!sheetBasicDtl.isValid) {
      throw sheetBasicDtl;
    }

    log.info(`Default Language Code: ${langCode}`);
    const sheetSnippetDtl = await getSnippetsById(sheetId, deletedRecord, langCode);
    if (!sheetSnippetDtl.isValid) {
      throw sheetSnippetDtl;
    }

    log.success('Requested Sheet details fetched successfully');
    return {
      status: 200,
      message: 'Sheet details fetched successfully',
      data: data,
      isValid: true,
    };
  } catch (err) {
    log.error('Error while fetching support sheet detail for requested id from system');
    return {
      status: 500,
      message: 'An error occurred while fetching sheet detail for requested id from system',
      data: [],
      errors: err,
      stack: err.stack,
      isValid: false,
    };
  }
};

const getAllSheets = async (typeId = null, tagId = null, page, limit, difficulty = null) => {
  try {
    log.info('Call controller function to fetch all sheets information process initiated');
    if (typeId) {
      typeId = convertPrettyStringToId(typeId);
    }
    if (tagId) {
      tagId = convertPrettyStringToId(tagId);
    }
    if (difficulty) {
      difficulty = difficulty.trim();
      difficulty = difficulty[0].toUpperCase() + difficulty.slice(1);

      if (difficulty !== 'Easy' && difficulty !== 'Medium' && difficulty !== 'Hard') {
        log.error('Incorrect difficulty type provided');
        return {
          status: 400,
          message: 'Incorrect difficulty type provided',
          data: [],
          errors: [],
          stack: 'getAllSheets function call',
          isValid: false,
        };
      }
    }

    const offset = (page - 1) * limit;
    let sheetDtl = null;
    const sheetData = [];

    log.info('Call db queries to fetch sheet details');
    if (tagId) {
      sheetDtl = await getAllSheetInfo(typeId, tagId, limit, offset, difficulty, true);
      if (sheetDtl.rowCount === 0) {
        log.info('No sheet found');
        return {
          status: 204,
          message: 'No sheet found',
          data: [],
          isValid: true,
        };
      }
      sheetDtl = sheetDtl.rows;

      for (const sheet of sheetDtl) {
        sheetData.push({
          id: convertIdToPrettyString(sheet.id),
          typeId: convertIdToPrettyString(sheet.type_id),
          sheetCode: sheet.problem_cd,
          title: sheet.problem_title,
          difficulty: sheet.difficulty,
          tags: [
            {
              id: convertIdToPrettyString(sheet.tag_id),
              tag: sheet.tag_desc,
            },
          ],
        });
      }

      const sheetMetadata = await getSheetMetadata(typeId, tagId, difficulty, page, limit);
      if (!sheetMetadata.isValid) {
        return sheetMetadata;
      }
      data.data = sheetData;
    } else {
      sheetDtl = await getAllSheetInfo(typeId, tagId, limit, offset, difficulty, true);
      if (sheetDtl.rowCount === 0) {
        log.info('No sheet found');
        return {
          status: 204,
          message: 'No sheet found',
          data: [],
          isValid: true,
        };
      }
      sheetDtl = sheetDtl.rows;

      for (const sheet of sheetDtl) {
        const tags = [];
        let tagsInfo = await getSheetTagsById(sheet.id, false);
        if (tagsInfo.rowCount > 0) {
          tagsInfo = tagsInfo.rows;
          for (const tag of tagsInfo) {
            tags.push({
              id: convertIdToPrettyString(tag.tag_id),
              tag: tag.tag_desc,
            });
          }
        }

        sheetData.push({
          id: convertIdToPrettyString(sheet.id),
          typeId: convertIdToPrettyString(sheet.type_id),
          sheetCode: sheet.problem_cd,
          title: sheet.problem_title,
          difficulty: sheet.difficulty,
          tags: tags,
        });
      }

      const sheetMetadata = await getSheetMetadata(typeId, tagId, difficulty, page, limit);
      if (!sheetMetadata.isValid) {
        return sheetMetadata;
      }
      data.data = sheetData;
    }

    log.success('Sheets information retrieved successfully');
    return {
      status: 200,
      message: 'Sheets fetched successfully',
      data: data,
      isValid: true,
    };
  } catch (err) {
    log.error('Error while fetching support sheet details from system');
    return {
      status: 500,
      message: 'An error occurred while fetching sheet details from system',
      data: [],
      errors: err,
      stack: err.stack,
      isValid: false,
    };
  }
};

const getSheetDetailsById = async (sheetId, deletedRecord = false) => {
  try {
    log.info('Controller function to fetch sheet details for requested id process initiated');
    sheetId = convertPrettyStringToId(sheetId);

    const sheetInfo = await getSheetBasicInfoById(sheetId, deletedRecord);
    if (!sheetInfo.isValid) {
      return sheetInfo;
    }

    const privateRecords = true;
    const sheetBasicDtl = await sheetDetails(sheetId, deletedRecord, privateRecords);
    if (!sheetBasicDtl.isValid) {
      throw sheetBasicDtl;
    }

    const sheetSnippetDtl = await getSnippetsById(sheetId, deletedRecord);
    if (!sheetSnippetDtl.isValid) {
      throw sheetSnippetDtl;
    }

    const sheetSolutionsDtl = await getSolutionsBySheetId(sheetId);
    if (!sheetSolutionsDtl.isValid) {
      throw sheetSolutionsDtl;
    }

    log.info('Call db query to fetch the performance log for the reference solutions submitted');
    data.performanceDtl = [];
    let performanceDtl = await getPerformanceDtlBySheetId(sheetId, false);
    if (performanceDtl.rowCount > 0) {
      performanceDtl = performanceDtl.rows;
      for (const log of performanceDtl) {
        let name = log.first_name;
        name = log.last_name ? `${name} ${log.last_name}` : name;

        data.performanceDtl.push({
          languageId: convertIdToPrettyString(log.language_id),
          code: log.source_code,
          status: log.status,
          compileOutput: log.compile_output,
          runtimeMsg: log.runtime_msg,
          memoryMsg: log.memory_msg,
          errorMsg: log.error_msg,
          maxMemory: formatMemory(log.max_memory),
          maxTime: formatTime(log.max_time),
          avgMemory: formatMemory(log.avg_memory),
          avgTime: formatTime(log.avg_time),
          runBy: name,
          createdDate: convertToNativeTimeZone(log.created_date),
        });
      }
    }

    log.success('Requested Sheet details fetched successfully');
    return {
      status: 200,
      message: 'Sheet details fetched successfully',
      data: data,
      isValid: true,
    };
  } catch (err) {
    log.error('Error while fetching sheet detail for requested id from system');
    return {
      status: 500,
      message: 'An error occurred while fetching sheet detail for requested id from system',
      data: [],
      errors: err,
      stack: err.stack,
      isValid: false,
    };
  }
};

const getSheetSnippetById = async (sheetId, langId) => {
  try {
    log.info('Controller function to fetch the requested snippet detail for the provided language id process initiated');
    sheetId = convertPrettyStringToId(sheetId);
    langId = convertPrettyStringToId(langId);
    let langDtl = await getLangInfoById(langId, false);
    if (langDtl.rowCount === 0) {
      log.error('No language info found');
      return {
        status: 400,
        message: 'Language not found',
        data: [],
        errors: [],
        stack: 'getSheetSnippetById function call',
        isValid: false,
      };
    }
    langDtl = langDtl.rows[0];
    const langCode = langDtl.lang_cd;

    const snippetDtl = await getSnippetsById(sheetId, false, langCode);
    if (!snippetDtl.isValid || data.codeSnippets.length === 0) {
      return {
        status: 404,
        message: '',
        data: [],
        errors: [],
        stack: 'getSheetSnippetById function call',
        isValid: false,
      };
    }

    log.success('Sheet Snippet fetched successfully');
    return {
      status: 200,
      message: 'Snippet record found',
      data: data.codeSnippets[0],
      isValid: true,
    };
  } catch (err) {
    log.error('Error while fetching sheet snippet detail for requested language id from system');
    return {
      status: 500,
      message: 'An error occurred while fetching sheet snippet detail for requested lang id from system',
      data: [],
      errors: err,
      stack: err.stack,
      isValid: false,
    };
  }
};

export { getSheetById, getAllSheets, getSheetDetailsById, getSheetSnippetById, getSheetBasicInfoById, getSolutionsBySheetId };
