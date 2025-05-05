'use strict';

import { logger, buildApiResponse } from 'common-node-lib';
import controllers from '../../controllers/index.js';

const log = logger('Route: get-problem-type');
const problemTypeController = controllers.problemTypeController;

// API Function
const getProblemType = async (req, res, next) => {
  try {
    log.info('Get problem types request process initiated');
    const typeId = req.params.typeId;

    let problemDtl = {};
    if (typeId) {
      log.info('Call controller function to fetch the problem type for provided id');
      problemDtl = await problemTypeController.getTypeById(typeId);
    } else {
      log.info('Call controller function to fetch all the problem types from system');
      problemDtl = await problemTypeController.getAllProblemTypes();
    }

    if (!problemDtl.isValid) {
      throw problemDtl;
    }

    log.success('Problem types fetched successfully');
    res.status(200).json(buildApiResponse(problemDtl));
  } catch (err) {
    if (err.statusCode === '500') {
      log.error(`Error occurred while processing the request in router. Error: ${JSON.stringify(err)}`);
    } else {
      log.error(`Failed to complete the request. Error: ${JSON.stringify(err)}`);
    }
    next(err);
  }
};

export default getProblemType;
