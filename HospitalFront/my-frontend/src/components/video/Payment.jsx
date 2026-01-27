const PaymentComponent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const appointmentId =
    location.state?.appointmentId ||
    searchParams.get("appointmentId");

  const amount =
    location.state?.amount ||
    searchParams.get("amount") ||
    500;

  const auth = JSON.parse(localStorage.getItem("auth"));

  if (!appointmentId) {
    return <p>Invalid payment session</p>;
  }

  if (!auth || !auth.token) {
    return <p>Session expired. Please login again.</p>;
  }

  const skipPayment = async () => {
    try {
      await API.post(
        "/payments/skip",
        { appointmentId, amount },
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );

      alert("Payment successful");
      navigate("/dashboard");
    } catch (err) {
      console.error(err.response?.data);
      alert(err.response?.data?.message || "Payment server error");
    }
  };

  return (
    <button onClick={skipPayment}>
      Pay Securely
    </button>
  );
};
