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
import { useNavigate,useParams } from "react-router-dom";

export const MyStudents = () => {
    const {id} = useParams();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editEmail, setEditEmail] = useState("");
  const [editName, setEditName] = useState("");
  
 
  const navigate=useNavigate();
  const token = useSelector((state) => state.user.token);
  const profile = useSelector((state) => state.user.profile);

  const fetchStudents = async (teacherId) => {
    try {
      setLoading(true);
      const response = await fetch(`${headerEP}/teacher/${teacherId}/students`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        throw new Error("Failed to fetch students for the classroom");
      }
  
      const students = await response.json();
      setStudents(students);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    if(profile.toLowerCase() != "TEACHER".toLowerCase()){
      alert("Unauthorised access, Login as Teacher to access");
      navigate("/signin");
    }
    fetchStudents(id);
    
  }, []);

  const handleSaveChanges = async (studentId) => {
    try {
      let updateBody = {};
      updateBody.id = studentId;
      if (editName) updateBody.name = editName;
      if (editEmail) updateBody.email = editEmail;

      const response = await fetch(`${headerEP}/account/update/student`, {
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
    //   console.log(updatedStudent);
      fetchStudents(id);
      alert("Student updated successfully");
      setEditEmail("");
      setEditName("");
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
            <TableHead className="w-[20vw]">S.No</TableHead>
            <TableHead className="w-[20vw]">Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Class</TableHead>
            <TableHead>Edit</TableHead>
            
            <TableHead>Delete</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map((student,index) => (
            <TableRow key={student.id}>
              <TableCell className="font-medium">{index+1}</TableCell>
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
