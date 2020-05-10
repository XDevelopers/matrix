import { createTerminus, HealthCheckError } from "@godaddy/terminus";

function onHealthCheck(app) {
  if (app.locals.roomsDetail && app.locals.roomsDetail.length) {
    return Promise.resolve();
  }
  throw new HealthCheckError();
}

module.exports = (server, app) => {
  createTerminus(server, {
    healthChecks: {
      '/healthz': () => onHealthCheck(app),
      verbatim: true
    }
  });
};
