'use strict';

import { Service, verifyScope } from 'common-node-lib';
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
    this.app.post(`${PROBLEMS_API}/problem/type`, verifyScope('PROBTYPE.U'), routes.problemType.registerProblemType);
    this.app.get(`${PROBLEMS_API}/problem/type`, verifyScope('PROBTYPE.V'), routes.problemType.getProblemType);
    this.app.get(`${PROBLEMS_API}/problem/type/:typeId`, verifyScope('PROBTYPE.V'), routes.problemType.getProblemType);
    this.app.put(`${PROBLEMS_API}/problem/type/:typeId`, verifyScope('PROBTYPE.U'), routes.problemType.updateProblemType);
    this.app.delete(`${PROBLEMS_API}/problem/type/:typeId`, verifyScope('PROBTYPE.D'), routes.problemType.deleteProblemType);

    // Tags Routes
    this.app.post(`${PROBLEMS_API}/tag`, verifyScope('PROBTAG.U'), routes.tags.registerTags);
    this.app.get(`${PROBLEMS_API}/tag`, verifyScope('PROBTAG.V'), routes.tags.getTagInfo);
    this.app.get(`${PROBLEMS_API}/tag/:tagId`, verifyScope('PROBTAG.V'), routes.tags.getTagInfo);
    this.app.put(`${PROBLEMS_API}/tag/:tagId`, verifyScope('PROBTAG.U'), routes.tags.updateTags);
    this.app.delete(`${PROBLEMS_API}/tag/:tagId`, verifyScope('PROBTAG.D'), routes.tags.deleteTag);

    // Support Language Routes
    this.app.post(`${PROBLEMS_API}/language`, routes.language.registerSupportLanguage);
    this.app.get(`${PROBLEMS_API}/language`, routes.language.getLanguageInfo);
    this.app.get(`${PROBLEMS_API}/language/:langId`, routes.language.getLanguageInfo);
    this.app.put(`${PROBLEMS_API}/language/:langId`, routes.language.updateLanguageInfo);
    this.app.delete(`${PROBLEMS_API}/language/:langId`, routes.language.deleteLanguage);

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
