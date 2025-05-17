'use strict';

import { trxRunner } from 'common-node-lib';

const saveSheetRecords = async (problemPayload, tagPayload, examplePayload, hintsPayload, testCasesPayload, snippetPayload, solutionPayload, performanceLog) => {
  const storeMultipleTagsRecord = tagPayload.map(() => '(?, ?)').join(', ');
  const storeMultipleExamplesRecord = examplePayload.map(() => '(?, ?, ?, ?)').join(', ');
  const storeMultipleHintsRecord = hintsPayload.map(() => '(?, ?, ?)').join(', ');
  const storeMultipleTestCasesRecord = testCasesPayload.map(() => '(?, ?, ?, ?)').join(', ');
  const storeMultipleSnippetRecord = snippetPayload.map(() => '(?, ?, ?)').join(', ');
  const storeMultipleSolutionRecord = solutionPayload.map(() => '(?, ?, ?)').join(', ');
  const storeMultiplePerformanceRecord = performanceLog.map(() => '(?, ?, ?, ?, ?, ?, ?, ?, ?)').join(', ');

  const result = await trxRunner(async (execute) => {
    const problemQuery = `INSERT INTO PROBLEMS (TYPE_ID, PROBLEM_CD, PROBLEM_TITLE, PROBLEM_DESC, CONSTRAINTS, DIFFICULTY, APPROVED)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            RETURNING ID;`;
    const problemParams = [
      problemPayload.typeId,
      problemPayload.sheetCode,
      problemPayload.sheetTitle,
      problemPayload.sheetDesc,
      problemPayload.constraints,
      problemPayload.difficulty,
      problemPayload.approved,
    ];
    const problemResult = await execute(problemQuery, problemParams);
    const problemId = problemResult.rows[0].id;

    const tagQuery = `INSERT INTO PROBLEM_TAGS (PROBLEM_ID, TAG_ID)
            VALUES ${storeMultipleTagsRecord};`;
    const tagParams = tagPayload.map((tag) => [problemId, tag]).flat();
    await execute(tagQuery, tagParams);

    const exampleQuery = `INSERT INTO PROBLEM_EXAMPLES (PROBLEM_ID, INPUT, OUTPUT, EXPLANATION)
            VALUES ${storeMultipleExamplesRecord};`;
    const exampleParams = examplePayload.map((example) => [problemId, example.input, example.output, example.explanation]).flat();
    await execute(exampleQuery, exampleParams);

    const hintQuery = `INSERT INTO PROBLEM_HINTS (PROBLEM_ID, HINT_NO, HINT)
            VALUES ${storeMultipleHintsRecord};`;
    const hintParmas = hintsPayload.map((hint) => [problemId, hint.hintNo, hint.hint]).flat();
    await execute(hintQuery, hintParmas);

    const testCaseQuery = `INSERT INTO PROBLEM_TEST_CASES (PROBLEM_ID, INPUT, OUTPUT, IS_PUBLIC)
            VALUES ${storeMultipleTestCasesRecord};`;
    const testCaseParams = testCasesPayload.map((tCase) => [problemId, tCase.input, tCase.output, tCase.isPublic]).flat();
    await execute(testCaseQuery, testCaseParams);

    const snippetQuery = `INSERT INTO PROBLEM_SNIPPET (PROBLEM_ID, LANGUAGE_ID, SNIPPET)
            VALUES ${storeMultipleSnippetRecord};`;
    const snippetParams = snippetPayload.map((snippet) => [problemId, snippet.languageId, snippet.snippet]).flat();
    await execute(snippetQuery, snippetParams);

    const solutionQuery = `INSERT INTO PROBLEM_SOLUTION (PROBLEM_ID, LANGUAGE_ID, SOLUTION)
            VALUES ${storeMultipleSolutionRecord};`;
    const solutionParams = solutionPayload.map((solution) => [problemId, solution.languageId, solution.solution]).flat();
    await execute(solutionQuery, solutionParams);

    const performanceQuery = `INSERT INTO PROBLEM_VALIDATION_RUNS (PROBLEM_ID, LANGUAGE_ID, SOURCE_CODE, STATUS, MAX_MEMORY, MAX_TIME, AVG_MEMORY, AVG_TIME, RUN_BY)
        VALUES ${storeMultiplePerformanceRecord};`;
    const performanceParams = performanceLog
      .map((log) => [problemId, log.langId, log.code, log.status, log.maxMemoConsumption, log.maxTimeConsumption, log.avgMemoConsumption, log.avgTimeConsumption, log.runBy])
      .flat();
    await execute(performanceQuery, performanceParams);

    return problemResult;
  });
  return result;
};

const deleteSheetRecords = async (sheetId, userId) => {
  await trxRunner(async (execute) => {
    const problemQuery = `UPDATE PROBLEMS SET IS_DELETED = true, MODIFIED_BY = ? WHERE ID = ? AND IS_DELETED = false;`;
    const problemParams = [userId, sheetId];
    await execute(problemQuery, problemParams);

    const tagQuery = `UPDATE PROBLEM_TAGS SET IS_DELETED = true, MODIFIED_BY = ? WHERE PROBLEM_ID = ? AND IS_DELETED = false;`;
    const tagParams = [userId, sheetId];
    await execute(tagQuery, tagParams);

    const exampleQuery = `UPDATE PROBLEM_EXAMPLES SET IS_DELETED = true, MODIFIED_BY = ? WHERE PROBLEM_ID = ? AND IS_DELETED = false;`;
    const exampleParams = [userId, sheetId];
    await execute(exampleQuery, exampleParams);

    const hintQuery = `UPDATE PROBLEM_HINTS SET IS_DELETED = true, MODIFIED_BY = ? WHERE PROBLEM_ID = ? AND IS_DELETED = false;`;
    const hintParmas = [userId, sheetId];
    await execute(hintQuery, hintParmas);

    const testCaseQuery = `UPDATE PROBLEM_TEST_CASES SET IS_DELETED = true, MODIFIED_BY = ? WHERE PROBLEM_ID = ? AND IS_DELETED = false;`;
    const testCaseParams = [userId, sheetId];
    await execute(testCaseQuery, testCaseParams);

    const snippetQuery = `UPDATE PROBLEM_SNIPPET SET IS_DELETED = true, MODIFIED_BY = ? WHERE PROBLEM_ID = ? AND IS_DELETED = false;`;
    const snippetParams = [userId, sheetId];
    await execute(snippetQuery, snippetParams);

    const solutionQuery = `UPDATE PROBLEM_SOLUTION SET IS_DELETED = true, MODIFIED_BY = ? WHERE PROBLEM_ID = ? AND IS_DELETED = false;`;
    const solutionParams = [userId, sheetId];
    await execute(solutionQuery, solutionParams);

    return null;
  });
};

export { saveSheetRecords, deleteSheetRecords };
