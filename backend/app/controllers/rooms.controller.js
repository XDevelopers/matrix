import fs from "fs";
import uuid from "uuid/v4";
import path from "path";
import spreadsheet from '../helpers/gsuite/spreadsheet';
import calendar from '../helpers/gsuite/calendar';

const roomFilePath = "../file/matrix.room.web.json";

let rooms = [];

const fetchFromFile = () => {
  const roomFileExists = fs.existsSync(roomFilePath);
  if (!roomFileExists) {
    createRoomFileSync();
  }

  const roomsData = fs.readFileSync(roomFilePath);
  const roomsDetail = JSON.parse(roomsData);

  return new Promise(resolve => resolve(roomsDetail));
};

const createRoomFileSync = () => {
  const roomsData = [];

  roomsData[0] = {
    id: uuid(),
    name: "The Dock",
    disableMeeting: true,
  };

  const niceNames = [
    "Nebuchadnezzar",
    "Logos",
    "Osiris",
    "Icarus",
    "Caduceus",
    "Brahma",
    "Novalis",
    "Vigilant",
    "Zion",
  ];

  for (const niceName of niceNames) {
    roomsData.push({
      id: uuid(),
      name: niceName
    });
  }

  fs.mkdirSync(path.dirname(roomFilePath), { recursive: true });
  fs.writeFileSync(roomFilePath, JSON.stringify(roomsData));
};

const fetchFromEnvironment = (env) => {
  const roomsData = env.ROOMS_DATA;
  const roomsDetail = JSON.parse(roomsData);

  return new Promise(resolve => resolve(roomsDetail));
};

const fetchGSuite = (env) => {
  return spreadsheet.listRooms(env.GSUITE_SPREADSHEET_KEY);
  // const promises = []
  // promises.push(spreadsheet.listRooms(env.GSUITE_SPREADSHEET_KEY));
  // promises.push(calendar.listRooms(env.GSUITE_CALENDAR_ID));
  // return Promise.all(promises).then(result => result[0].concat(result[1]));
};

const fetchRooms = (strategy) => {
  switch (strategy) {
    // TODO add suport to fetch from endpoint
    case "GSUITE":
      return fetchGSuite(process.env);
    case "ENVIRONMENT":
      return fetchFromEnvironment(process.env);
    default:
      return fetchFromFile();
  }
};

const reloadRoomsListener = (strategy, cb) => {
  const loadRooms = () => {
    fetchRooms(strategy)
      .then((newRooms) => {
        if (JSON.stringify(rooms) !== JSON.stringify(newRooms)) {
          console.log(newRooms);
          rooms = newRooms;
          cb(rooms);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }
  loadRooms();

  if (strategy === "GSUITE") {
    setInterval(loadRooms, 10000);
  }
};

const getRooms = () => rooms;

export { getRooms, reloadRoomsListener };
