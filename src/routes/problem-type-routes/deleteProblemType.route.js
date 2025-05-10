'use strict';

import { logger, buildApiResponse } from 'common-node-lib';
import controllers from '../../controllers/index.js';

const log = logger('Route: delete-problem-type');
const problemTypeController = controllers.problemTypeController;

// API Function
const deleteProblemType = async (req, res, next) => {
  try {
    log.info('Problem type for requested id delete operation initiated');
    const typeId = req.params.typeId;
    const userId = req.user.id;

    log.info('Call controller function to validate if problem type for requested id exists');
    const typeDtl = await problemTypeController.getTypeById(typeId);
    if (!typeDtl.isValid) {
      throw typeDtl;
    }

    log.info('Call controller funciton to delete the requested problem type');
    const deletedTypeDtl = await problemTypeController.deleteProblemTypeById(typeId, userId, typeDtl.data);
    if (!deletedTypeDtl.isValid) {
      throw deletedTypeDtl;
    }

    log.success('Problem type has been deleted successfully');
    res.status(200).json(buildApiResponse(deletedTypeDtl));
  } catch (err) {
    if (err.statusCode === '500') {
      log.error(`Error occurred while processing the request in router. Error: ${JSON.stringify(err)}`);
    } else {
      log.error(`Failed to complete the request. Error: ${JSON.stringify(err)}`);
    }
    next(err);
  }
};

export default deleteProblemType;
