'use strict';

import { logger, buildApiResponse } from 'common-node-lib';
import controllers from '../../controllers/index.js';

const log = logger('Router: register-problem-type');
const problemTypeController = controllers.problemTypeController;

// API Function
const registerProblemType = async (req, res, next) => {
  try {
    log.info('Register problem types request process initiated');
    const payload = req.body;
    payload.typeCode = payload.typeCode.toUpperCase().trim();

    log.info('Call controller function to validate if problem type code is valid to create');
    const typeExist = await problemTypeController.verifyProblemTypeExist(payload.typeCode);
    if (!typeExist.isValid) {
      throw typeExist;
    }

    log.info('Call controller function to register new problem type in system');
    const typeDtl = await problemTypeController.registerNewProblemType(payload);
    if (!typeDtl.isValid) {
      throw typeDtl;
    }

    log.success('Problem Type registered successfully');
    res.status(201).json(buildApiResponse(typeDtl));
  } catch (err) {
    if (err.statusCode === '500') {
      log.error(`Error occurred while processing the request in router. Error: ${JSON.stringify(err)}`);
    } else {
      log.error(`Failed to complete the request. Error: ${JSON.stringify(err)}`);
    }
    next(err);
  }
};

export default registerProblemType;
