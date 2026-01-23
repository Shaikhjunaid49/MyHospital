import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import socket from "../../socket";

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

    socket.on("recentMessages", (msgs) =>
      setMessages(msgs || [])
    );

    socket.on("newMessage", (msg) => {
      setMessages((prev) =>
        prev.some((m) => m._id === msg._id)
          ? prev
          : [...prev, msg]
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
      senderRole:
        auth.user.role === "doctor" ? "doctor" : "patient",
      text,
    });

    setText("");
  };

  // Create or join video room
  const joinVideoCall = async () => {
    const res = await fetch("http://localhost:8080/api/rooms", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth.token}`,
      },
      body: JSON.stringify({ appointmentId }),
    });

    const data = await res.json();
    if (res.ok) navigate(`/video/${data.room._id}`);
    else alert(data.message);
  };

  return (
    <div className="flex flex-col h-full bg-gray-100">
      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-2">
        {messages.map((m) => {
          const isMe =
            String(m.senderId) === String(userId);

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

      {/* Message input */}
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
          onKeyDown={(e) =>
            e.key === "Enter" && sendMessage()
          }
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
