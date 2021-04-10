import express from 'express';
import path from 'path';

const router = express.Router();
const app = express();

/* GET home page. */
router.get('/', function(req, res, next) {
    app.use(express.static("../../build"));
  // res.render('index', { title: 'Express' });
  // res.sendFile(path.join(__dirname, "../../public", "index.html"));
});

export default router;
