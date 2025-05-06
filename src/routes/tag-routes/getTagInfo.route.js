'use strict';

import { logger, buildApiResponse } from 'common-node-lib';
import controllers from '../../controllers/index.js';

const log = logger('Route: get-problem-type');
const tagController = controllers.tagController;

// API Function
const getTagInfo = async (req, res, next) => {
  try {
    log.info('Get tag info request process initiated');
    const tagId = req.params.tagId;
    let tagDtl = {};

    if (tagId) {
      log.info('Call controller function to fetch the record for requested id');
      tagDtl = await tagController.getTagById(tagId);
    } else {
      log.info('Call controller function to fetch all the tags available in system');
      tagDtl = await tagController.getAllTagInfo();
    }
    if (!tagDtl.isValid) {
      throw tagDtl;
    }

    log.success('Tags information fetch operation completed successfully');
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

export default getTagInfo;
