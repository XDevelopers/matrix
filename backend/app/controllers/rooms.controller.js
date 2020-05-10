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

const applyTemporaryFields = (newRooms) => {
  const tempFields = ['closed'];
  const roomsById = {};
  newRooms.forEach(r => roomsById[r.id] = r);
  rooms.forEach(r => {
    if (r.id in roomsById) {
      tempFields.forEach(f => roomsById[r.id][f] = r[f]);
    }
  });
}

const reloadRoomsListener = (strategy, cb) => {
  const loadRooms = () => {
    fetchRooms(strategy)
      .then((newRooms) => {
        applyTemporaryFields(newRooms);
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

const closeRoom = (roomId) => {
  const room = rooms.filter(r => r.id === roomId)[0];
  room.closed = true;
}

const openRoom = (roomId) => {
  const room = rooms.filter(r => r.id === roomId)[0];
  room.closed = false;
}

const getRooms = () => rooms;

export { getRooms, reloadRoomsListener, closeRoom, openRoom };
