
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../../components/common/Nav";
import Footer from "../../components/common/Footer";
import Chat from "../../components/chat/Chat";

const Room = () => {
  const { id } = useParams(); // appointmentId
  const navigate = useNavigate();

  const startVideoCall = async () => {
    const auth = JSON.parse(localStorage.getItem("auth"));

    try {
      // 1️⃣ Create / get video room from backend
      const res = await fetch("http://localhost:8080/api/rooms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
        body: JSON.stringify({ appointmentId: id }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Cannot start video call");
        return;
      }

      // 2️⃣ Navigate to video page
      navigate(`/video/${data.room._id}`);
    } catch (err) {
      alert("Server error while starting video call");
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-[calc(100vh-120px)] flex flex-col">
        
        {/* 🔥 VIDEO CALL BAR */}
        <div className="p-4 bg-white border-b flex justify-end">
          <button
            onClick={startVideoCall}
            className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700"
          >
            🎥 Start Video Call
          </button>
        </div>

        {/* CHAT */}
        <Chat appointmentId={id} />
      </div>

      <Footer />
    </>
  );
};

export default Room;