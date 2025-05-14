'use strict';

import { convertIdToPrettyString, convertPrettyStringToId, convertToNativeTimeZone, logger } from 'common-node-lib';
import { getTypeInfoById, getAllTypeInfo } from '../../db/index.js';

const log = logger('Controller: get-sheet-type');

const getTypeById = async (typeId, deletedRecord = false) => {
  try {
    log.info('Controller function to fetch sheet type by id process initiated');
    typeId = convertPrettyStringToId(typeId);

    log.info(`Call db query to fetch type details for provided id: ${typeId}`);
    let typeDtl = await getTypeInfoById(typeId, deletedRecord);
    if (typeDtl.rowCount === 0) {
      log.error('Sheet type requested with the id does not exists in system');
      return {
        status: 404,
        message: 'Sheet type not found',
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
      executor: typeDtl.executor,
      core: typeDtl.core,
      createdDate: convertToNativeTimeZone(typeDtl.created_date),
      modifiedDate: convertToNativeTimeZone(typeDtl.modified_date),
    };

    log.success('Requested Sheet type details fetched successfully');
    return {
      status: 200,
      message: 'Sheet type fetched successfully',
      data: typeDtl,
      isValid: true,
    };
  } catch (err) {
    log.error('Error while fetching sheet type for requested id from system');
    return {
      status: 500,
      message: 'An error occurred while fetching sheet type for requested id from system',
      data: [],
      errors: err,
      stack: err.stack,
      isValid: false,
    };
  }
};

const getAllSheetTypes = async () => {
  try {
    log.info('Controller function to fetch all the sheet types from system initiated');
    log.info('Call db query to fetch all sheet types from db');
    let typeDtl = await getAllTypeInfo();
    if (typeDtl.rowCount === 0) {
      log.info('No sheet type available to display');
      return {
        status: 204,
        message: 'No sheet type found',
        data: [],
        isValid: true,
      };
    }

    typeDtl = typeDtl.rows;
    const data = typeDtl.map((type) => {
      return {
        id: convertIdToPrettyString(type.id),
        typeCode: type.type_cd,
        typeDesc: type.type_desc,
        executor: type.executor,
      };
    });

    log.success('Sheet types fetch operation completed successfully');
    return {
      status: 200,
      message: 'Sheet type fetched successfully',
      data: data,
      isValid: true,
    };
  } catch (err) {
    log.error('Error while fetching all sheets from system');
    return {
      status: 500,
      message: 'An error occurred while fetching all sheets from system',
      data: [],
      errors: err,
      stack: err.stack,
      isValid: false,
    };
  }
};

export { getTypeById, getAllSheetTypes };
