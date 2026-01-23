import { useEffect, useRef, useState } from "react";
import socket from "../../socket";
import { useNavigate } from "react-router-dom";

// Video call component using WebRTC + Socket.IO
const VideoCallComponent = ({ roomId }) => {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerRef = useRef(null);
  const streamRef = useRef(null);

  const navigate = useNavigate();
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);

  // Initialize video call on mount
  useEffect(() => {
    const startCall = async () => {
      socket.connect();
      socket.emit("join-video-room", { roomId });

      // Get camera and microphone access
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      streamRef.current = stream;
      localVideoRef.current.srcObject = stream;

      // Create WebRTC peer connection
      const peer = new RTCPeerConnection({
        iceServers: [
          { urls: "stun:stun.l.google.com:19302" },
        ],
      });

      peerRef.current = peer;

      // Add media tracks to peer
      stream.getTracks().forEach((track) =>
        peer.addTrack(track, stream)
      );

      // Receive remote stream
      peer.ontrack = (event) => {
        remoteVideoRef.current.srcObject =
          event.streams[0];
      };

      // Send ICE candidates
      peer.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit("webrtc-ice", {
            roomId,
            candidate: event.candidate,
          });
        }
      };

      // Create and send offer
      const offer = await peer.createOffer();
      await peer.setLocalDescription(offer);
      socket.emit("webrtc-offer", { roomId, offer });

      // Handle incoming offer
      socket.on("webrtc-offer", async (offer) => {
        await peer.setRemoteDescription(offer);
        const answer = await peer.createAnswer();
        await peer.setLocalDescription(answer);
        socket.emit("webrtc-answer", { roomId, answer });
      });

      // Handle incoming answer
      socket.on("webrtc-answer", async (answer) => {
        await peer.setRemoteDescription(answer);
      });

      // Handle ICE candidates
      socket.on("webrtc-ice", async (candidate) => {
        if (candidate) {
          await peer.addIceCandidate(candidate);
        }
      });
    };

    startCall();

    // Cleanup on unmount
    return () => {
      socket.disconnect();
      streamRef.current?.getTracks().forEach((t) => t.stop());
      peerRef.current?.close();
    };
  }, [roomId]);

  // Toggle microphone
  const toggleMic = () => {
    const track = streamRef.current.getAudioTracks()[0];
    track.enabled = !track.enabled;
    setMicOn(track.enabled);
  };

  // Toggle camera
  const toggleCam = () => {
    const track = streamRef.current.getVideoTracks()[0];
    track.enabled = !track.enabled;
    setCamOn(track.enabled);
  };

  // End call and go back
  const endCall = () => {
    navigate(-1);
  };

  return (
    <div className="relative min-h-screen bg-black">

      {/* Remote video */}
      <video
        ref={remoteVideoRef}
        autoPlay
        playsInline
        className="w-full h-full object-cover"
      />

      {/* Local video (picture-in-picture) */}
      <video
        ref={localVideoRef}
        autoPlay
        muted
        playsInline
        className="absolute bottom-24 right-6 w-48 h-32 rounded-lg border"
      />

      {/* Call controls */}
      <div className="absolute bottom-6 w-full flex justify-center gap-4">
        <button
          onClick={toggleMic}
          className="bg-gray-800 text-white px-4 py-3 rounded-full"
        >
          {micOn ? "🎤" : "🔇"}
        </button>

        <button
          onClick={toggleCam}
          className="bg-gray-800 text-white px-4 py-3 rounded-full"
        >
          {camOn ? "🎥" : "🚫"}
        </button>

        <button
          onClick={endCall}
          className="bg-red-600 text-white px-4 py-3 rounded-full"
        >
          ❌
        </button>
      </div>

    </div>
  );
};

export default VideoCallComponent;
