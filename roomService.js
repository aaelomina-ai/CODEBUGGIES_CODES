import {
  ref,
  push,
  set,
  get,
  update,
  remove,
  onValue,
  runTransaction,
} from "firebase/database";
import { db } from "../firebase";

export const COUNTDOWN_MS = 5000;
const MAX_PLAYERS = 4;
const MIN_PLAYERS_TO_COUNT = 2;

function randomCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 5; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

async function addPlayerAndMaybeStartCountdown(roomId, uid, username) {
  const roomRef = ref(db, `rooms/${roomId}`);

  await runTransaction(roomRef, (room) => {
    if (!room) return room;

    room.players = room.players || {};
    if (!room.players[uid]) {
      room.players[uid] = { username, joinedAt: Date.now() };
    }

    const playerCount = Object.keys(room.players).length;
    if (room.status === "waiting" && playerCount >= MIN_PLAYERS_TO_COUNT) {
      room.status = "counting";
      room.countdownStartedAt = Date.now();
    }

    return room;
  });
}

export async function findOrCreateQuickMatch(uid, username) {
  const roomsRef = ref(db, "rooms");
  const snapshot = await get(roomsRef);
  const rooms = snapshot.val() || {};

  const openRoomId = Object.keys(rooms).find((id) => {
    const room = rooms[id];
    return (
      room.type === "public" &&
      room.status === "waiting" &&
      Object.keys(room.players || {}).length < MAX_PLAYERS
    );
  });

  if (openRoomId) {
    await addPlayerAndMaybeStartCountdown(openRoomId, uid, username);
    return openRoomId;
  }

  const newRoomRef = push(roomsRef);
  await set(newRoomRef, {
    type: "public",
    status: "waiting",
    countdownStartedAt: null,
    createdAt: Date.now(),
    players: {
      [uid]: { username, joinedAt: Date.now() },
    },
  });
  return newRoomRef.key;
}

export async function createPrivateRoom(uid, username) {
  const roomsRef = ref(db, "rooms");
  const newRoomRef = push(roomsRef);
  const code = randomCode();

  await set(newRoomRef, {
    type: "private",
    code,
    status: "waiting",
    countdownStartedAt: null,
    createdAt: Date.now(),
    players: {
      [uid]: { username, joinedAt: Date.now() },
    },
  });

  await set(ref(db, `roomCodes/${code}`), newRoomRef.key);

  return { roomId: newRoomRef.key, code };
}

export async function joinPrivateRoomByCode(rawCode, uid, username) {
  const code = (rawCode || "").trim().toUpperCase();
  const codeSnap = await get(ref(db, `roomCodes/${code}`));
  const roomId = codeSnap.val();

  if (!roomId) {
    throw new Error("No room found with that code.");
  }

  const roomSnap = await get(ref(db, `rooms/${roomId}`));
  const room = roomSnap.val();

  if (!room) {
    throw new Error("That room no longer exists.");
  }
  if (room.status !== "waiting") {
    throw new Error("That room has already started.");
  }
  if (Object.keys(room.players || {}).length >= MAX_PLAYERS) {
    throw new Error("That room is full.");
  }

  await addPlayerAndMaybeStartCountdown(roomId, uid, username);
  return roomId;
}

/**
 * Records the language/difficulty a player picked in the Learning Hub,
 * so it's visible to anyone else reading the room (e.g. a future
 * "everyone's playing X" summary). Called by GameSelectScreen right
 * before it hands off to QuizScreen.
 */
export async function setPlayerSelection(roomId, uid, selection) {
  await update(ref(db, `rooms/${roomId}/players/${uid}`), { selection });
}

/**
 * Atomically adds `points` to a player's score. Uses a transaction
 * (not a plain set) because multiple correct answers can fire in quick
 * succession and a plain read-then-write would drop points under a race.
 */
export async function addScore(roomId, uid, points) {
  const scoreRef = ref(db, `rooms/${roomId}/players/${uid}/score`);
  await runTransaction(scoreRef, (current) => (current || 0) + points);
}

export function listenToRoom(roomId, callback) {
  const roomRef = ref(db, `rooms/${roomId}`);
  return onValue(roomRef, (snapshot) => {
    callback(snapshot.val());
  });
}

export async function leaveRoom(roomId, uid) {
  const roomRef = ref(db, `rooms/${roomId}`);
  const snapshot = await get(roomRef);
  const room = snapshot.val();
  if (!room) return;

  const remainingPlayers = { ...(room.players || {}) };
  delete remainingPlayers[uid];

  if (Object.keys(remainingPlayers).length === 0) {
    if (room.type === "private" && room.code) {
      await remove(ref(db, `roomCodes/${room.code}`));
    }
    await remove(roomRef);
    return;
  }

  await remove(ref(db, `rooms/${roomId}/players/${uid}`));

  if (room.status === "counting" && Object.keys(remainingPlayers).length < MIN_PLAYERS_TO_COUNT) {
    await update(roomRef, { status: "waiting", countdownStartedAt: null });
  }
}

export async function tryStartMatch(roomId) {
  const roomRef = ref(db, `rooms/${roomId}`);
  await runTransaction(roomRef, (room) => {
    if (!room) return room;
    if (room.status === "counting") {
      room.status = "in_progress";
    }
    return room;
  });
}