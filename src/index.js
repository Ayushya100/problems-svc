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
    // Sheet Types Routes
    this.app.post(`${PROBLEMS_API}/sheet/type`, verifyScope('SHEETTYPE.U'), routes.sheetType.registerSheetType);
    this.app.get(`${PROBLEMS_API}/sheet/type`, verifyScope('SHEETTYPE.V'), routes.sheetType.getSheetType);
    this.app.get(`${PROBLEMS_API}/sheet/type/:typeId`, verifyScope('SHEETTYPE.V'), routes.sheetType.getSheetType);
    this.app.put(`${PROBLEMS_API}/sheet/type/:typeId`, verifyScope('SHEETTYPE.U'), routes.sheetType.updateSheetType);
    this.app.delete(`${PROBLEMS_API}/sheet/type/:typeId`, verifyScope('SHEETTYPE.D'), routes.sheetType.deleteSheetType);

    // Tags Routes
    this.app.post(`${PROBLEMS_API}/tag`, verifyScope('SHEETTAG.U'), routes.tags.registerTags);
    this.app.get(`${PROBLEMS_API}/tag`, verifyScope('SHEETTAG.V'), routes.tags.getTagInfo);
    this.app.get(`${PROBLEMS_API}/tag/:tagId`, verifyScope('SHEETTAG.V'), routes.tags.getTagInfo);
    this.app.put(`${PROBLEMS_API}/tag/:tagId`, verifyScope('SHEETTAG.U'), routes.tags.updateTags);
    this.app.delete(`${PROBLEMS_API}/tag/:tagId`, verifyScope('SHEETTAG.D'), routes.tags.deleteTag);

    // Support Language Routes
    this.app.post(`${PROBLEMS_API}/language`, verifyScope('SHEETLANG.U'), routes.language.registerSupportLanguage);
    this.app.get(`${PROBLEMS_API}/language`, verifyScope('SHEETLANG.V'), routes.language.getLanguageInfo);
    this.app.get(`${PROBLEMS_API}/language/:langId`, verifyScope('SHEETLANG.V'), routes.language.getLanguageInfo);
    this.app.get(`${PROBLEMS_API}/language/type/:typeId`, verifyScope('SHEETLANG.V'), routes.language.getLanguageInfo);
    this.app.put(`${PROBLEMS_API}/language/:langId`, verifyScope('SHEETLANG.U'), routes.language.updateLanguageInfo);
    this.app.delete(`${PROBLEMS_API}/language/:langId`, verifyScope('SHEETLANG.D'), routes.language.deleteLanguage);

    // Sheet Routes
    this.app.post(`${PROBLEMS_API}/sheet`, verifyScope('SHEET.U'), routes.sheet.registerSheet);
    this.app.get(`${PROBLEMS_API}/sheet`, verifyScope('SHEET.R'), routes.sheet.getSheet);
    this.app.get(`${PROBLEMS_API}/sheet/:sheetId`, verifyScope('SHEET.R'), routes.sheet.getSheet);
    this.app.get(`${PROBLEMS_API}/sheet/:sheetId/snippet/:langId`, verifyScope('SHEET.R'), routes.sheet.getSheet);
    this.app.get(`${PROBLEMS_API}/sheet/:sheetId/solution`, verifyScope('SHEET.R'), routes.sheet.getSheetSolutions);
    this.app.get(`${PROBLEMS_API}/sheet/:sheetId/detail`, verifyScope('SHEET.V'), routes.sheet.getSheetDetails);
    this.app.put(`${PROBLEMS_API}/sheet/:sheetId`, verifyScope('SHEET.U'), routes.sheet.updateSheetInfo);
    this.app.delete(`${PROBLEMS_API}/sheet/:sheetId`, verifyScope('SHEET.D'), routes.sheet.deleteSheetInfo);
  }
}

serviceConfig.HOST = process.env.HOST || serviceConfig.HOST;
serviceConfig.PORT = process.env.PORT || serviceConfig.PORT;
serviceConfig.PROTOCOL = process.env.PROTOCOL || serviceConfig.PROTOCOL;

const service = new ProblemService(serviceConfig, true);
service.getUserContext();
service.buildConnection();
service.testConnection();
