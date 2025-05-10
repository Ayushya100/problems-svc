'use strict';

import { verifyProblemTypeExist, registerNewProblemType } from './registerProblemType.controller.js';
import { getTypeById, getAllProblemTypes } from './getProblemType.controller.js';
import { updateProblemTypeById } from './updateProblemType.controller.js';
import { deleteProblemTypeById } from './deleteProblemType.controller.js';

export default {
  verifyProblemTypeExist,
  registerNewProblemType,
  getTypeById,
  getAllProblemTypes,
  updateProblemTypeById,
  deleteProblemTypeById,
};
