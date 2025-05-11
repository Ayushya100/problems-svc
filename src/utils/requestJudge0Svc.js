'use strict';

import { logger } from 'common-node-lib';
import axios from 'axios';

const log = logger('util: request-external-svc');

const externalSvcConfig = {};
const initializeSvc = (port, protocol) => {
  log.info('External service configuration initiated');
  const host = process.env.NODE_ENV === 'dev' ? `${protocol}://${process.env.JUDGE0_HOST}:${port}` : ``;
  externalSvcConfig.host = host;
  log.info('External service configuration completed');
};

const sendRequest = async (path, method, payload, params = null) => {
  try {
    log.info('External service request operation initiated');

    const baseUrl = `${externalSvcConfig.host}/${path}`;
    const options = {
      method: method,
      url: baseUrl,
      baseURL: baseUrl,
      data: payload,
      timeout: 50000,
      responseType: 'json',
    };

    if (params) {
      options['params'] = params;
    }

    let response;
    await axios(options)
      .then((res) => {
        log.info('Success - External service request operation completed');
        response = {
          status: res.status,
          message: res.statusText,
          data: res.data,
          isValid: true,
        };
      })
      .catch((err) => {
        log.error('Error while handling the external service request');
        response = {
          status: err.response.status,
          message: err.response.data.error,
          errors: err,
          stack: err.stack,
          isValid: false,
        };
      });
    return response;
  } catch (err) {
    log.error('External service request operation failed');
    return {
      status: 500,
      message: 'Some error occurred while handling external service request',
      errors: err,
      stack: err.stack,
      isValid: false,
    };
  }
};

const batchSubmission = async (protocol, payload) => {
  const url = 'submissions/batch?base64_encoded=false';
  const method = 'POST';
  const judge0Port = process.env.JUDGE0_PORT;
  payload = {
    submissions: payload,
  };

  initializeSvc(judge0Port, protocol);
  const response = await sendRequest(url, method, payload);
  return response;
};

const batchResult = async (protocol, params) => {
  const url = 'submissions/batch';
  const method = 'GET';

  const response = await sendRequest(url, method, null, params);
  return response;
};

export { batchSubmission, batchResult };
