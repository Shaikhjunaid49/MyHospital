import UserDashboardComponent   from "../../components/chat/UserDashboard";
import Navbar from "../../components/common/Nav";
import Footer  from "../../components/common/Footer";

export default function UserDashboard() {
  return (
    <>
    <Navbar />
    <UserDashboardComponent />
    <Footer />
    </>
  )
}