"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const regist_1 = __importDefault(require("./router/regist"));
const role_1 = __importDefault(require("./router/role"));
const skil_1 = __importDefault(require("./router/skil"));
const vote_1 = __importDefault(require("./router/vote"));
const path_1 = __importDefault(require("path"));
const state_1 = __importDefault(require("./router/state"));
const http_1 = __importDefault(require("http"));
require("dotenv").config();
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
var io = require('socket.io')(server);
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.set('player', []);
app.set('killed', undefined);
app.set('state', undefined);
app.set('initPlayer', undefined);
app.use("/state", state_1.default);
app.use("/vote", vote_1.default);
app.use("/regist", regist_1.default);
app.use("/skil", skil_1.default);
app.use("/role", role_1.default);
app.set('view engine', 'ejs');
app.set('views', path_1.default.join(__dirname, 'views'));
app.use('/static', express_1.default.static(__dirname + '/public'));
io.on('connection', (socket) => {
    socket.on('login', function (data) {
        io.emit('con', data);
    });
    socket.on('message', function (nick, message) {
        io.emit('message', nick, message);
        if (message.startsWith('/지목')) {
            let kill = message.substr(4);
            let player = app.get('player');
            let killed = app.get('killed');
            let find = player.find((e) => e.nick === kill);
            if (killed)
                return io.emit('server', '이미 지목을 했습니다.');
            else if (!find)
                return io.emit('server', '해당 플레이어가 존재하지 않습니다.');
            else if (find.role === '마피아')
                return io.emit('server', '해당 플레이어는 마피아라 죽일 수 없습니다..');
            else {
                io.emit('server', '"' + kill + '"을/를 지목했습니다.');
                app.set('killed', kill);
            }
        }
    });
});
const port = undefined || 3000;
server.listen(port, '0.0.0.0');
console.log('start');
