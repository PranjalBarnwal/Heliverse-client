import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { headerEP } from '@/constants';
export const MyClassroom = () => {
  const [classroom, setClassroom] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const {id} = useParams();

  useEffect(() => {
    const fetchClassroom = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${headerEP}/classroom/teacher/${id}`);
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const data = await response.json();
        console.log(data);
        
        setClassroom(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchClassroom();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
    Hello
    </>
    // <div>
    //   <h1>Classroom Details</h1>
    //   <h2>{classroom.name}</h2>
    //   <p><strong>Teacher:</strong> {classroom.teacher?.name}</p>

    //   <h3>Schedules:</h3>
    //   {classroom.schedules.length === 0 ? (
    //     <p>No schedules available.</p>
    //   ) : (
    //     classroom.schedules.map(schedule => (
    //       <div key={schedule.id}>
    //         <h4>Schedule for {schedule.day}</h4>
    //         <p><strong>Start Time:</strong> {new Date(schedule.startTime).toLocaleTimeString()}</p>
    //         <p><strong>End Time:</strong> {new Date(schedule.endTime).toLocaleTimeString()}</p>

    //         <h5>Lectures:</h5>
    //         {schedule.lectures.length === 0 ? (
    //           <p>No lectures available.</p>
    //         ) : (
    //           <ul>
    //             {schedule.lectures.map(lecture => (
    //               <li key={lecture.id}>
    //                 <p><strong>Subject:</strong> {lecture.subject}</p>
    //                 <p><strong>Start Time:</strong> {new Date(lecture.startTime).toLocaleTimeString()}</p>
    //                 <p><strong>End Time:</strong> {new Date(lecture.endTime).toLocaleTimeString()}</p>
    //               </li>
    //             ))}
    //           </ul>
    //         )}
    //       </div>
    //     ))
    //   )}
    // </div>
  );
};
