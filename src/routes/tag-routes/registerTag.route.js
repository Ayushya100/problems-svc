'use strict';

import { logger, buildApiResponse } from 'common-node-lib';
import controllers from '../../controllers/index.js';

const log = logger('Router: register-tags');
const tagController = controllers.tagController;

// API Function
const registerTags = async (req, res, next) => {
  try {
    log.info('Register tags request process initiated');
    const payload = req.body;
    payload.tagCode = payload.tagCode.toUpperCase().trim();

    log.info('Call controller function to validate if tag already exists');
    const tagExist = await tagController.verifyTagExist(payload.tagCode);
    if (!tagExist.isValid) {
      throw tagExist;
    }

    log.info('Call controller function to register new tag');
    const tagDtl = await tagController.registerNewTag(payload);
    if (!tagDtl.isValid) {
      throw tagDtl;
    }

    log.success('Tag has been registered successfully');
    res.status(201).json(buildApiResponse(tagDtl));
  } catch (err) {
    if (err.statusCode === '500') {
      log.error(`Error occurred while processing the request in router. Error: ${JSON.stringify(err)}`);
    } else {
      log.error(`Failed to complete the request. Error: ${JSON.stringify(err)}`);
    }
    next(err);
  }
};

export default registerTags;
