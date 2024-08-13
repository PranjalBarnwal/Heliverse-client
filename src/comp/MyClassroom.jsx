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
} from "@/components/ui/table";
import { Label } from "@radix-ui/react-dropdown-menu";
import { useSelector } from "react-redux";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";

import { headerEP } from "@/constants";
import { Input } from "@/components/ui/input";

export const MyClassroom = () => {
  const [startTime, setStartTime] = useState();
  const [endTime, setEndTime] = useState();
  const [subject, setSubject] = useState();
  const [classroom, setClassroom] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const token = useSelector((store) => store.user.token);
  useEffect(() => {
    // alert("The optional feature of adding lectures is working on my local but the hosting render.com is causing issues.It will be solved asap")
    fetchClassroom();
  }, [id]);

  const fetchClassroom = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${headerEP}/classroom/teacher/${id}`);
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const data = await response.json();
      setClassroom(data);
      console.log(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  const handleAddLecture = async (e, id) => {
    e.preventDefault();

    let obj = {};
    obj.scheduleId = id;
    // const today = new Date().toISOString().split("T")[0];
    if (subject) obj.subject = subject;
    if (startTime) obj.startTime = startTime;
    if (endTime) obj.endTime = endTime;

    console.log(obj);

    try {
      const response = await fetch(`${headerEP}/account/add/lecture`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(obj),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Lecture added successfully:", data);
        fetchClassroom();
      } else {
        alert("Error adding lecture:", data.message);
      }
    } catch (error) {
      console.error("Error occurred during the request:", error);
    }
  };
  const handleRemoveLectures = async (lectureId) => {
    try {
      const response = await fetch(`${headerEP}/account/remove/lecture`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id: lectureId }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Lecture removed successfully:", data);
        fetchClassroom();
      } else {
        alert("Error removing lecture:", data.message);
      }
    } catch (error) {
      console.error("Error occurred during the request:", error);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    classroom && (
      <div>
        <h1 className="w-screen text-center text-3xl underline m-5">Classroom Details-{classroom.name}</h1>
        

        {classroom.schedules.length === 0 ? (
          <p>No schedules available.</p>
        ) : (
          classroom.schedules.map((schedule) => (
            <div className="border-gray-600 border-[2px]" key={schedule.id}>
              <h4 className="underline">Schedule for {schedule.day}</h4>

              <Table>
                <TableCaption>Overview of {schedule.day}</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Day</TableHead>
                    <TableHead>Start Time</TableHead>
                    <TableHead>End Time</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">
                      {schedule.day}
                    </TableCell>
                    <TableCell>
                      {schedule.startTime}
                    </TableCell>
                    <TableCell>
                      {schedule.endTime}
                    </TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline">Add lectures</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <form
                            action=""
                            onSubmit={(e) => handleAddLecture(e, schedule.id)}
                          >
                            <DialogHeader></DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="name" className="text-right">
                                  Lecture Name
                                </Label>
                                <Input
                                  id="name"
                                  className="col-span-3"
                                  value={subject}
                                  onChange={(e) => setSubject(e.target.value)}
                                  required
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label
                                  htmlFor="startTime"
                                  className="text-right"
                                >
                                  Start time
                                </Label>
                                <Input
                                  id="startTime"
                                  type="time"
                                  value={startTime}
                                  onChange={(e) => setStartTime(e.target.value)}
                                  required
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="endTime" className="text-right">
                                  End time
                                </Label>
                                <Input
                                  id="endTime"
                                  type="time"
                                  value={endTime}
                                  onChange={(e) => setEndTime(e.target.value)}
                                  required
                                />
                              </div>
                            </div>
                            <DialogFooter>
                              <Button type="submit">Add</Button>
                            </DialogFooter>
                          </form>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>

              <Table className="mt-4">
                <TableCaption>Lectures for {schedule.day}</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Subject</TableHead>
                    <TableHead>Start Time</TableHead>
                    <TableHead>End Time</TableHead>
                    <TableHead>Remove</TableHead>
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
                          {lecture.startTime}
                        </TableCell>
                        <TableCell>
                          {lecture.endTime}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="destructive"
                            onClick={()=>handleRemoveLectures(lecture.id)}
                          >
                            Remove
                          </Button>
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
