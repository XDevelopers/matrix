import app from "./app.server";
import officeFactory from "./office.factory";
import healthCheck from "./app.healthcheck";
import { ROOMS_SOURCE, HOST, PORT } from "./app.config";
import { reloadRoomsListener } from "./controllers/rooms.controller";

const server = app.listen(PORT, HOST, undefined, () => {
  console.log(`Running on http://${HOST}:${PORT}`);
});

healthCheck(server, app);

const office = officeFactory(server);
office.start();

reloadRoomsListener(ROOMS_SOURCE, rooms => office.updateRooms(rooms));

module.exports = server;
