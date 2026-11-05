import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../lib/api";

export default function AllTests() {
  const [tests, setTests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { studentId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTests = async () => {
      try {
        setIsLoading(true);
        const [res1, res2, res3] = await Promise.all([
          api.get("/tests/questions/PHQ-9"),
          api.get("/tests/questions/GAD-7"),
          api.get("/tests/questions/GHQ-12")
        ]);
        
        setTests([
          { type: "PHQ-9", name: "PHQ-9 Depression Assessment", questions: res1.data.questions, color: "blue" },
          { type: "GAD-7", name: "GAD-7 Anxiety Assessment", questions: res2.data.questions, color: "teal" },
          { type: "GHQ-12", name: "GHQ-12 General Health", questions: res3.data.questions, color: "indigo" }
        ]);
      } catch (error) {
        console.error("Error fetching tests:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTests();
  }, []);

  const getTestColor = (color) => {
    const colorClasses = {
      blue: {
        bg: "bg-blue-50",
        border: "border-blue-200",
        text: "text-blue-800",
        hover: "hover:bg-blue-100",
        gradient: "from-blue-100 to-blue-50"
      },
      teal: {
        bg: "bg-teal-50",
        border: "border-teal-200",
        text: "text-teal-800",
        hover: "hover:bg-teal-100",
        gradient: "from-teal-100 to-teal-50"
      },
      indigo: {
        bg: "bg-indigo-50",
        border: "border-indigo-200",
        text: "text-indigo-800",
        hover: "hover:bg-indigo-100",
        gradient: "from-indigo-100 to-indigo-50"
      }
    };
    return colorClasses[color] || colorClasses.blue;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 bg-blue-400 rounded-full mb-4"></div>
          <p className="text-blue-600 font-medium">Loading assessments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10 animate-fade-in">
          <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-600 mb-3">
            Mental Health Assessments
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Select an assessment to evaluate your mental well-being. These tools help identify areas where you might need support.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tests.map((test, index) => {
            const color = getTestColor(test.color);
            return (
              <div 
                key={test.type} 
                className={`bg-white rounded-2xl shadow-sm overflow-hidden border ${color.border} transition-all duration-300 hover:shadow-md hover:-translate-y-1 cursor-pointer animate-fade-in`}
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => navigate(`/student/${studentId}/tests/${test.type}`)}
              >
                <div className={`h-2 bg-gradient-to-r from-${test.color}-400 to-${test.color}-600`}></div>
                
                <div className="p-6">
                  <div className={`w-14 h-14 ${color.bg} rounded-full flex items-center justify-center mb-4`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-7 w-7 ${color.text}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  
                  <h2 className="text-xl font-bold text-gray-800 mb-2">{test.type}</h2>
                  <p className="text-gray-600 mb-4">{test.name}</p>
                  
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center text-sm text-gray-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      {test.questions.length} questions
                    </span>
                    
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${color.bg} ${color.text}`}>
                      {test.questions.length <= 12 ? "Quick" : "Standard"}
                    </span>
                  </div>
                </div>
                
                <div className={`px-6 py-3 ${color.bg} ${color.hover} transition-colors duration-200 flex items-center justify-between`}>
                  <span className="text-sm font-medium">Start Assessment</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 bg-blue-50 rounded-2xl p-6 border border-blue-200 max-w-3xl mx-auto">
          <h3 className="text-lg font-semibold text-blue-800 mb-3 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            About These Assessments
          </h3>
          <p className="text-blue-700 text-sm">
            These standardized assessments are designed to help you understand your mental well-being. 
            Your responses are confidential and will be used to provide personalized recommendations.
          </p>
        </div>
      </div>

      {/* Add custom animations */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in {
            animation: fadeIn 0.6s ease-out forwards;
          }
        `}
      </style>
    </div>
  );
}