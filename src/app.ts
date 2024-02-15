import express, { Application, Request, Response, NextFunction } from 'express';
import './db/mongo';
import router from './htpp-middleware/router';

const app: express.Application = express();

app.use("/", router)


app.get('/', (req: Request, res: Response, next: NextFunction) => {
    res.send('Hello');
});
app.listen(5000, () => console.log('Server running'));
