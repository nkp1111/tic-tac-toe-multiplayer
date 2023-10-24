
const { v4 } = require("uuid");
const { gameTask } = require("./gameTask");

/**
 * @desc Creates a new game room for 2 players 
 * @param {object} rooms - game room in which two user are connected 
 * @param {*} socketId - socket id of the user create game room
 * @returns 
 */
function createGameRoom(rooms, socketId) {
  const gameRoomId = v4();
  rooms[gameRoomId] = [socketId];
  const message = gameTask[0];
  message.roomId = gameRoomId;
  message.success = "Game room created";
  return { rooms, message };
}


function joinGameRoom() {
  //   if (Object.keys(gameRecords.rooms).includes(id)
  //     && gameRecords.rooms[id].length > 2) {
  //     gameRecords.rooms[id].push(socket.id);
  //     socket.emit(`${socket.id} message`, { message: "You have joined the game room" })
  //   }
}

/**
 * 
 * @param {string} gameRoomId - game room id from where user is leaving 
 * @param {string} socketId - user socket id
 */
function leaveGameRoom(rooms, gameRoomId, socketId) {
  let leftGameRoomId;
  if (Object.keys(rooms).includes(gameRoomId)
    && rooms[gameRoomId].includes(socketId)) {
    const roomAfterPlayerLeft = rooms[gameRoomId].filter(id => id !== socketId);
    if (roomAfterPlayerLeft.length === 0) {
      delete rooms[gameRoomId];
    } else {
      rooms[gameRoomId] = roomAfterPlayerLeft;
      leftGameRoomId = gameRoomId;
    }
  }
  const message = gameTask[2];
  message.success = "Player left the game room"
  message.roomId = leftGameRoomId;
  return { rooms, message }
}

/**
 * @desc update game rooms when user disconnects
 * @param {*} rooms 
 * @param {*} socketId 
 * @returns 
 */
function leftGameRoom(rooms, socketId) {
  let leftGameRoomId;
  const roomIds = Object.keys(rooms);
  roomIds.forEach(id => {
    if (rooms[id].includes(socketId)) {
      rooms[id] = rooms[id].filter(user => user !== socketId);
      if (rooms[id].length === 0) {
        delete rooms[id];
      } else {
        leftGameRoomId = id;
      }
    }
  })
  const message = gameTask[2];
  message.success = "User left the game"
  message.roomId = leftGameRoomId;
  return { rooms, message }
}


module.exports = {
  createGameRoom,
  leaveGameRoom,
  leftGameRoom,
}