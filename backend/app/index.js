import app from "./app.server";
import officeFactory from "./office.factory";
import healthCheck from "./app.healthcheck";
import { HOST, PORT } from "./app.config";

import fetchRooms from "./controllers/rooms.controller";
import { ROOMS_SOURCE } from "./app.config";

const server = app.listen(PORT, HOST, undefined, () => {
  console.log(`Running on http://${HOST}:${PORT}`);
});

healthCheck(server);
const office = officeFactory(server);

const loadRooms = () => {
  const previousRooms = app.locals.roomsDetail;
  console.log('Loading rooms...')
  fetchRooms(ROOMS_SOURCE)
    .then((roomsData) => {
      if (!previousRooms || JSON.stringify(previousRooms) !== JSON.stringify(roomsData)) {
        console.log(roomsData);
        app.locals.roomsDetail = roomsData;
        office.updateRooms(roomsData);
      }
    })
    .catch((err) => {
      console.error(err);
    });
}
loadRooms();

if (ROOMS_SOURCE === "ENVIRONMENT_AND_SPREADSHEET") {
  setInterval(loadRooms, 10000);
}


office.start();
module.exports = server;
