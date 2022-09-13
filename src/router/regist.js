"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const request_ip_1 = __importDefault(require("request-ip"));
const dgram_1 = __importDefault(require("dgram"));
require("dotenv").config();
var PORT = Number(process.env.PORT);
var HOST = process.env.HOST;
const router = express_1.default.Router();
router.get("/", (req, res, next) => {
    var state = req.app.get('state');
    if (state !== 'produce')
        return res.send('현재 게임에 참여하실 수 없습니다.');
    res.render("regist", {});
});
router.get("/player", (req, res, next) => {
    var player = req.app.get('player');
    res.send(String(player.map((e, i) => e.nick)));
});
router.post("/findRole", (req, res, next) => {
    var nick = req.body.nick;
    var player = req.app.get('player');
    res.send(player.find((e) => e.nick === nick));
});
router.post("/", (req, res, next) => {
    let ip = request_ip_1.default.getClientIp(req);
    var player = req.app.get('player');
    if (player.find((e) => e.ip === ip)) {
        res.send("already");
        return;
    }
    else if (player.find((e) => e.nick === req.body.nick)) {
        res.send("already nick");
        return;
    }
    else if (req.app.get('player').length >= 12) {
        res.send("exceed");
        return;
    }
    var message = new Buffer(encodeURIComponent(JSON.stringify({ type: 'regist', nick: req.body.nick, ip: ip })));
    player.unshift({ nick: req.body.nick, ip: ip });
    req.app.set('player', player);
    var client = dgram_1.default.createSocket('udp4');
    client.send(message, 0, message.length, PORT, HOST, function (err, bytes) {
        if (err)
            throw err;
        client.close();
        console.log(req.app.get('player'));
    });
    res.send("success");
});
router.get("/init-player", (req, res, next) => {
    res.send(req.app.get('initPlayer'));
});
module.exports = router;
