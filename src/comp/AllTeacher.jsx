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
import { useNavigate } from "react-router-dom";
export const AllTeacher = () => {
  const navigate=useNavigate();
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editEmail, setEditEmail] = useState(null);
  const [editPassword, setEditPassword] = useState(null);
  const [editName, setEditName] = useState(null);
  const token = useSelector((state) => state.user.token);
  const profile = useSelector((state) => state.user.profile);
  const fetchTeachers = async () => {
    try {
        setLoading(true);
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
      setTeachers(result.teachers);
      // console.log(result);
      
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if(profile.toLowerCase()!="PRINCIPAL".toLowerCase()){
      alert("Unauthorised access, Login as Principal to access");
      navigate("/signin");
    }
    fetchTeachers();
  }, []);

  const handleSaveChanges = async (id) => {
    try {
      let updateBody = {};
      updateBody.id = id;
      if (editName) updateBody.name = editName;
      if (editPassword) updateBody.password = editPassword;
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
        throw new Error("Failed to update teacher");
      }
      const updatedTeacher = await response.json();
      // console.log(updatedTeacher);

      fetchTeachers();
      if(updateBody?.name !=null || updateBody?.password!=null || updateBody?.email!=null)
      alert("Teacher updated successfully");
      setEditEmail(null);
      setEditName(null);
      setEditPassword(null);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${headerEP}/account/teacher/delete`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: id }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete teacher");
      }

      setTeachers((prevTeachers) =>
        prevTeachers.filter((teacher) => teacher.id !== id)
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
            <TableHead className="w-[20vw]">Teacher Id</TableHead>
            <TableHead className="w-[20vw]">Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Class</TableHead>
            <TableHead>Edit</TableHead>
            <TableHead>Delete</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {teachers.map((teacher) => (
            <TableRow key={teacher.id}>
              <TableCell className="font-medium">{teacher.id}</TableCell>
              <TableCell>{teacher.name}</TableCell>
              <TableCell>{teacher.email}</TableCell>
              <TableCell>
                {teacher.teaching ? teacher.teaching.name : "N/A"}
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
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="password" className="text-right">
                          Password
                        </Label>
                        <Input
                          type="password"
                          id="password"
                          value={editPassword}
                          onChange={(e) => setEditPassword(e.target.value)}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        type="submit"
                        onClick={() => handleSaveChanges(teacher.id)}
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
                  onClick={() => handleDelete(teacher.id)}
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
