'use strict';

import healthCheck from './healthCheck.route.js';
import problemType from './problem-type-routes/index.js';
import tags from './tag-routes/index.js';
import language from './support-language-routes/index.js';

export default {
  healthCheck,
  problemType,
  tags,
  language,
};
