import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../lib/api";

export default function StudentList() {
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { counsellorId } = useParams();

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await api.get("/users/students");
        setStudents(res.data);
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStudents();
  }, []);

  // Add CSS animations directly in the component
  const styles = `
    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    .student-card {
      animation: fadeIn 0.5s ease-out forwards;
      opacity: 0;
    }
  `;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 py-8 px-4">
      {/* Add the styles to the document */}
      <style>{styles}</style>
      
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-teal-800 mb-8 text-center">
          Student Directory
        </h1>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-pulse flex flex-col items-center">
              <div className="rounded-full bg-teal-200 h-12 w-12 mb-4"></div>
              <div className="h-4 bg-teal-200 rounded w-32"></div>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            {students.map((student, index) => (
              <div
                key={student._id}
                className="student-card p-5 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer border border-teal-100 transform hover:-translate-y-1"
                style={{ 
                  transitionDelay: `${index * 50}ms`,
                  animationDelay: `${index * 0.1}s`
                }}
                onClick={() => navigate(`/counsellor/${counsellorId}/students/${student._id}/tests`)}
              >
                <div className="flex items-center">
                  <div className="flex-shrink-0 mr-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-teal-400 to-blue-400 flex items-center justify-center text-white font-bold text-lg">
                      {/* Safe access to fullName with fallback */}
                      {student.fullName ? student.fullName.charAt(0) : 'S'}
                    </div>
                  </div>
                  <div className="flex-grow">
                    <p className="font-bold text-teal-700 text-lg">
                      {student?.fullName || 'Unknown Student'}
                    </p>
                    <p className="text-gray-600">Email: {student.email || 'No email provided'}</p>
                  </div>
                  <div className="flex-shrink-0 text-teal-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}