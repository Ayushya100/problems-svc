'use strict';

import { verifyTagExist, registerNewTag } from './registerTag.controller.js';
import { getTagById, getAllTagInfo } from './getTag.controller.js';
import { updateTagById } from './updateTag.controller.js';
import { deleteTagById } from './deleteTag.controller.js';

export default {
  verifyTagExist,
  registerNewTag,
  getTagById,
  getAllTagInfo,
  updateTagById,
  deleteTagById,
};
