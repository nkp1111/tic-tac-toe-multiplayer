
const { v4 } = require("uuid");
const { gameTask } = require("./gameTask");

function createGameRoom(rooms, socketId) {
  const gameRoomId = v4();
  rooms[gameRoomId] = [socketId];
  const message = gameTask[0];
  message.roomId = gameRoomId;
  message.success = "Game room created";
  return { rooms, message };
}


module.exports = {
  createGameRoom,

}