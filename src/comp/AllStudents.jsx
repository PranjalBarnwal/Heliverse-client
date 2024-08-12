import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { headerEP } from "@/constants";
import { UserPen } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

export const AllStudents = () => {
  const [students, setStudents] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editEmail, setEditEmail] = useState("");
  const [editName, setEditName] = useState("");
  const [selectedClass, setSelectedClass] = useState({});
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const navigate=useNavigate();
  const token = useSelector((state) => state.user.token);
  const profile = useSelector((state) => state.user.profile);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${headerEP}/account/student`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch students");
      }

      const result = await response.json();
      setStudents(result.data);
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
    }
  };

  useEffect(() => {
    if(profile.toLowerCase() != "PRINCIPAL".toLowerCase()){
      alert("Unauthorised access, Login as Principal to access");
      navigate("/signin");
    }
    fetchStudents();
    fetchClassrooms();
  }, []);

  const handleSaveChanges = async (id) => {
    try {
      let updateBody = {};
      updateBody.id = id;
      if (editName) updateBody.name = editName;
      if (editEmail) updateBody.email = editEmail;

      const response = await fetch(`${headerEP}/account/update`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateBody),
      });

      if (!response.ok) {
        throw new Error("Failed to update student");
      }

      const updatedStudent = await response.json();
      // console.log(updatedStudent);
      fetchStudents();
      alert("Student updated successfully");
      setEditEmail("");
      setEditName("");
    } catch (error) {
      setError(error.message);
    }
  };

  const handleAssignClass = async (studentId) => {
    try {
      const response = await fetch(`${headerEP}/assign/student`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentID: studentId,
          classID: selectedClass[studentId],
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to assign student to class");
      }

      fetchStudents();
      fetchClassrooms();
      setSelectedClass((prev) => ({ ...prev, [studentId]: "" }));
      alert("Student assigned to class successfully");
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${headerEP}/account/student/delete`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: id }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete student");
      }

      setStudents((prevStudents) =>
        prevStudents.filter((student) => student.id !== id)
      );
    } catch (error) {
      setError(error.message);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[20vw]">Student Id</TableHead>
            <TableHead className="w-[20vw]">Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Class</TableHead>
            <TableHead>Edit</TableHead>
            <TableHead>Assign Class</TableHead>
            <TableHead>Delete</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map((student) => (
            <TableRow key={student.id}>
              <TableCell className="font-medium">{student.id}</TableCell>
              <TableCell>{student.name}</TableCell>
              <TableCell>{student.email}</TableCell>
              <TableCell>
                {student.classroom ? student.classroom.name : "N/A"}
              </TableCell>
              <TableCell>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <UserPen className="cursor-pointer" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Edit profile</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                          Name
                        </Label>
                        <Input
                          id="name"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-right">
                          Email
                        </Label>
                        <Input
                          type="email"
                          id="email"
                          value={editEmail}
                          onChange={(e) => setEditEmail(e.target.value)}
                          className="col-span-3"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        type="submit"
                        onClick={() => handleSaveChanges(student.id)}
                      >
                        Save changes
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </TableCell>
              <TableCell>
                <Select
                  value={selectedClass[student.id] || ""}
                  onValueChange={(value) => setSelectedClass((prev) => ({ ...prev, [student.id]: value }))}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Assign Class" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Classrooms</SelectLabel>
                      {classrooms.map((classroom) => (
                        <SelectItem key={classroom.id} value={classroom.id}>
                          {classroom.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  onClick={() => handleAssignClass(student.id)}
                >
                  Assign
                </Button>
              </TableCell>
              <TableCell>
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(student.id)}
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
