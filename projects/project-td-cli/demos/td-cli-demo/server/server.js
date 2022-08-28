const Koa = require('koa');
const Router = require('@koa/router');
const send = require('koa-send');
const log4js = require('log4js');
const path = require('path');
const Template = require('./models/template.model');

const app = new Koa();
const router = new Router();
const logger = log4js.getLogger();
const PORT = 3000;

// 启用日志
log4js.configure({
  appenders: { cheese: { type: "file", filename: path.resolve(__dirname, 'logs/td-cli-server.log') } },
  categories: { default: { appenders: ["cheese"], level: "debug" } },
});

/**
 * 业务模板查询服务
 */
router.get('/list', async (ctx, next) => {
  logger.debug(`/list, request path: ${ctx.request.url}`);
  ctx.body = JSON.stringify([
    new Template(1, 'device', '内置网页模板'),
    new Template(2, 'manager', '管理平台模板'),
    new Template(3, 'sdk', 'SDK模版'),
  ]);
})

/**
 * 业务模板下载服务
 */
router.get('/download/:name', async (ctx, next) => {
  logger.debug(`/download, request path: ${ctx.request.url}`);
  const name = ctx.params.name;
  await send(ctx, name, { root: __dirname + '/templates' });
})

// 启用路由
app
  .use(router.routes())
  .use(router.allowedMethods());


// 运行服务
app.listen(PORT, () => {
  console.log(`server running at ${PORT}`);
});