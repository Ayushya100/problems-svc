'use strict';

import { logger, buildApiResponse } from 'common-node-lib';
import controllers from '../../controllers/index.js';

const log = logger('Router: register-problem-type');
const problemTypeController = controllers.problemTypeController;
const problemController = controllers.problemController;

// API Function
const registerProblem = async (req, res, next) => {
  try {
    log.info('Register problem request process initiated');
    const payload = req.body;
    const userId = req.user.id;
    const protocol = req.protocol;
    const scopes = req.user.scopes;
    const userApproveStatus = scopes.includes('APPRPROBLEM.U');

    log.info('Call controller function to validate if problem type for the provided id valid');
    const problemTypeDtl = await problemTypeController.getTypeById(payload.typeId);
    if (!problemTypeDtl.isValid) {
      throw problemTypeDtl;
    }

    log.info('Call controller function to validate if problem with same title already exists');
    const problemExist = await problemController.verifyProblemExist(payload.title);
    if (!problemExist.isValid) {
      throw problemExist;
    }

    log.info('Call controller function to validate if provided tags are valid');
    const tagExist = await problemController.verifyTagsForProblem(payload.tags);
    if (!tagExist.isValid) {
      throw tagExist;
    }

    log.info('Call controller function to validate reference solutions and test cases for the requested problem');
    const solutionValid = await problemController.validateSolutions(protocol, payload);
    if (!solutionValid.isValid) {
      throw solutionValid;
    }

    log.info('Call controller function to store problem details in db');
    const problemDtl = await problemController.registerNewProblem(userId, userApproveStatus, payload);
    if (!problemDtl.isValid) {
      throw problemDtl;
    }

    log.success('Problem registered successfully');
    res.status(201).json(buildApiResponse(problemDtl));
  } catch (err) {
    if (err.statusCode === '500') {
      log.error(`Error occurred while processing the request in router. Error: ${JSON.stringify(err)}`);
    } else {
      log.error(`Failed to complete the request. Error: ${JSON.stringify(err)}`);
    }
    next(err);
  }
};

export default registerProblem;
