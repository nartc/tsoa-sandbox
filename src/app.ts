import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as express from 'express';
import * as mongoose from 'mongoose';
import * as logger from 'morgan';
import * as passport from 'passport';
import * as path from 'path';
import * as config from 'config';

import {logger as winston, setupLogging} from './middleware/common/logger';
import {MongoError} from 'mongodb';
import {Mongoose} from 'mongoose';
import {Application, Request, Response} from 'express';

import './controllers/UserController';
import './controllers/TaskController';

// Import Routes
import {RegisterRoutes} from './routes';
import {authenticateUser} from './middleware/security/passport';
import {APIDocsRouter} from './middleware/swagger/Swagger';

class App {
    public app: Application;
    private apiDocsRoutes: APIDocsRouter = new APIDocsRouter();
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
            .connect(process.env.MONGO_URI || config.get('mongo.mongo_uri'))
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
        authenticateUser(passport);

        // Static
        this.app.use(express.static(path.join(__dirname, '../public')));

        // Call Routes
        RegisterRoutes(this.app);
    }

    routes(): void {
        // Testing Index
        this.app.get('/', (req: Request, res: Response) => {
            res.send('Index worked');
        });

        if (this.environmentHost === 'Development') {
            this.app.use('/', this.apiDocsRoutes.getRouter());
            this.app.use('/api/docs', express.static(path.join(__dirname, '../src/documentation/swagger-ui')));
        }

        // Catch ALL
        this.app.all('/*', (req: Request, res: Response) => {
            res.sendFile(__dirname, '../public/index.html');
        });
    }

    private onMongoConnection() {
        winston.info(
            `-------------
       Connected to Database
      `
        );
    }

    private onMongoError(error: MongoError) {
        winston.error(
            `-------------
       Error on connection to database: ${error}
      `
        );
    }
}

export default new App().app;
