import { useEffect, useState } from "react";
import { createSocket } from "../../socket";

const Chat = ({ appointmentId }) => {
  const auth = JSON.parse(localStorage.getItem("auth"));
  const userId = auth?.user?._id;

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!appointmentId || !auth) return;

    const s = createSocket(auth);
    s.connect();
    setSocket(s);

    s.emit("joinRoom", { appointmentId });

    s.on("recentMessages", (msgs) => setMessages(msgs || []));
    s.on("newMessage", (msg) =>
      setMessages((prev) =>
        prev.some((m) => m._id === msg._id) ? prev : [...prev, msg]
      )
    );

    return () => {
      s.disconnect();
    };
  }, [appointmentId]);

  const sendMessage = () => {
    if (!text.trim()) return;

    socket.emit("sendMessage", {
      appointmentId,
      senderId: userId,
      senderRole: auth.user.role,
      text,
    });

    setText("");
  };

  return (
    <div className="flex flex-col h-full bg-gray-100">
      {/* UI unchanged */}
    </div>
  );
};

export default Chat;
