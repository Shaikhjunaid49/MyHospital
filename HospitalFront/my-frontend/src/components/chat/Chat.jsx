import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { createSocket } from "../../socket";
import API from "../../api/axios";

// Real-time chat component for appointments
const Chat = ({ appointmentId }) => {
  const navigate = useNavigate();

  const auth = JSON.parse(localStorage.getItem("auth"));
  const userId = auth?.user?._id;

  const socketRef = useRef(null);

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  // Join socket room and listen for messages
  useEffect(() => {
    if (!appointmentId || !userId || !auth) return;

    // create socket with auth
    const socket = createSocket(auth);
    socketRef.current = socket;

    socket.emit("joinRoom", { appointmentId });

    socket.on("recentMessages", (msgs) => {
      setMessages(msgs || []);
    });

    socket.on("newMessage", (msg) => {
      setMessages((prev) =>
        prev.some((m) => m._id === msg._id) ? prev : [...prev, msg]
      );
    });

    return () => {
      socket.off("recentMessages");
      socket.off("newMessage");
      socket.disconnect();
    };
  }, [appointmentId, userId]);

  // Send chat message
  const sendMessage = () => {
    if (!text.trim()) return;

    socketRef.current.emit("sendMessage", {
      appointmentId,
      text,
    });

    setText("");
  };

  // Create or join video room
  const joinVideoCall = async () => {
    try {
      const res = await API.post("/rooms", { appointmentId });
      navigate(`/video/${res.data.room._id}`);
    } catch (err) {
      alert(err.response?.data?.message);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-100">
      {/* UI unchanged */}
    </div>
  );
};

export default Chat;
