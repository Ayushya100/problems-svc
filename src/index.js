'use strict';

import { Service } from 'common-node-lib';
import dotenv from 'dotenv';
import { serviceConfig, PROBLEMS_API } from './constants.js';
import routes from './routes/index.js';

dotenv.config({
  path: './env',
});

class ProblemService extends Service {
  registerPublicEndpoints() {
    this.app.get(`${PROBLEMS_API}/health`, routes.healthCheck);
  }

  registerServiceEndpoints() {
    this.app.post(`${PROBLEMS_API}/problem-type`, routes.problemType.registerProblemType);
  }
}

serviceConfig.HOST = process.env.HOST || serviceConfig.HOST;
serviceConfig.PORT = process.env.PORT || serviceConfig.PORT;
serviceConfig.PROTOCOL = process.env.PROTOCOL || serviceConfig.PROTOCOL;

const service = new ProblemService(serviceConfig, true);
service.getUserContext();
service.buildConnection();
service.testConnection();
