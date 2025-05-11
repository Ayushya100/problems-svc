'use strict';

import { verifyProblemExist, verifyTagsForProblem, validateSolutions, registerNewProblem } from './registerProblems.controller.js';
import { getProblemById } from './getProblemInfo.controller.js';

export default {
  verifyProblemExist,
  verifyTagsForProblem,
  validateSolutions,
  registerNewProblem,
  getProblemById,
};
