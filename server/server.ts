import express from "express";
import cors from "cors";
import { AccessToken } from "livekit-server-sdk";
import * as dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = process.env.LIVEKIT_API_KEY!;
const API_SECRET = process.env.LIVEKIT_API_SECRET!;

app.get("/api/token", async (req, res) => {
  const { roomName, participantName } = req.query as {
    roomName: string;
    participantName: string;
  };

  if (!roomName || !participantName) {
    res
      .status(400)
      .json({ error: "roomName and participantName are required" });
    return;
  }

  const token = new AccessToken(API_KEY, API_SECRET, {
    identity: participantName,
  });

  token.addGrant({
    roomJoin: true,
    room: roomName,
    canPublish: true,
    canSubscribe: true,
  });

  const jwt = await token.toJwt();
  res.json({ token: jwt });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Token server running on http://localhost:${PORT}`);
});
