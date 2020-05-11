import io from "socket.io-client";

function OfficeEvents(config) {
  this.config = config;

  config.currentUser.imageUrl = encodeURIComponent(config.currentUser.imageUrl);

  const user = JSON.stringify(config.currentUser);

  const queryConn = `user=${user}&room=${config.currentRoom}`;

  console.log('connecting', queryConn);

  this.socketIO = io.connect(config.domain, {
    query: queryConn,
    forceNew: true,
    timeout: 60000
  });
}

OfficeEvents.prototype.closeConnection = function closeConnection() {
  this.socketIO.close();
};

OfficeEvents.prototype.listenEvent = function listenEvent(event, callback) {
  this.socketIO.on(event, data => {
    if (event === 'disconnect') {
      console.log('disconnect', data, new Date().getTime());
    }
    if(event === 'update-rooms') {
      console.log('update-rooms')
    }
    if (data.user) {
      callback(data.user, data.room);
    } else {
      callback(data);
    }
  });
};

OfficeEvents.prototype.emitEvent = function emitEvent(event, data) {
  this.socketIO.emit(event, data);
};

OfficeEvents.prototype.enterInRoom = function enterInRoom(roomId) {
  this.emitEvent("enter-room", { room: roomId, user: this.config.currentUser });
};

OfficeEvents.prototype.closeRoom = function closeRoom(roomId) {
  this.emitEvent("close-room", { room: roomId, user: this.config.currentUser });
};

OfficeEvents.prototype.openRoom = function openRoom(roomId) {
  this.emitEvent("open-room", { room: roomId, user: this.config.currentUser });
};

OfficeEvents.prototype.knockRoom = function knockRoom(roomId) {
  this.emitEvent("knock-room", { room: roomId, user: this.config.currentUser });
};

OfficeEvents.prototype.allowUserEnterRoom = function allowUserEnterRoom(userId, roomId) {
  this.emitEvent("allow-user-enter-room", { room: roomId, user: userId });
};

OfficeEvents.prototype.startMeet = function startMeet() {
  this.emitEvent("start-meet", this.config.currentUser.id);
};

OfficeEvents.prototype.leftMeet = function leftMeet() {
  this.emitEvent("left-meet", this.config.currentUser.id);
};

OfficeEvents.prototype.callUserForMyRoom = function callUserForMyRoom(
  userId,
  roomId
) {
  this.emitEvent("get-user-to-room", { room: roomId, user: userId });
};

OfficeEvents.prototype.onParticipantJoined = function onParticipantJoined(
  callback
) {
  this.listenEvent("enter-room", callback);
};

OfficeEvents.prototype.onParticipantStartedMeet = function onParticipantStartedMeet(
  callback
) {
  this.listenEvent("start-meet", callback);
};

OfficeEvents.prototype.onParticipantLeftMeet = function onParticipantLeftMeet(
  callback
) {
  this.listenEvent("left-meet", callback);
};

OfficeEvents.prototype.onUpdateRooms = function onUpdateRooms(callback) {
  this.listenEvent("update-rooms", callback);
};

OfficeEvents.prototype.onAnswerKnockRoom = function onAnswerKnockRoom(callback) {
  this.listenEvent("answer-knock-room", callback);
};

OfficeEvents.prototype.onEnterRoomAllowed = function onEnterRoomAllowed(callback) {
  this.listenEvent("enter-room-allowed", callback);
};

OfficeEvents.prototype.onSyncOffice = function onSyncOffice(callback) {
  this.listenEvent("sync-office", callback);
};

OfficeEvents.prototype.onParticipantIsCalled = function onParticipantIsCalled(
  callback
) {
  this.listenEvent("get-user-to-room", callback);
};


OfficeEvents.prototype.onDisconnect = function onDisconnect(callback) {
  this.listenEvent("disconnect", callback);
};

export default OfficeEvents;
