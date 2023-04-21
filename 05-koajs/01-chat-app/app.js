const path = require('path');
const Koa = require('koa');
const app = new Koa();

app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();

let newMessageReceived = false;
let receivedMessage = '';
router.get('/subscribe', async (ctx, next) => {
  let interval;
  await new Promise((res) => {
    interval = setInterval(() => {
      if (newMessageReceived) {
        newMessageReceived = false;
        clearInterval(interval);
        res();
      }
    }, 1);
  });
  ctx.status = 200;
  ctx.body = receivedMessage;
});

router.post('/publish', async (ctx, next) => {
  ctx.status = 200;
  receivedMessage = ctx.request.body.message;
  newMessageReceived = true;

});

app.use(router.routes());

module.exports = app;
