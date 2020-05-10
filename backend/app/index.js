import app from "./app.server";
import officeFactory from "./office.factory";
import healthCheck from "./app.healthcheck";
import { HOST, PORT } from "./app.config";

const server = app.listen(PORT, HOST, undefined, () => {
  console.log(`Running on http://${HOST}:${PORT}`);
});

const office = officeFactory(server);
office.start();


healthCheck(server, office.roomsController.getRooms);

module.exports = server;
