import { useEffect, useRef, useState } from "react";
import { createSocket } from "../../socket";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

// Video call component using WebRTC + Socket.IO
const VideoCallComponent = ({ roomId }) => {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerRef = useRef(null);
  const streamRef = useRef(null);
  const socketRef = useRef(null);

  const { auth } = useAuth();
  const navigate = useNavigate();

  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);

  // Initialize video call
  useEffect(() => {
    if (!auth) return;

    const startCall = async () => {
      // create socket with auth
      const socket = createSocket(auth);
      socketRef.current = socket;

      socket.emit("join-video-room", { roomId });

      // get camera and mic
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      streamRef.current = stream;
      localVideoRef.current.srcObject = stream;

      // create peer connection
      const peer = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      });

      peerRef.current = peer;

      // add tracks
      stream.getTracks().forEach((track) =>
        peer.addTrack(track, stream)
      );

      // remote stream
      peer.ontrack = (event) => {
        remoteVideoRef.current.srcObject = event.streams[0];
      };

      // ice candidates
      peer.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit("webrtc-ice", {
            roomId,
            candidate: event.candidate,
          });
        }
      };

      // create offer
      const offer = await peer.createOffer();
      await peer.setLocalDescription(offer);
      socket.emit("webrtc-offer", { roomId, offer });

      // receive offer
      socket.on("webrtc-offer", async (offer) => {
        await peer.setRemoteDescription(offer);
        const answer = await peer.createAnswer();
        await peer.setLocalDescription(answer);
        socket.emit("webrtc-answer", { roomId, answer });
      });

      // receive answer
      socket.on("webrtc-answer", async (answer) => {
        await peer.setRemoteDescription(answer);
      });

      // receive ice
      socket.on("webrtc-ice", async (candidate) => {
        if (candidate) {
          await peer.addIceCandidate(candidate);
        }
      });
    };

    startCall();

    // cleanup
    return () => {
      socketRef.current?.disconnect();
      streamRef.current?.getTracks().forEach((t) => t.stop());
      peerRef.current?.close();
    };
  }, [auth, roomId]);

  // toggle mic
  const toggleMic = () => {
    const track = streamRef.current.getAudioTracks()[0];
    track.enabled = !track.enabled;
    setMicOn(track.enabled);
  };

  // toggle cam
  const toggleCam = () => {
    const track = streamRef.current.getVideoTracks()[0];
    track.enabled = !track.enabled;
    setCamOn(track.enabled);
  };

  // end call
  const endCall = () => {
    navigate(-1);
  };

  return (
    <div className="relative min-h-screen bg-black">
      <video
        ref={remoteVideoRef}
        autoPlay
        playsInline
        className="w-full h-full object-cover"
      />

      <video
        ref={localVideoRef}
        autoPlay
        muted
        playsInline
        className="absolute bottom-24 right-6 w-48 h-32 rounded-lg border"
      />

      <div className="absolute bottom-6 w-full flex justify-center gap-4">
        <button onClick={toggleMic} className="bg-gray-800 text-white px-4 py-3 rounded-full">
          {micOn ? "🎤" : "🔇"}
        </button>

        <button onClick={toggleCam} className="bg-gray-800 text-white px-4 py-3 rounded-full">
          {camOn ? "🎥" : "🚫"}
        </button>

        <button onClick={endCall} className="bg-red-600 text-white px-4 py-3 rounded-full">
          ❌
        </button>
      </div>
    </div>
  );
};

export default VideoCallComponent;
