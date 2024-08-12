import store from "@/store";
import React, { useEffect,useState } from "react";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useNavigate, useParams } from "react-router-dom";
import { headerEP } from "@/constants";
export const StudentClass = () => {
  const profile = useSelector((store) => store.user.profile);
  const navigate = useNavigate();
  const { id } = useParams();
  const [classroomDetails, setClassroomDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  useEffect(() => {
    if (profile.toLowerCase() != "STUDENT".toLowerCase()) {
      alert("Login as student");
      navigate("/signin");
    }

    const fetchClassroomDetails = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${headerEP}/classroom/student/${id}`);
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const data = await response.json();
        // console.log(data);
        
        setClassroomDetails(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchClassroomDetails();
  }, []);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    classroomDetails && (
      <div>
        <h1 className="text-3xl mb-5 underline">Classroom Details</h1>
        <h2 className="text-xl">Class Name: {classroomDetails.classroomName}</h2>
        <p className="text-xl mb-5">
          Teacher: {classroomDetails.teacherName || "N/A"}
        </p>

        <h3 className="text-2xl">Student List:</h3>
        {classroomDetails.students.length === 0 ? (
          <p>No students in this class.</p>
        ) : (
          <Table className="border-gray-600 border-[1px]">
            
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {classroomDetails.students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.email}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        <h3 className="text-2xl mb-5">Schedules:</h3>
        {classroomDetails.schedules.length === 0 ? (
          <p>No schedules available.</p>
        ) : (
          classroomDetails.schedules.map((schedule) => (
            <div key={schedule.id}>
              <h4>Schedule for {schedule.day}</h4>
              <Table className="border-gray-600 border-[1px]">
                
                <TableHeader>
                  <TableRow>
                    <TableHead>Start Time</TableHead>
                    <TableHead>End Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      {new Date(schedule.startTime).toLocaleTimeString()}
                    </TableCell>
                    <TableCell>
                      {new Date(schedule.endTime).toLocaleTimeString()}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          ))
        )}
      </div>
    )
  );
};
