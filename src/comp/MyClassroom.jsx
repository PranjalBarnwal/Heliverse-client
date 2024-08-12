import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"; // Adjust the import according to Shadcn's documentation
import { headerEP } from "@/constants";

export const MyClassroom = () => {
  const [classroom, setClassroom] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchClassroom = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${headerEP}/classroom/teacher/${id}`);
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const data = await response.json();
        setClassroom(data);
        // console.log(data);
        
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchClassroom();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    classroom && (
      <div>
        <h1>Classroom Details</h1>
        <h2>{classroom.name}</h2>
        <p>
          <strong>Teacher:</strong> {classroom.teacher?.name}
        </p>

        <h3>Schedules:</h3>
        <Button>Add Lectures</Button>
        {classroom.schedules.length === 0 ? (
          <p>No schedules available.</p>
        ) : (
          classroom.schedules.map((schedule) => (
            <div key={schedule.id}>
              <h4>Schedule for {schedule.day}</h4>
              <Table>
                <TableCaption>Lectures for {schedule.day}</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Subject</TableHead>
                    <TableHead>Start Time</TableHead>
                    <TableHead>End Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {schedule.lectures.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan="3">No lectures available.</TableCell>
                    </TableRow>
                  ) : (
                    schedule.lectures.map((lecture) => (
                      <TableRow key={lecture.id}>
                        <TableCell className="font-medium">
                          {lecture.subject}
                        </TableCell>
                        <TableCell>
                          {new Date(lecture.startTime).toLocaleTimeString()}
                        </TableCell>
                        <TableCell>
                          {new Date(lecture.endTime).toLocaleTimeString()}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          ))
        )}
      </div>
    )
  );
};
