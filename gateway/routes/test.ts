import axios from "axios";

const express = require("express");
const router = express.Router();

router.get("/", function(req, res, next) {
    axios
        .get("https://localhost:8000/api/Repo/Model/all")
        .then(response => res.send(response.data));
    // res.send("Test passed");
});

export default router;