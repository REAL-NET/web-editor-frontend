import express from 'express';
import cors from 'cors';
import routes from './routes/routes'

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(routes);
app.use(express.static(__dirname + "/../../build"));
app.use(express.static("build"));

app.listen(port, () => {
  console.log(`The application is running on port ${port}!`);
});

