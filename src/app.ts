import express, { Application, Request, Response, NextFunction } from 'express';
import { Router } from './htpp-middleware/router';
import './db/mongo';

const app: express.Application = express();
const router = new Router(); 

app.use(express.json());

for (const route in router.routes) {
    if (router.routes.hasOwnProperty(route)) {
        const config = router.routes[route];
        const controller = config.controller;
        const method = route.split('/')[0].toLowerCase();

        if (method === 'get') {
            app.get(`/${route.split('/')[1]}`, (req: Request, res: Response, next: NextFunction) => {
                controller(req, res, next);
            });
        } else if (method === 'post') {
            app.post(`/${route.split('/')[1]}`, (req: Request, res: Response, next: NextFunction) => {
                controller(req, res, next);
            });
        }
    }
}

app.get('/', (req: Request, res: Response, next: NextFunction) => {
    res.send('Hello');
});
app.listen(5000, () => console.log('Server running'));
