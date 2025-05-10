'use strict';

import registerSupportLanguage from './registerLanguage.route.js';
import getLanguageInfo from './getLanguageInfo.route.js';
import updateLanguageInfo from './updateLanguage.route.js';
import deleteLanguage from './deleteLanguageInfo.route.js';

export default {
  registerSupportLanguage,
  getLanguageInfo,
  updateLanguageInfo,
  deleteLanguage,
};
