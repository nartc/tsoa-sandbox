import {Response, Router} from 'express';
import {readFileSync} from 'fs';

export class APIDocsRouter {
  
  private router: Router = Router();

  public getRouter(): Router {
    const swaggerSpec = JSON.parse(readFileSync('build/swagger.json', 'utf8'));

    this.router.get('/api/docs/swagger.json', (_: {}, response: Response) => {
      response.setHeader('Content-Type', 'application/json');
      response.send(swaggerSpec);
    });

    return this.router;
  }
}
