'use strict';

import { verifySheetExist, verifyTagsForSheet, validateSolutions, registerNewSheet } from './registerSheet.controller.js';
import { getSheetById, getAllSheets, getSheetDetailsById, getSheetSnippetById, getSheetBasicInfoById, getSolutionsBySheetId } from './getSheetInfo.controller.js';

export default {
  verifySheetExist,
  verifyTagsForSheet,
  validateSolutions,
  registerNewSheet,
  getSheetById,
  getAllSheets,
  getSheetDetailsById,
  getSheetSnippetById,
  getSheetBasicInfoById,
  getSolutionsBySheetId,
};
