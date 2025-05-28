'use strict';

import healthCheck from './healthCheck.route.js';
import sheetType from './sheet-type-routes/index.js';
import tags from './tag-routes/index.js';
import language from './support-language-routes/index.js';
import sheet from './sheet-routes/index.js';
import playlist from './playlist-routes/index.js';

export default {
  healthCheck,
  sheetType,
  tags,
  language,
  sheet,
  playlist,
};
