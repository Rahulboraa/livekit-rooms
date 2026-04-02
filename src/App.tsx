import {
  LiveKitRoom,
  VideoConference,
  RoomAudioRenderer,
  useLocalParticipant,
  useTracks,
  VideoTrack,
} from "@livekit/components-react";
import "@livekit/components-styles";
import { useState, useRef, useEffect } from "react";
import { Track, LocalVideoTrack } from "livekit-client";
import { BackgroundProcessor } from "@livekit/track-processors";
import { createPortal } from "react-dom";

type BgOption = "none" | "blur" | "custom";

const BG_OPTIONS: { id: BgOption; label: string }[] = [
  { id: "none", label: "None" },
  { id: "blur", label: "Blur" },
  { id: "custom", label: "Custom Image" },
];

// ─── Background Settings ──────────────────────────────────────────────────────

function BackgroundSettings({ onClose }: { onClose: () => void }) {
  const { localParticipant } = useLocalParticipant();
  const [active, setActive] = useState<BgOption>("none");
  const [loading, setLoading] = useState(false);
  const [customImageUrl, setCustomImageUrl] = useState("");
  const processorRef = useRef<ReturnType<typeof BackgroundProcessor> | null>(
    null,
  );

  const getVideoTrack = (): LocalVideoTrack | null =>
    (localParticipant
      .getTrackPublications()
      .find((pub) => pub.track?.kind === Track.Kind.Video)
      ?.track as LocalVideoTrack) ?? null;

  const applyBackground = async (option: BgOption, imageUrl?: string) => {
    setLoading(true);
    try {
      const videoTrack = getVideoTrack();
      if (!videoTrack) return;

      if (!processorRef.current) {
        processorRef.current = BackgroundProcessor({ mode: "disabled" });
        await videoTrack.setProcessor(processorRef.current);
      }

      if (option === "none") {
        await processorRef.current.switchTo({ mode: "disabled" });
      } else if (option === "blur") {
        await processorRef.current.switchTo({
          mode: "background-blur",
          blurRadius: 10,
        });
      } else if (option === "custom" && imageUrl) {
        await processorRef.current.switchTo({
          mode: "virtual-background",
          imagePath: imageUrl,
        });
      }

      setActive(option);
    } catch (e) {
      console.error("Background apply failed", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: "90px",
        right: "16px",
        zIndex: 200,
        background: "#18181b",
        border: "1px solid #27272a",
        borderRadius: "14px",
        padding: "16px",
        width: "232px",
        color: "white",
        boxShadow: "0 16px 48px rgba(0,0,0,0.5)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "14px",
        }}
      >
        <span
          style={{ fontWeight: 600, fontSize: "13px", letterSpacing: "0.02em" }}
        >
          Background Effects
        </span>
        <button
          onClick={onClose}
          style={{
            background: "#27272a",
            border: "none",
            color: "#a1a1aa",
            cursor: "pointer",
            borderRadius: "6px",
            width: "24px",
            height: "24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "14px",
          }}
        >
          ×
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        {BG_OPTIONS.map((opt) => (
          <button
            key={opt.id}
            onClick={() => opt.id !== "custom" && applyBackground(opt.id)}
            disabled={loading}
            style={{
              padding: "9px 12px",
              borderRadius: "8px",
              border: "1px solid",
              borderColor: active === opt.id ? "#6366f1" : "#27272a",
              background:
                active === opt.id ? "rgba(99,102,241,0.15)" : "transparent",
              color: active === opt.id ? "#a5b4fc" : "#d4d4d8",
              cursor: loading ? "not-allowed" : "pointer",
              fontSize: "13px",
              textAlign: "left",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              transition: "all 0.15s",
            }}
          >
            <span
              style={{
                width: "7px",
                height: "7px",
                borderRadius: "50%",
                flexShrink: 0,
                background: active === opt.id ? "#6366f1" : "#3f3f46",
              }}
            />
            {opt.label}
          </button>
        ))}

        <div
          style={{
            marginTop: "8px",
            paddingTop: "12px",
            borderTop: "1px solid #27272a",
            display: "flex",
            flexDirection: "column",
            gap: "6px",
          }}
        >
          <span style={{ fontSize: "11px", color: "#71717a" }}>
            Custom image URL
          </span>
          <input
            placeholder="https://..."
            value={customImageUrl}
            onChange={(e) => setCustomImageUrl(e.target.value)}
            style={{
              padding: "8px 10px",
              borderRadius: "8px",
              border: "1px solid #27272a",
              background: "#09090b",
              color: "white",
              fontSize: "12px",
              outline: "none",
            }}
          />
          <button
            onClick={() => applyBackground("custom", customImageUrl)}
            disabled={!customImageUrl || loading}
            style={{
              padding: "8px",
              borderRadius: "8px",
              border: "none",
              background: customImageUrl ? "#6366f1" : "#27272a",
              color: customImageUrl ? "white" : "#52525b",
              cursor: customImageUrl && !loading ? "pointer" : "not-allowed",
              fontSize: "12px",
              fontWeight: 500,
            }}
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── PiP Camera Tiles ─────────────────────────────────────────────────────────

function CameraTiles({ container }: { container: Element }) {
  const cameraTracks = useTracks([
    { source: Track.Source.Camera, withPlaceholder: false },
  ]);

  return createPortal(
    <div
      style={{
        display: "flex",
        gap: "6px",
        padding: "10px",
        background: "#09090b",
        height: "100%",
        boxSizing: "border-box",
        overflowX: "auto",
      }}
    >
      {cameraTracks.map((track) => (
        <div
          key={track.participant.identity}
          style={{
            position: "relative",
            width: "160px",
            height: "100%",
            borderRadius: "10px",
            overflow: "hidden",
            background: "#18181b",
            flexShrink: 0,
            border: "1px solid #27272a",
          }}
        >
          <VideoTrack
            trackRef={track}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "6px",
              left: "6px",
              background: "rgba(0,0,0,0.7)",
              backdropFilter: "blur(4px)",
              borderRadius: "6px",
              padding: "3px 8px",
              fontSize: "11px",
              color: "white",
              fontWeight: 500,
            }}
          >
            {track.participant.identity}
          </div>
        </div>
      ))}
    </div>,
    container,
  );
}

// ─── Floating Cameras with Document PiP ──────────────────────────────────────

function FloatingCameras() {
  const screenShareTracks = useTracks([
    { source: Track.Source.ScreenShare, withPlaceholder: false },
  ]);
  const isScreenSharing = screenShareTracks.length > 0;

  const pipWindowRef = useRef<Window | null>(null);
  const [pipContainer, setPipContainer] = useState<Element | null>(null);
  const [pipOpen, setPipOpen] = useState(false);

  useEffect(() => {
    if (isScreenSharing && !pipOpen) openPip();
    if (!isScreenSharing && pipOpen) closePip();
  }, [isScreenSharing]);

  const openPip = async () => {
    if (!("documentPictureInPicture" in window)) return;
    try {
      // @ts-ignore
      const pipWin = await window.documentPictureInPicture.requestWindow({
        width: 380,
        height: 160,
      });
      pipWindowRef.current = pipWin;

      const style = pipWin.document.createElement("style");
      style.textContent = `
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: #09090b; overflow: hidden; height: 100vh; font-family: -apple-system, sans-serif; }
        #pip-root { height: 100%; }
        video { display: block; }
      `;
      pipWin.document.head.appendChild(style);

      const container = pipWin.document.createElement("div");
      container.id = "pip-root";
      pipWin.document.body.appendChild(container);

      setPipContainer(container);
      setPipOpen(true);

      pipWin.addEventListener("pagehide", () => {
        setPipOpen(false);
        setPipContainer(null);
        pipWindowRef.current = null;
      });
    } catch (e) {
      console.error("PiP failed", e);
    }
  };

  const closePip = () => {
    pipWindowRef.current?.close();
    pipWindowRef.current = null;
    setPipOpen(false);
    setPipContainer(null);
  };

  if (!isScreenSharing) return null;

  return (
    <>
      <button
        onClick={() => (pipOpen ? closePip() : openPip())}
        style={{
          position: "fixed",
          bottom: "90px",
          left: "16px",
          zIndex: 100,
          background: pipOpen ? "rgba(99,102,241,0.2)" : "#18181b",
          color: pipOpen ? "#a5b4fc" : "#d4d4d8",
          border: `1px solid ${pipOpen ? "#6366f1" : "#27272a"}`,
          borderRadius: "8px",
          padding: "8px 14px",
          fontSize: "12px",
          fontWeight: 500,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "6px",
          backdropFilter: "blur(8px)",
        }}
      >
        <span style={{ fontSize: "14px" }}>{pipOpen ? "⊠" : "⧉"}</span>
        {pipOpen ? "Close cameras" : "Pop out cameras"}
      </button>

      {pipContainer && <CameraTiles container={pipContainer} />}
    </>
  );
}

// ─── Room View ────────────────────────────────────────────────────────────────

function RoomView() {
  const [showBgSettings, setShowBgSettings] = useState(false);

  return (
    <>
      <VideoConference />
      <RoomAudioRenderer />
      <FloatingCameras />

      <button
        onClick={() => setShowBgSettings((v) => !v)}
        style={{
          position: "fixed",
          bottom: "90px",
          right: "16px",
          zIndex: 100,
          background: showBgSettings ? "rgba(99,102,241,0.2)" : "#18181b",
          color: showBgSettings ? "#a5b4fc" : "#d4d4d8",
          border: `1px solid ${showBgSettings ? "#6366f1" : "#27272a"}`,
          borderRadius: "8px",
          padding: "8px 14px",
          fontSize: "12px",
          fontWeight: 500,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "6px",
          backdropFilter: "blur(8px)",
        }}
      >
        <span style={{ fontSize: "14px" }}>✦</span>
        Background
      </button>

      {showBgSettings && (
        <BackgroundSettings onClose={() => setShowBgSettings(false)} />
      )}
    </>
  );
}

// ─── Join Form ────────────────────────────────────────────────────────────────

function JoinForm({ onJoin }: { onJoin: (token: string) => void }) {
  const [roomName, setRoomName] = useState("");
  const [participantName, setParticipantName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleJoin = async () => {
    if (!roomName || !participantName) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        `http://localhost:3001/api/token?roomName=${encodeURIComponent(roomName)}&participantName=${encodeURIComponent(participantName)}`,
      );
      const data = await res.json();
      if (!data.token) throw new Error("No token received");
      onJoin(data.token);
    } catch {
      setError("Failed to get token. Is the server running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        background:
          "radial-gradient(ellipse at center, #18181b 0%, #09090b 100%)",
        color: "white",
        gap: "12px",
      }}
    >
      <div style={{ marginBottom: "8px", textAlign: "center" }}>
        <h1
          style={{
            fontSize: "22px",
            fontWeight: 700,
            letterSpacing: "-0.02em",
          }}
        >
          Join Meeting
        </h1>
        <p style={{ fontSize: "13px", color: "#71717a", marginTop: "4px" }}>
          Enter room details to get started
        </p>
      </div>

      <input
        placeholder="Room name"
        value={roomName}
        onChange={(e) => setRoomName(e.target.value)}
        style={inputStyle}
      />
      <input
        placeholder="Your name"
        value={participantName}
        onChange={(e) => setParticipantName(e.target.value)}
        style={inputStyle}
        onKeyDown={(e) => e.key === "Enter" && handleJoin()}
      />

      {error && (
        <div
          style={{
            background: "rgba(239,68,68,0.1)",
            border: "1px solid rgba(239,68,68,0.3)",
            borderRadius: "8px",
            padding: "8px 12px",
            fontSize: "12px",
            color: "#fca5a5",
          }}
        >
          {error}
        </div>
      )}

      <button
        onClick={handleJoin}
        disabled={!roomName || !participantName || loading}
        style={{
          padding: "10px 32px",
          borderRadius: "8px",
          marginTop: "4px",
          background: roomName && participantName ? "#6366f1" : "#27272a",
          color: roomName && participantName ? "white" : "#52525b",
          border: "none",
          cursor: roomName && participantName ? "pointer" : "not-allowed",
          fontSize: "14px",
          fontWeight: 600,
          opacity: loading ? 0.7 : 1,
          width: "320px",
        }}
      >
        {loading ? "Joining..." : "Join"}
      </button>
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────

const LIVEKIT_URL = import.meta.env.VITE_LIVEKIT_URL as string;

export default function App() {
  const [token, setToken] = useState("");

  const params = new URLSearchParams(window.location.search);
  const queryToken = params.get("token");
  const activeToken = token || queryToken || "";

  if (activeToken) {
    return (
      <LiveKitRoom
        token={activeToken}
        serverUrl={LIVEKIT_URL}
        connect={true}
        video={true}
        audio={true}
        onDisconnected={() => setToken("")}
      >
        <RoomView />
      </LiveKitRoom>
    );
  }

  return <JoinForm onJoin={setToken} />;
}

const inputStyle: React.CSSProperties = {
  padding: "10px 14px",
  borderRadius: "8px",
  border: "1px solid #27272a",
  background: "#18181b",
  color: "white",
  fontSize: "13px",
  width: "320px",
  outline: "none",
};
