import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export const Home = () => {
  const navigate = useNavigate();
  const token = useSelector((state) => state.user.token);

  useEffect(() => {
    if (!token || token.trim() === "") {
      navigate("/signin");
    }

    alert("Note:- Sometimes the features can take time due to slow hostng . Please logout and login again if so happens or contact me on 8083696152")
  }, []);

  return (
    <div className="ml-10">
      
      <h1 className="text-3xl underline mb-2">Features</h1>
      <p>
        <strong>Principal</strong>
      </p>
      <ul className="list-disc">
        <li>Principal can create profiles of students and teachers </li>
        <li>See the list of Teachers and Students in table form.</li>
        <li>
          Principal can change the details of Students and Teachers or delete
          them as well.
        </li>
        <li>Can Create a Classroom.</li>
        <li>
          Assign a classroom to a teacher (Note: A teacher can only be assigned
          to one classroom).
        </li>
      </ul>

      <p>
        <strong>Teacher</strong>
      </p>
      <ul  className="list-disc">
        <li>See the list of Students in their classroom in table form.</li>
        <li>
          Teacher can change the details of Students or delete them as well.
        </li>
      </ul>

      <p>
        <strong>Student</strong>
      </p>
      <ul  className="list-disc">
        <li>They can see other students in the classroom.</li>
      </ul>

      <div>
        <p>Project github links</p>
        <p>
          Client -{" "}
          <a
            className="underline"
            href="https://github.com/PranjalBarnwal/Heliverse-client"
          >
            Link
          </a>{" "}
        </p>
        <p>
          Server -{" "}
          <a
            className="underline"
            href="https://github.com/PranjalBarnwal/Heliverse-Assignment-Server"
          >
            Link
          </a>{" "}
        </p>
      </div>

      <div>
        <p>My profile</p>
        <p>
          Linkedin -{" "}
          <a
            className="underline"
            href="https://www.linkedin.com/in/pranjal-barnwal-dev/"
          >
            Link
          </a>{" "}
        </p>
      </div>
    </div>
  );
};
