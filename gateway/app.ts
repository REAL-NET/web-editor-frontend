import express from 'express';
import cors from 'cors';
import indexRouter from './routes/index'
import testRouter from './routes/test'

const app = express();

app.use(cors());
app.use('/', indexRouter);
app.use('/test', testRouter);

app.listen(9000, () => {
  console.log('The application is listening on port 9000!');
})

