import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { createAppointment } from "../../api/appointments";
import { getServiceById } from "../../api/services";

export default function BookAppointment() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [service, setService] = useState(null);
    const [form, setForm] = useState({
        date: "",
        time: "",
        notes: ""
    });

    useEffect(() => {
        loadService();
    }, []);

    const loadService = async () => {
        const { data } = await getServiceById(id);
        setService(data.service);
    };

    const handleBook = async (e) => {
        e.preventDefault();
        try {
            await createAppointment({
                serviceId: id,
                date: form.date,
                time: form.time,
                notes: form.notes,
            });

            alert("Appointment created successfully!");
            navigate("/user/appointments");
        } catch (err) {
            alert("Failed to create appointment");
        }
    };

    return (
        <form className="p-6 max-w-md mx-auto" onSubmit={handleBook}>
            <h2 className="text-xl font-bold mb-4">Book Appointment</h2>

            {service && <p className="font-semibold mb-2">{service.name}</p>}

            <input
                type="date"
                className="border w-full p-2 mb-3"
                onChange={(e) => setForm({ ...form, date: e.target.value })}
            />
            <input
                type="time"
                className="border w-full p-2 mb-3"
                onChange={(e) => setForm({ ...form, time: e.target.value })}
            />
            <textarea
                className="border w-full p-2 mb-3"
                placeholder="Notes"
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
            <button className="bg-green-600 text-white w-full p-3 rounded">
                Book Now
            </button>
        </form>
    );
}