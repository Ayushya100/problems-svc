'use strict';

import { verifyProblemTypeExist, registerNewProblemType } from './registerProblemType.controller.js';
import { getTypeById } from './getProblemType.controller.js';

export default {
  verifyProblemTypeExist,
  registerNewProblemType,
  getTypeById,
};
