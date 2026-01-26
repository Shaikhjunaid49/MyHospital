import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../../components/common/Nav";
import Footer from "../../components/common/Footer";
import Chat from "../../components/chat/Chat";
import API from "../../api/axios";

const Room = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const startVideoCall = async () => {
    const auth = JSON.parse(localStorage.getItem("auth"));

    try {
      const res = await API.post(
        "/api/rooms",
        { appointmentId: id },
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );

      navigate(`/video/${res.data.room._id}`);
    } catch {
      alert("Server error while starting video call");
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-[calc(100vh-120px)] flex flex-col">
        <div className="p-4 bg-white border-b flex justify-end">
          <button
            onClick={startVideoCall}
            className="bg-green-600 text-white px-5 py-2 rounded-lg"
          >
            🎥 Start Video Call
          </button>
        </div>

        <Chat appointmentId={id} />
      </div>

      <Footer />
    </>
  );
};

export default Room;
