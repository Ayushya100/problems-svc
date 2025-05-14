'use strict';

import { logger, buildApiResponse } from 'common-node-lib';
import controllers from '../../controllers/index.js';

const log = logger('Route: update-tag-info');
const tagController = controllers.tagController;

// API Function
const updateTags = async (req, res, next) => {
  try {
    log.info('Tag information updation for requested id operation initiated');
    const tagId = req.params.tagId;
    const payload = req.body;
    const userId = req.user.id;

    log.info('Call controller function to validate if tag information for requested id exists');
    const tagDtl = await tagController.getTagById(tagId);
    if (!tagDtl.isValid) {
      throw tagDtl;
    }

    log.info('Call controller function to update the tag information');
    const newTagDtl = await tagController.updateTagById(tagId, userId, tagDtl.data, payload);
    if (!newTagDtl.isValid) {
      throw newTagDtl;
    }

    log.success('Tag information updated successfully');
    res.status(200).json(buildApiResponse(newTagDtl));
  } catch (err) {
    if (err.statusCode === '500') {
      log.error(`Error occurred while processing the request in router. Error: ${JSON.stringify(err)}`);
    } else {
      log.error(`Failed to complete the request. Error: ${JSON.stringify(err)}`);
    }
    next(err);
  }
};

export default updateTags;
