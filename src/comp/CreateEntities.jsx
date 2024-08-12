import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useSelector } from "react-redux";
import { headerEP } from "@/constants";
import { useNavigate } from "react-router-dom";
const CreateEntities = () => {
  const navigate = useNavigate();
  const [entityType, setEntityType] = useState("class");
  const [className, setClassName] = useState("");
  const [teacherName, setTeacherName] = useState("");
  const [teacherEmail, setTeacherEmail] = useState("");
  const [teacherPassword, setTeacherPassword] = useState("");
  const [studentName, setStudentName] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [studentPassword, setStudentPassword] = useState("");

  const token = useSelector((state) => state.user.token);
  const profile = useSelector((state) => state.user.profile);
  useEffect(() => {
    if (profile.toLowerCase() == "STUDENT".toLowerCase()) {
      alert("Unauthorised access, Login as Principal to access");
      navigate("/signin");
    }
  }, []);
  const handleCreateClass = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${headerEP}/account/classroom`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: className }),
      });

      if (!response.ok) {
        throw new Error("Failed to create class");
      }
      alert("Class created successfully");
      setClassName("");
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  const handleCreateTeacher = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${headerEP}/account/teacher/signup`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: teacherName,
          email: teacherEmail,
          password: teacherPassword,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create teacher");
      }
      alert("Teacher created successfully");
      setTeacherName("");
      setTeacherEmail("");
      setTeacherPassword("");
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  const handleCreateStudent = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${headerEP}/account/student/signup`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: studentName,
          email: studentEmail,
          password: studentPassword,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create student");
      }
      alert("Student created successfully");
      setStudentName("");
      setStudentEmail("");
      setStudentPassword("");
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  return (
    <div className="h-[90vh] w-[90vw] flex justify-center items-center">
      <div className="space-y-6" onSubmit={(e) => e.preventDefault()}>
        <RadioGroup
          defaultValue=""
          onValueChange={setEntityType}
          className="flex space-x-4"
        >
          {profile.toLowerCase() === "principal" && (
            <>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="class" id="class" />
                <Label htmlFor="class">Create Class</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="teacher" id="teacher" />
                <Label htmlFor="teacher">Create Teacher</Label>
              </div>
             
            </>
          )}

          <div className="flex items-center space-x-2">
            <RadioGroupItem value="student" id="student" />
            <Label htmlFor="student">Create Student</Label>
          </div>
        </RadioGroup>

        {entityType === "class" && profile.toLowerCase() == "principal" && (
          <form action="" onSubmit={handleCreateClass}>
            <Card className="w-full max-w-sm">
              <CardHeader>
                <CardTitle className="text-2xl">Create Class</CardTitle>
                <CardDescription>
                  Enter the class name below to create a new class.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="className">Class Name</Label>
                  <Input
                    id="className"
                    value={className}
                    onChange={(e) => setClassName(e.target.value)}
                    placeholder="Enter class name"
                    required
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  onSubmit={(e) => handleCreateClass(e)}
                  type="submit"
                >
                  Create Class
                </Button>
              </CardFooter>
            </Card>
          </form>
        )}

        {entityType === "teacher" && (
          <form action="" onSubmit={handleCreateTeacher}>
            <Card className="w-full max-w-sm">
              <CardHeader>
                <CardTitle className="text-2xl">Create Teacher</CardTitle>
                <CardDescription>
                  Enter teacher details below to create a new teacher.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="teacherName">Teacher Name</Label>
                  <Input
                    id="teacherName"
                    value={teacherName}
                    onChange={(e) => setTeacherName(e.target.value)}
                    placeholder="Enter teacher name"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="teacherEmail">Teacher Email</Label>
                  <Input
                    id="teacherEmail"
                    type="email"
                    value={teacherEmail}
                    onChange={(e) => setTeacherEmail(e.target.value)}
                    placeholder="Enter teacher email"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="teacherPassword">Teacher Password</Label>
                  <Input
                    id="teacherPassword"
                    type="password"
                    value={teacherPassword}
                    onChange={(e) => setTeacherPassword(e.target.value)}
                    placeholder="Enter teacher password"
                    required
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  onSubmit={(e) => handleCreateTeacher(e)}
                  type="submit"
                >
                  Create Teacher
                </Button>
              </CardFooter>
            </Card>
          </form>
        )}

        {entityType === "student" && (
          <form action="" onSubmit={handleCreateStudent}>
            <Card className="w-full max-w-sm">
              <CardHeader>
                <CardTitle className="text-2xl">Create Student</CardTitle>
                <CardDescription>
                  Enter student details below to create a new student.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="studentName">Student Name</Label>
                  <Input
                    id="studentName"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="Enter student name"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="studentEmail">Student Email</Label>
                  <Input
                    id="studentEmail"
                    type="email"
                    value={studentEmail}
                    onChange={(e) => setStudentEmail(e.target.value)}
                    placeholder="Enter student email"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="studentPassword">Student Password</Label>
                  <Input
                    id="studentPassword"
                    type="password"
                    value={studentPassword}
                    onChange={(e) => setStudentPassword(e.target.value)}
                    placeholder="Enter student password"
                    required
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  onSubmit={(e) => handleCreateStudent(e)}
                  type="submit"
                >
                  Create Student
                </Button>
              </CardFooter>
            </Card>
          </form>
        )}

        {/* {entityType === "schedule" && (
          <form onSubmit={handleCreateSchedule}>
            <Card className="w-full max-w-sm">
              <CardHeader>
                <CardTitle className="text-2xl">Create Schedule</CardTitle>
                <CardDescription>
                  Enter schedule details below to create a new schedule.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="scheduleClassName">Class Name</Label>
                  <Input
                    id="scheduleClassName"
                    value={scheduleClassName}
                    onChange={(e) => setScheduleClassName(e.target.value)}
                    placeholder="Enter class name"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="scheduleDay">Day</Label>
                  <Input
                    id="scheduleDay"
                    value={scheduleDay}
                    onChange={(e) => setScheduleDay(e.target.value)}
                    placeholder="Enter day"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="scheduleStartTime">Start Time</Label>
                  <Input
                    id="scheduleStartTime"
                    type="time"
                    value={scheduleStartTime}
                    onChange={(e) => setScheduleStartTime(e.target.value)}
                    placeholder="Enter start time"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="scheduleEndTime">End Time</Label>
                  <Input
                    id="scheduleEndTime"
                    type="time"
                    value={scheduleEndTime}
                    onChange={(e) => setScheduleEndTime(e.target.value)}
                    placeholder="Enter end time"
                    required
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" type="submit">
                  Create Schedule
                </Button>
              </CardFooter>
            </Card>
          </form>
        )} */}
      </div>
    </div>
  );
};

export default CreateEntities;
