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
    // Problem Types Routes
    this.app.post(`${PROBLEMS_API}/problem-type`, routes.problemType.registerProblemType);
    this.app.get(`${PROBLEMS_API}/problem-type`, routes.problemType.getProblemType);
    this.app.get(`${PROBLEMS_API}/problem-type/:typeId`, routes.problemType.getProblemType);
    this.app.put(`${PROBLEMS_API}/problem-type/:typeId`, routes.problemType.updateProblemType);

    // Tags Routes
    this.app.post(`${PROBLEMS_API}/tag`, routes.tags.registerTags);

    // Problem Routes
    // this.app.post(`${PROBLEMS_API}/problem`, );
    // this.app.get(`${PROBLEMS_API}/problem`, );
    // this.app.get(`${PROBLEMS_API}/problem/:problemId`, );
    // this.app.put(`${PROBLEMS_API}/problem/:problemId`, );
    // this.app.delete(`${PROBLEMS_API}/problem/:problemId`, );
    // this.app.get(`${PROBLEMS_API}/problem/solved`, );
    // this.app.get(`${PROBLEMS_API}/problem/solved/:problemId`, );

    // constraints, codesnipets - JSON, referenceSolutions - JSON
  }
}

serviceConfig.HOST = process.env.HOST || serviceConfig.HOST;
serviceConfig.PORT = process.env.PORT || serviceConfig.PORT;
serviceConfig.PROTOCOL = process.env.PROTOCOL || serviceConfig.PROTOCOL;

const service = new ProblemService(serviceConfig, true);
service.getUserContext();
service.buildConnection();
service.testConnection();
