import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import socket from "../../socket";
import API from "../../api/API";

// Real-time chat component for appointments
const Chat = ({ appointmentId }) => {
  const auth = JSON.parse(localStorage.getItem("auth"));
  const userId = auth?.user?._id;
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  // Join socket room and listen for messages
  useEffect(() => {
    if (!appointmentId || !userId) return;

    if (!socket.connected) socket.connect();

    socket.emit("joinRoom", { appointmentId });

    socket.on("recentMessages", (msgs) => setMessages(msgs || []));
    socket.on("newMessage", (msg) => {
      setMessages((prev) =>
        prev.some((m) => m._id === msg._id) ? prev : [...prev, msg]
      );
    });

    return () => {
      socket.off("recentMessages");
      socket.off("newMessage");
    };
  }, [appointmentId, userId]);

  // Send chat message
  const sendMessage = () => {
    if (!text.trim()) return;

    socket.emit("sendMessage", {
      appointmentId,
      senderId: userId,
      senderRole: auth.user.role === "doctor" ? "doctor" : "patient",
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
