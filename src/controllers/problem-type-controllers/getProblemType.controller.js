'use strict';

import { convertIdToPrettyString, convertPrettyStringToId, convertToNativeTimeZone, logger } from 'common-node-lib';
import { getTypeInfoById } from '../../db/index.js';

const log = logger('Controller: get-problem-type');

const getTypeById = async (typeId) => {
  try {
    log.info('Controller function to fetch problem type by id process initiated');
    typeId = convertPrettyStringToId(typeId);

    log.info(`Call db query to fetch type details for provided id: ${typeId}`);
    let typeDtl = await getTypeInfoById(typeId);
    if (typeDtl.rowCount === 0) {
      log.error('Problem type requested with the id does not exists in system');
      return {
        status: 404,
        message: 'Problem type not found',
        data: [],
        errors: [],
        stack: 'getTypeById function call',
        isValid: false,
      };
    }

    typeDtl = typeDtl.rows[0];
    typeDtl = {
      id: convertIdToPrettyString(typeDtl.id),
      typeCode: typeDtl.type_cd,
      typeDesc: typeDtl.type_desc,
      createdDate: convertToNativeTimeZone(typeDtl.created_date),
      modifiedDate: convertToNativeTimeZone(typeDtl.modified_date),
    };

    log.success('Requested problem type details fetched successfully');
    return {
      status: 200,
      message: 'Problem type fetched successfully',
      data: typeDtl,
      isValid: true,
    };
  } catch (err) {
    log.error('Error while fetching problem type for requested id from system');
    return {
      status: 500,
      message: 'An error occurred while fetching problem type for requested id from system',
      data: [],
      errors: err,
      stack: err.stack,
      isValid: false,
    };
  }
};

export { getTypeById };
