import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../../components/common/Nav";
import Footer from "../../components/common/Footer";
import Chat from "../../components/chat/Chat";
import API from "../../api/axios";

const Room = () => {
  const { id } = useParams(); // appointmentId
  const navigate = useNavigate();

  const startVideoCall = async () => {
    try {
      const res = await API.post("/rooms", { appointmentId: id });
      navigate(`/video/${res.data.room._id}`);
    } catch {
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
