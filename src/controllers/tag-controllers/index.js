'use strict';

import { verifyTagExist, registerNewTag } from './registerTag.controller.js';
import { getTagById, getAllTagInfo } from './getTag.controller.js';

export default {
  verifyTagExist,
  registerNewTag,
  getTagById,
  getAllTagInfo,
};
