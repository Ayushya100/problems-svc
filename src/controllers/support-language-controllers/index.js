'use strict';

import { verifyLanguageExist, registerNewLanguageType } from './registerLanguage.controller.js';
import { getLangById, getAllLanguageInfo } from './getLanguage.controller.js';
import { updateLanguageInfoById } from './updateLanguage.controller.js';

export default {
  verifyLanguageExist,
  registerNewLanguageType,
  getLangById,
  getAllLanguageInfo,
  updateLanguageInfoById,
};
