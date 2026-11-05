import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { jsPDF } from "jspdf";
import api from "../../lib/api";

export default function ReportView() {
  const { studentId, testId } = useParams();
  const [test, setTest] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [studentName, setStudentName] = useState("Student");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch test data
        const testRes = await api.get(`/tests/results/${studentId}/${testId}`);
        
        if (testRes.data) {
          setTest(testRes.data);
          
          // Try to fetch student name, but handle if the endpoint doesn't exist
          try {
            const studentRes = await api.get(`/users/${studentId}`);
            if (studentRes.data && studentRes.data.fullName) {
              setStudentName(studentRes.data.fullName);
            }
          } catch (studentError) {
            console.warn("Could not fetch student details, using fallback");
            // If we can't get the student name, we'll just use "Student"
          }
        } else {
          setTest(null);
        }
      } catch (error) {
        console.error("Error fetching test data:", error);
        setTest(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [studentId, testId]);

  const downloadPDF = () => {
    if (!test) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    let y = margin;

    // Add header with gradient background
    doc.setFillColor(79, 70, 229);
    doc.rect(0, 0, pageWidth, 30, 'F');
    doc.setFontSize(16);
    doc.setTextColor(255, 255, 255);
    doc.text("MENTAL HEALTH ASSESSMENT REPORT", pageWidth / 2, 18, { align: "center" });

    // Reset text color
    doc.setTextColor(0, 0, 0);
    y = 40;

    // Add test information
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text(`${formatTestType(test.testType)} Assessment Report`, margin, y);
    
    doc.setFontSize(11);
    doc.setFont(undefined, 'normal');
    y += 10;
    doc.text(`Student ID: ${studentId}`, margin, y);
    y += 7;
    doc.text(`Date: ${new Date(test.createdAt).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })}`, margin, y);
    
    y += 15;
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, y, pageWidth - margin, y);
    
    y += 10;
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text("Assessment Results", margin, y);
    
    y += 8;
    doc.setFont(undefined, 'normal');
    doc.text(`Score: ${test.score || "N/A"}`, margin, y);
    y += 7;
    doc.text(`Severity: ${test.severity || "Not specified"}`, margin, y);
    
    y += 12;
    doc.setFont(undefined, 'bold');
    doc.text("Recommendations:", margin, y);
    y += 8;
    doc.setFont(undefined, 'normal');
    
    // Split recommendation into multiple lines if needed
    const splitText = doc.splitTextToSize(test.recommendation || "No specific recommendations provided.", pageWidth - 2 * margin);
    doc.text(splitText, margin, y);
    y += splitText.length * 7 + 10;
    
    // Check if we need a new page
    if (y > 240) {
      doc.addPage();
      y = margin;
    }
    
    doc.setFont(undefined, 'bold');
    doc.text("Question Responses:", margin, y);
    y += 8;
    
    // Add answers
    doc.setFont(undefined, 'normal');
    test.answers.forEach((ans, idx) => {
      if (y > 270) {
        doc.addPage();
        y = margin;
      }
      
      doc.setFontSize(10);
      doc.text(`Q${idx + 1}:`, margin, y);
      const answerText = doc.splitTextToSize(ans || "No response", pageWidth - margin - 30);
      doc.text(answerText, margin + 15, y);
      y += answerText.length * 5 + 5;
    });
    
    // Add footer
    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text(`Page ${i} of ${totalPages}`, pageWidth / 2, doc.internal.pageSize.getHeight() - 10, { align: "center" });
      doc.text(`Report generated on ${new Date().toLocaleDateString()}`, pageWidth / 2, doc.internal.pageSize.getHeight() - 5, { align: "center" });
    }

    doc.save(`${test.testType}_Report_${studentId}.pdf`);
  };

  const formatTestType = (testType) => {
    return testType
      ?.replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      || "Assessment";
  };

  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case "mild": return "text-green-600 bg-green-100";
      case "moderate": return "text-yellow-600 bg-yellow-100";
      case "severe": return "text-red-600 bg-red-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-indigo-700">Loading assessment report...</p>
        </div>
      </div>
    );
  }

  if (!test) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-sm p-8 text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Report Not Found</h3>
          <p className="text-gray-500">The requested assessment report could not be loaded.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm overflow-hidden">
        {/* Report Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white p-6">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            {formatTestType(test.testType)} Assessment Report
          </h1>
          <div className="flex flex-wrap gap-4 text-sm">
            <div>
              <span className="font-semibold">Student ID:</span> {studentId}
            </div>
            <div>
              <span className="font-semibold">Date:</span> {new Date(test.createdAt).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
          </div>
        </div>
        
        {/* Results Section */}
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-indigo-800 mb-4">Assessment Results</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-sm text-blue-600 font-medium mb-1">Score</div>
              <div className="text-2xl font-bold text-blue-800">{test.score || "N/A"}</div>
            </div>
            <div className="bg-indigo-50 p-4 rounded-lg">
              <div className="text-sm text-indigo-600 font-medium mb-1">Severity Level</div>
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${getSeverityColor(test.severity)}`}>
                {test.severity || "Not specified"}
              </div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-sm text-purple-600 font-medium mb-1">Questions Answered</div>
              <div className="text-2xl font-bold text-purple-800">{test.answers?.length || 0}</div>
            </div>
          </div>
        </div>
        
        {/* Recommendations Section */}
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-indigo-800 mb-4">Recommendations</h2>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-green-800">{test.recommendation || "No specific recommendations provided."}</p>
          </div>
        </div>
        
        {/* Answers Section */}
        <div className="p-6">
          <h2 className="text-xl font-semibold text-indigo-800 mb-4">Question Responses</h2>
          <div className="space-y-4">
            {test.answers?.map((ans, idx) => (
              <div key={idx} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-start">
                  <span className="flex-shrink-0 w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-semibold mr-3">
                    {idx + 1}
                  </span>
                  <p className="text-gray-700">{ans || "No response provided"}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Action Section */}
        <div className="p-6 bg-gray-50 flex justify-center">
          <button
            onClick={downloadPDF}
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download PDF Report
          </button>
        </div>
      </div>
    </div>
  );
}