'use strict';

import { logger, buildApiResponse } from 'common-node-lib';
import controllers from '../../controllers/index.js';

const log = logger('Route: delete-problem-type');
const tagController = controllers.tagController;

// API Function
const deleteTag = async (req, res, next) => {
  try {
    log.info('Tag for requested id delete operation initiated');
    const tagId = req.params.tagId;
    const userId = req.user.id;

    log.info('Call controller function to validate if tag for requested id exists');
    const tagDtl = await tagController.getTagById(tagId);
    if (!tagDtl.isValid) {
      throw tagDtl;
    }

    log.info('Call controller function to delete tag for requested id');
    const deletedTagDtl = await tagController.deleteTagById(tagId, userId, tagDtl.data);
    if (!deletedTagDtl.isValid) {
      throw deletedTagDtl;
    }

    log.success('Tag has been deleted successfully');
    res.status(200).json(buildApiResponse(tagDtl));
  } catch (err) {
    if (err.statusCode === '500') {
      log.error(`Error occurred while processing the request in router. Error: ${JSON.stringify(err)}`);
    } else {
      log.error(`Failed to complete the request. Error: ${JSON.stringify(err)}`);
    }
    next(err);
  }
};

export default deleteTag;
