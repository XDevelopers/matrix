import { createTerminus, HealthCheckError } from "@godaddy/terminus";

function onHealthCheck(rooms) {
  if (rooms.length > 0) {
    return Promise.resolve();
  }
  throw new HealthCheckError();
}

module.exports = (server, getRooms) => {
  createTerminus(server, {
    healthChecks: {
      '/healthz': () => onHealthCheck(getRooms()),
      verbatim: true
    }
  });
};
