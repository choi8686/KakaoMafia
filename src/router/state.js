"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
var PORT = Number(process.env.PORT);
var HOST = process.env.HOST;
const router = express_1.default.Router();
router.post("/", (req, res, next) => {
    let state = req.body.state;
    req.app.set('state', state);
    res.send('success');
});
module.exports = router;
