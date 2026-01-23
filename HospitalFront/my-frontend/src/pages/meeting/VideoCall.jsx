import { useParams } from "react-router-dom";
import VideoCallComponent from "../../components/video/VideoCall";
import Navbar from "../../components/common/Nav";
import Footer from "../../components/common/Footer";

export default function VideoCall() {
  const { id } = useParams(); // roomId comes from URL

  return (
    <>
      <Navbar />
      <VideoCallComponent roomId={id} />
      <Footer />
    </>
  );
}
