// ─── Client → Server ───
export type WsClientMessage =
  | { type: "create_room"; duration: number; maxPlayers?: number }
  | { type: "join_room"; code: string }
  | { type: "leave_room" }
  | { type: "start_typing" }
  | { type: "progress"; wpm: number; accuracy: number }
  | { type: "finish"; wpm: number; accuracy: number };

// ─── Server → Client ───
export type WsServerMessage =
  | { type: "room_created"; code: string }
  | { type: "player_joined"; username: string; userId: string }
  | { type: "player_left"; username: string; userId: string }
  | { type: "countdown"; seconds: number }
  | { type: "typing_started"; text: string; duration: number }
  | { type: "player_progress"; userId: string; wpm: number; accuracy: number }
  | { type: "room_results"; results: WsRoomResult[] }
  | { type: "error"; message: string };

export type WsRoomResult = {
  userId: string;
  username: string;
  wpm: number;
  accuracy: number;
  placement: number;
};
