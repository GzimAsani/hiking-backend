import express, { Application, Request, Response, NextFunction } from 'express';
import './db/mongo';
import router from './htpp-middleware/router';
import cors from 'cors'

const app = express();
app.use(cors({
  origin: '*'
}));

app.use("/", router)



app.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.send('Hello');
});
app.listen(5000, () => console.log('Server running'));
