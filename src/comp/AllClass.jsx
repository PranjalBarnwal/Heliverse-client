import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { headerEP } from "@/constants";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectLabel,
  SelectGroup,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
export const AllClassrooms = () => {
  const navigate=useNavigate();
  const [classrooms, setClassrooms] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTeachers, setSelectedTeachers] = useState({});
  const [error, setError] = useState(null);
  const token = useSelector((state) => state.user.token);
  const profile = useSelector((state) => state.user.profile);

  const fetchTeachers = async () => {
    try {
      const response = await fetch(`${headerEP}/account/teacher`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch teachers");
      }

      const result = await response.json();
      const filteredTeachers = result.teachers.filter(
        (teacher) => teacher.teaching === null
      );
      setTeachers(filteredTeachers);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchClassrooms = async () => {
    try {
      const response = await fetch(`${headerEP}/allclassrooms`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch classrooms");
      }

      const result = await response.json();
      setClassrooms(result.classrooms);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTeacherChange = (classID, teacherID) => {
    setSelectedTeachers((prev) => ({
      ...prev,
      [classID]: teacherID,
    }));
  };

  const handleSave = async (classID) => {
    const teacherID = selectedTeachers[classID];
    if (!teacherID) {
      alert("Please select a teacher");
      return;
    }

    try {
      const classroom = classrooms.find((c) => c.id === classID);
      if (classroom.teacher) {
        alert("Classroom already has a teacher assigned");
        return;
      }

      const response = await fetch(`${headerEP}/assign/teacher`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          teacherID,
          classID,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to assign teacher");
      }

      const result = await response.json();
      console.log(result.message);
      fetchTeachers();
      fetchClassrooms();
      setSelectedTeachers((prev) => ({
        ...prev,
        [classID]: "", // Clear the selection for the class after save
      }));
    } catch (error) {
      setError(error.message);
    }
  };
  const handleUnassign = async (classID) => {
    try {
      const response = await fetch(`${headerEP}/unassign/teacher`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          classID,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to unassign teacher");
      }

      const result = await response.json();
      console.log(result.message);
      fetchTeachers();
      fetchClassrooms();
      setSelectedTeachers((prev) => ({
        ...prev,
        [classID]: "", // Clear the selection after unassigning
      }));
    } catch (error) {
      setError(error.message);
    }
  };
  const handleDeleteClass = async (classID) => {
    try {
      const response = await fetch(`${headerEP}/account/classroom/delete`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ classroomId: classID }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete classroom");
      }

      alert("Classroom deleted successfully");
      fetchClassrooms();
      fetchTeachers();
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };
  useEffect(() => {
    if(profile.toLowerCase() != "PRINCIPAL".toLowerCase()){
      alert("Unauthorised access, Login as Principal to access");
      navigate("/signin");
    }
    fetchClassrooms();
    fetchTeachers();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[15vw]">Classroom Id</TableHead>
            <TableHead className="w-[15vw]">Classroom Name</TableHead>
            <TableHead className="w-[20vw]">Teacher Name</TableHead>
            <TableHead>Schedules</TableHead>
            <TableHead>Assign</TableHead>
            <TableHead>Delete</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {classrooms.map((classroom) => (
            <TableRow key={classroom.id}>
              <TableCell className="font-medium">{classroom.id}</TableCell>
              <TableCell>{classroom.name}</TableCell>
              <TableCell>
                {classroom.teacher
                  ? classroom.teacher.name
                  : "No Teacher Assigned"}
              </TableCell>

              <TableCell>
                {classroom.schedules.length > 0 ? (
                  classroom.schedules.map((schedule, index) => (
                    <div key={index}>
                      <p>{schedule.day}</p>
                      <p>{`Start: ${new Date(
                        schedule.startTime
                      ).toLocaleTimeString()}`}</p>
                      <p>{`End: ${new Date(
                        schedule.endTime
                      ).toLocaleTimeString()}`}</p>
                    </div>
                  ))
                ) : (
                  <p>No Schedules</p>
                )}
              </TableCell>
              <TableCell>
                {classroom.teacher ? (
                  <div className="flex items-center space-x-2">
                    <span>{classroom.teacher.name}</span>
                    <Button
                      variant="outline"
                      onClick={() => handleUnassign(classroom.id)}
                    >
                      Dissociate
                    </Button>
                  </div>
                ) : (
                  <Select
                    value={selectedTeachers[classroom.id] || ""}
                    onValueChange={(value) =>
                      handleTeacherChange(classroom.id, value)
                    }
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Assign" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Teachers</SelectLabel>
                        {teachers.map((teacher) => (
                          <SelectItem key={teacher.id} value={teacher.id}>
                            {teacher.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              </TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  onClick={() => handleSave(classroom.id)}
                >
                  Save
                </Button>
              </TableCell>
              <TableCell>
                <Button
                  variant="destructive"
                  onClick={()=>handleDeleteClass(classroom.id)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
