import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createSocket } from "../../socket";
import API from "../../api/axios";

const Chat = ({ appointmentId }) => {
  const auth = JSON.parse(localStorage.getItem("auth"));
  const userId = auth?.user?._id;
  const navigate = useNavigate();

  const socketRef = useRef(null); // ✅ keep single socket
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    if (!appointmentId || !userId) return;

    // create socket ONCE
    socketRef.current = createSocket(auth);
    if (!socketRef.current) return;

    const socket = socketRef.current;

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
      socket.disconnect(); // cleanup
    };
  }, [appointmentId, userId]);

  const sendMessage = () => {
    if (!text.trim()) return;

    socketRef.current.emit("sendMessage", {
      appointmentId,
      senderId: userId,
      senderRole: auth.user.role === "doctor" ? "doctor" : "patient",
      text,
    });

    setText("");
  };

  const joinVideoCall = async () => {
    const res = await API.post(
      "/rooms",
      { appointmentId },
      { headers: { Authorization: `Bearer ${auth.token}` } }
    );

    navigate(`/video/${res.data.room._id}`);
  };

  return (
    <div className="flex flex-col h-full bg-gray-100">
      {/* messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-2">
        {messages.map((m) => {
          const isMe = String(m.senderId) === String(userId);
          return (
            <div
              key={m._id}
              className={`max-w-xs p-3 rounded-xl text-sm ${
                isMe
                  ? "bg-blue-600 text-white ml-auto"
                  : "bg-white text-gray-800"
              }`}
            >
              {m.text}
            </div>
          );
        })}
      </div>

      {/* input */}
      <div className="p-3 bg-white border-t flex gap-2">
        <button
          onClick={joinVideoCall}
          className="bg-green-600 text-white px-3 py-2 rounded-lg"
        >
          🎥
        </button>

        <input
          className="flex-1 border rounded-lg px-3 py-2"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message"
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />

        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-4 rounded-lg"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
