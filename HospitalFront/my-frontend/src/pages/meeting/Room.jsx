import { useParams, useNavigate } from "react-router-dom";
import API from "../../api/axios";
import Chat from "../../components/chat/Chat";

const Room = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const startVideoCall = async () => {
    const auth = JSON.parse(localStorage.getItem("auth"));

    const res = await API.post(
      "/rooms",
      { appointmentId: id },
      {
        headers: { Authorization: `Bearer ${auth.token}` },
      }
    );

    navigate(`/video/${res.data.room._id}`);
  };

  return (
    <>
      {/* Navbar unchanged */}
      <Chat appointmentId={id} />
      {/* Footer unchanged */}
    </>
  );
};

export default Room;
