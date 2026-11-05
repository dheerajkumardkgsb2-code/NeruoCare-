import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api, { axiosInstance } from "../../lib/api.js";
import SlotCard from "../../components/SlotCard.jsx";

export default function AvailableSlots() {
  const { studentId } = useParams(); // Get studentId directly from URL
  const [student, setStudent] = useState(null);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookingSlot, setBookingSlot] = useState(null);

  // Fetch both student and slots data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch student data
        const studentResponse = await axiosInstance.get(`/students/${studentId}`);
        setStudent(studentResponse.data);
        
        // Fetch slots data
        const slotsResponse = await axiosInstance.get("/slots");
        setSlots(slotsResponse.data);
        
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data. Please refresh the page.");
      } finally {
        setLoading(false);
      }
    };

    if (studentId) {
      fetchData();
    }
  }, [studentId]);

  const bookSlot = async (slot) => {
    if (!student?.fullName || !student?.email) {
      alert("Student information is incomplete. Please refresh the page and try again.");
      return;
    }

    if (slot.isBooked) {
      alert("This slot is already booked. Please choose another slot.");
      return;
    }

    setBookingSlot(slot._id);

    try {
      const bookingData = {
        slotId: slot._id,
        studentName: student?.fullName,
        studentEmail: student.email
      };

      if (student._id) {
        bookingData.studentId = student._id;
      }

      console.log("Booking slot with data:", bookingData);
      
      const response = await axiosInstance.post("/appointments", bookingData);
      console.log("Booking response:", response.data);

      // Update UI
      setSlots(slots.map(s =>
        s._id === slot._id ? { 
          ...s, 
          isBooked: true, 
          bookedBy: student?.fullName,
          bookedAt: new Date().toISOString()
        } : s
      ));
      
      alert(`Slot booked successfully for ${student.name}!\nDate: ${slot.date}\nTime: ${slot.time}`);
    } catch (error) {
      console.error("Booking error:", error);
      
      let errorMessage = "Failed to book slot. Please try again.";
      
      if (error.response) {
        errorMessage = error.response.data?.message || `Server error: ${error.response.status}`;
      } else if (error.request) {
        errorMessage = "Network error. Please check your connection.";
      }
      
      alert(errorMessage);
    } finally {
      setBookingSlot(null);
    }
  };

  if (loading) {
    return (
      <div className="p-4 flex items-center justify-center min-h-[200px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mx-auto mb-3"></div>
          <p className="text-gray-700">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error Loading Data</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="p-4 text-center">
        <p>Student data not found. Please check the URL.</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Available Counseling Sessions</h1>
        <p className="text-gray-600">Hello {student?.fullName}, book a counseling session that works for you.</p>
      </div>
      
      {slots.length === 0 ? (
        <div className="text-center py-8">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4m-6 0v1m0 0v8a2 2 0 002 2h4a2 2 0 002-2V8m0 0V7" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No available slots</h3>
          <p className="mt-1 text-sm text-gray-500">No counseling sessions are available at the moment. Please check back later.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {slots.map(slot => (
            <SlotCard
              key={slot._id}
              slot={slot}
              onAction={bookSlot}
              actionLabel={bookingSlot === slot._id ? "Booking..." : "Book Slot"}
              disabled={slot.isBooked || bookingSlot === slot._id}
            />
          ))}
        </div>
      )}
    </div>
  );
}