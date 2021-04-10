import express from 'express';
import cors from 'cors';
import routes from './routes/routes'

const app = express();

app.use(cors());
app.use(routes);
app.use(express.static(__dirname + "/../../build"));
app.use(express.static("build"));

app.listen(9000, () => {
  console.log('The application is running on port 9000!');
});

