import { createTerminus, HealthCheckError } from "@godaddy/terminus";
import { getRooms } from "./controllers/rooms.controller";

function onHealthCheck(app) {
  const rooms = getRooms();
  if (rooms.length > 0) {
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
