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

const updateSheetRecords = async (updatePayloads) => {
  console.log(updatePayloads);
  const storeMultipleTagsRecord = updatePayloads.insertTagPayload.map(() => '(?, ?)').join(', ');
  const deleteMultipleTagsRecord = updatePayloads.deleteTagPayload.map(() => '?').join(', ');
  const storeMultipleExamplesRecords = updatePayloads.insertExamplePayload.map(() => '(?, ?, ?, ?)').join(', ');
  const updateMultipleExamplesRecords = updatePayloads.updateExamplePayload.map(() => '(?, ?, ?, ?, ?, ?)').join(', ');
  const deleteMultipleExamplesRecords = updatePayloads.deleteExamplePayload.map(() => '?').join(', ');
  const storeMultipleHintsRecords = updatePayloads.insertHintPayload.map(() => '(?, ?, ?)').join(', ');
  const updateMultipleHintsRecords = updatePayloads.updateHintPayload.map(() => '(?, ?, ?, ?, ?)').join(', ');
  const deleteMultipleHintsRecords = updatePayloads.deleteHintPayload.map(() => '?').join(', ');
  const storeMultipleTestCasesRecords = updatePayloads.insertTestCasePayload.map(() => '(?, ?, ?, ?)').join(', ');
  const updateMultipleTestCasesRecords = updatePayloads.updateTestCasePayload.map(() => '(?, ?, ?, ?, ?::boolean, ?)').join(', ');
  const deleteMultipleTestCasesRecords = updatePayloads.deleteTestCasePayload.map(() => '?').join(', ');
  const storeMultipleSnippetsRecords = updatePayloads.insertCodeSnippetsPayload.map(() => '(?, ?, ?)').join(', ');
  const updateMultipleSnippetsRecords = updatePayloads.updateCodeSnippetsPayload.map(() => '(?, ?, ?, ?, ?)').join(', ');
  const deleteMultipleSnippetsRecords = updatePayloads.deleteCodeSnippetsPayload.map(() => '?').join(', ');
  const storeMultipleSolutionRecords = updatePayloads.insertReferenceSolutionsPayload.map(() => '(?, ?, ?)').join(', ');
  const updateMultipleSolutionRecords = updatePayloads.updateReferenceSolutionsPayload.map(() => '(?, ?, ?, ?, ?)').join(', ');
  const deleteMultipleSolutionRecords = updatePayloads.deleteReferenceSolutionsPayload.map(() => '?').join(', ');
  const storeMultiplePerformanceRecord = updatePayloads.performanceLog.map(() => '(?, ?, ?, ?, ?, ?, ?, ?, ?)').join(', ');

  await trxRunner(async (execute) => {
    const updateSheetQuery = `UPDATE PROBLEMS SET TYPE_ID = ?, PROBLEM_TITLE = ?, PROBLEM_DESC = ?, DIFFICULTY = ?, CONSTRAINTS = ?, MODIFIED_BY = ?
      WHERE ID = ? AND IS_DELETED = false;`;
    const updateSheetParams = [
      updatePayloads.typeId,
      updatePayloads.title,
      updatePayloads.description,
      updatePayloads.difficulty,
      updatePayloads.constraints,
      updatePayloads.userId,
      updatePayloads.id,
    ];
    await execute(updateSheetQuery, updateSheetParams);

    if (updatePayloads.insertTagPayload.length > 0) {
      const insertTagsQuery = `INSERT INTO PROBLEM_TAGS (PROBLEM_ID, TAG_ID)
        VALUES ${storeMultipleTagsRecord};`;
      const insertTagsParams = updatePayloads.insertTagPayload.map((tag) => [updatePayloads.id, tag]).flat();
      await execute(insertTagsQuery, insertTagsParams);
    }

    if (updatePayloads.deleteTagPayload.length > 0) {
      const deleteTagsQuery = `UPDATE PROBLEM_TAGS SET IS_DELETED = true, MODIFIED_BY = ?
        WHERE PROBLEM_ID = ? AND TAG_ID IN (${deleteMultipleTagsRecord});`;
      const deleteTagsParams = [updatePayloads.userId, updatePayloads.id, ...updatePayloads.deleteTagPayload];
      await execute(deleteTagsQuery, deleteTagsParams);
    }

    if (updatePayloads.insertExamplePayload.length > 0) {
      const insertExamplesQuery = `INSERT INTO PROBLEM_EXAMPLES (PROBLEM_ID, INPUT, OUTPUT, EXPLANATION)
        VALUES ${storeMultipleExamplesRecords};`;
      const insertExamplesParams = updatePayloads.insertExamplePayload.map((example) => [updatePayloads.id, example.input, example.output, example.explanation]).flat();
      await execute(insertExamplesQuery, insertExamplesParams);
    }

    if (updatePayloads.updateExamplePayload.length > 0) {
      const updateExamplesQuery = `UPDATE PROBLEM_EXAMPLES AS P
        SET
          INPUT = V.INPUT,
          OUTPUT = V.OUTPUT,
          EXPLANATION = V.EXPLANATION,
          MODIFIED_BY = V.USER_ID
        FROM (
          VALUES ${updateMultipleExamplesRecords}
        ) AS V(ID, PROBLEM_ID, INPUT, OUTPUT, EXPLANATION, USER_ID)
        WHERE P.ID = V.ID AND P.PROBLEM_ID = V.PROBLEM_ID;`;
      const updateExamplesParams = updatePayloads.updateExamplePayload
        .map((example) => [example.id, updatePayloads.id, example.input, example.output, example.explanation || null, updatePayloads.userId])
        .flat();
      await execute(updateExamplesQuery, updateExamplesParams);
    }

    if (updatePayloads.deleteExamplePayload.length > 0) {
      const deleteExamplesQuery = `UPDATE PROBLEM_EXAMPLES SET IS_DELETED = true, MODIFIED_BY = ?
        WHERE PROBLEM_ID = ? AND ID IN (${deleteMultipleExamplesRecords});`;
      const deleteExamplesParams = [updatePayloads.userId, updatePayloads.id, ...updatePayloads.deleteExamplePayload.map((example) => example.id).flat()];
      await execute(deleteExamplesQuery, deleteExamplesParams);
    }

    if (updatePayloads.insertHintPayload.length > 0) {
      const insertHintsQuery = `INSERT INTO PROBLEM_HINTS (PROBLEM_ID, HINT_NO, HINT)
        VALUES ${storeMultipleHintsRecords};`;
      const insertHintsParams = updatePayloads.insertHintPayload.map((hint) => [updatePayloads.id, hint.orderNo, hint.hint]).flat();
      await execute(insertHintsQuery, insertHintsParams);
    }

    if (updatePayloads.updateHintPayload.length > 0) {
      const updateHintsQuery = `UPDATE PROBLEM_HINTS AS P
        SET
          HINT_NO = V.HINT_NO,
          HINT = V.HINT,
          MODIFIED_BY = V.USER_ID
        FROM (
          VALUES ${updateMultipleHintsRecords}
        ) AS V(ID, PROBLEM_ID, HINT_NO, HINT, USER_ID)
        WHERE P.ID = V.ID AND P.PROBLEM_ID = V.PROBLEM_ID;`;
      const updateHintsParams = updatePayloads.updateHintPayload.map((hint) => [hint.id, updatePayloads.id, hint.orderNo, hint.hint, updatePayloads.userId]).flat();
      await execute(updateHintsQuery, updateHintsParams);
    }

    if (updatePayloads.deleteHintPayload.length > 0) {
      const deleteHintsQuery = `UPDATE PROBLEM_HINTS SET IS_DELETED = true, MODIFIED_BY = ?
        WHERE PROBLEM_ID = ? AND ID IN (${deleteMultipleHintsRecords});`;
      const deleteHintsParams = [updatePayloads.userId, updatePayloads.id, ...updatePayloads.deleteHintPayload.map((hint) => hint.id).flat()];
      await execute(deleteHintsQuery, deleteHintsParams);
    }

    if (updatePayloads.insertTestCasePayload.length > 0) {
      const insertTestCasesQuery = `INSERT INTO PROBLEM_TEST_CASES (PROBLEM_ID, INPUT, OUTPUT, IS_PUBLIC)
        VALUES ${storeMultipleTestCasesRecords};`;
      const insertTestCasesParams = updatePayloads.insertTestCasePayload.map((testCase) => [updatePayloads.id, testCase.input, testCase.output, testCase.isPublic]).flat();
      await execute(insertTestCasesQuery, insertTestCasesParams);
    }

    if (updatePayloads.updateTestCasePayload.length > 0) {
      const updateTestCasesQuery = `UPDATE PROBLEM_TEST_CASES AS P
        SET
          INPUT = V.INPUT,
          OUTPUT = V.OUTPUT,
          IS_PUBLIC = V.IS_PUBLIC,
          MODIFIED_BY = V.USER_ID
        FROM (
          VALUES ${updateMultipleTestCasesRecords}
        ) AS V(ID, PROBLEM_ID, INPUT, OUTPUT, IS_PUBLIC, USER_ID)
        WHERE P.ID = V.ID AND P.PROBLEM_ID = V.PROBLEM_ID;`;
      const updateTestCasesParams = updatePayloads.updateTestCasePayload
        .map((testCase) => [testCase.id, updatePayloads.id, testCase.input, testCase.output, testCase.isPublic, updatePayloads.userId])
        .flat();
      await execute(updateTestCasesQuery, updateTestCasesParams);
    }

    if (updatePayloads.deleteTestCasePayload.length > 0) {
      const deleteTestCasesQuery = `UPDATE PROBLEM_TEST_CASES SET IS_DELETED = true, MODIFIED_BY = ?
        WHERE PROBLEM_ID = ? AND ID IN (${deleteMultipleTestCasesRecords})`;
      const deleteTestCasesParams = [updatePayloads.userId, updatePayloads.id, ...updatePayloads.deleteTestCasePayload.map((testCase) => testCase.id).flat()];
      await execute(deleteTestCasesQuery, deleteTestCasesParams);
    }

    if (updatePayloads.insertCodeSnippetsPayload.length > 0) {
      const insertSnippetQuery = `INSERT INTO PROBLEM_SNIPPET (PROBLEM_ID, LANGUAGE_ID, SNIPPET)
        VALUES ${storeMultipleSnippetsRecords};`;
      const insertSnippetParams = updatePayloads.insertCodeSnippetsPayload.map((snippet) => [updatePayloads.id, snippet.languageId, snippet.snippet]).flat();
      await execute(insertSnippetQuery, insertSnippetParams);
    }

    if (updatePayloads.updateCodeSnippetsPayload.length > 0) {
      const updateSnippetQuery = `UPDATE PROBLEM_SNIPPET AS P
        SET
          LANGUAGE_ID = V.LANGUAGE_ID,
          SNIPPET = V.SNIPPET,
          MODIFIED_BY = V.USER_ID
        FROM (
          VALUES ${updateMultipleSnippetsRecords}
        ) AS V(ID, PROBLEM_ID, LANGUAGE_ID, SNIPPET, USER_ID)
        WHERE P.ID = V.ID AND P.PROBLEM_ID = V.PROBLEM_ID;`;
      const updateSnippetParams = updatePayloads.updateCodeSnippetsPayload
        .map((snippet) => [snippet.id, updatePayloads.id, snippet.languageId, snippet.snippet, updatePayloads.userId])
        .flat();
      await execute(updateSnippetQuery, updateSnippetParams);
    }

    if (updatePayloads.deleteCodeSnippetsPayload.length > 0) {
      const deleteSnippetQuery = `UPDATE PROBLEM_SNIPPET SET IS_DELETED = true, MODIFIED_BY = ?
        WHERE PROBLEM_ID = ? AND ID IN (${deleteMultipleSnippetsRecords});`;
      const deleteSnippetParams = [updatePayloads.userId, updatePayloads.id, ...updatePayloads.deleteCodeSnippetsPayload.map((snippet) => snippet.id).flat()];
      await execute(deleteSnippetQuery, deleteSnippetParams);
    }

    if (updatePayloads.insertReferenceSolutionsPayload.length > 0) {
      const insertSolutionQuery = `INSERT INTO PROBLEM_SOLUTION (PROBLEM_ID, LANGUAGE_ID, SOLUTION)
        VALUES ${storeMultipleSolutionRecords};`;
      const insertSolutionParams = updatePayloads.insertReferenceSolutionsPayload.map((solution) => [updatePayloads.id, solution.languageId, solution.solution]).flat();
      await execute(insertSolutionQuery, insertSolutionParams);
    }

    if (updatePayloads.updateReferenceSolutionsPayload.length > 0) {
      const updateSolutionQuery = `UPDATE PROBLEM_SOLUTION AS P
        SET
          LANGUAGE_ID = V.LANGUAGE_ID,
          SOLUTION = V.SOLUTION,
          MODIFIED_BY = V.USER_ID
        FROM (
          VALUES ${updateMultipleSolutionRecords}
        ) AS V(ID, PROBLEM_ID, LANGUAGE_ID, SOLUTION, USER_ID)
        WHERE P.ID = V.ID AND P.PROBLEM_ID = V.PROBLEM_ID;`;
      const updateSolutionParams = updatePayloads.updateReferenceSolutionsPayload
        .map((solution) => [solution.id, updatePayloads.id, solution.languageId, solution.solution, updatePayloads.userId])
        .flat();
      await execute(updateSolutionQuery, updateSolutionParams);
    }

    if (updatePayloads.deleteReferenceSolutionsPayload.length > 0) {
      const deleteSolutionQuery = `UPDATE PROBLEM_SOLUTION SET IS_DELETED = true, MODIFIED_BY = ?
        WHERE PROBLEM_ID = ? AND ID IN (${deleteMultipleSolutionRecords});`;
      const deleteSolutionParams = [updatePayloads.userId, updatePayloads.id, ...updatePayloads.deleteReferenceSolutionsPayload.map((solution) => solution.id)];
      await execute(deleteSolutionQuery, deleteSolutionParams);
    }

    if (updatePayloads.performanceLog.length > 0) {
      const performanceQuery = `INSERT INTO PROBLEM_VALIDATION_RUNS (PROBLEM_ID, LANGUAGE_ID, SOURCE_CODE, STATUS, MAX_MEMORY, MAX_TIME, AVG_MEMORY, AVG_TIME, RUN_BY)
        VALUES ${storeMultiplePerformanceRecord};`;
      const performanceParams = updatePayloads.performanceLog
        .map((log) => [
          updatePayloads.id,
          log.langId,
          log.code,
          log.status,
          log.maxMemoConsumption,
          log.maxTimeConsumption,
          log.avgMemoConsumption,
          log.avgTimeConsumption,
          log.runBy,
        ])
        .flat();
      await execute(performanceQuery, performanceParams);
    }
    return null;
  });
};

export { saveSheetRecords, deleteSheetRecords, updateSheetRecords };
