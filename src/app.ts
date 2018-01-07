import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as express from 'express';
import * as mongoose from 'mongoose';
import * as logger from 'morgan';
import * as passport from 'passport';
import * as path from 'path';
import * as config from 'config';

import { logger as winston, setupLogging } from './middleware/common/logger';
import { MongoError } from 'mongodb';
import { Mongoose } from 'mongoose';
import { Application, Request, Response } from 'express';

// Import Routes

class App {
  public app: Application;
  private environmentHost: string = process.env.NODE_ENV || 'Development';

  constructor() {
    this.app = express();
    setupLogging(this.app);
    this.configure();
    this.routes();
  }

  configure(): void {
    // Connect to MongoDB
    (mongoose as Mongoose).Promise = global.Promise;

    mongoose
      .connect(config.get('mongo.mongo_uri'))
      .then(this.onMongoConnection)
      .catch(this.onMongoError);

    // CORS MW
    this.app.use(cors());
    this.app.options('*', cors());

    // Morgan MW
    this.app.use(logger('dev'));

    // BodyParser MW
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({
      extended: false,
      limit: '5mb',
      parameterLimit: 5000
    }));

    // Passport MW
    this.app.use(passport.initialize());
    this.app.use(passport.session());

    // Static
    this.app.use(express.static(path.join(__dirname, '../public')));

    // Call Routes
  }

  routes(): void {
    // Testing Index
    this.app.get('/', (req: Request, res: Response) => {
      res.send('Index worked');
    });
  }

  private onMongoConnection() {
    winston.info(
      `------------
       Connected to Database
      `
    );
  }

  private onMongoError(error: MongoError) {
    winston.error(
      `------------
       Error on connection to database: ${error}
      `
    );
  }
}

export default new App().app;
