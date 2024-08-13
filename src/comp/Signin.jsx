import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addUser } from "@/slice/userSlice";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { headerEP } from "@/constants";
export function Signin() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [profile, setProfile] = useState("Principal");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleProfileChange = (value) => {
    setProfile(value);
  };
  const [loading, setLoading] = useState(false);
  useEffect(()=>{
    alert(
      "Note:- Sometimes the features can take time due to slow hostng . Please logout and login again if so happens or contact me on 8083696152"
    );
  },[])
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    let endpoint = "";

    switch (profile) {
      case "Principal":
        endpoint = `${headerEP}/account/principal/signin`;
        break;
      case "Teacher":
        endpoint = `${headerEP}/account/teacher/signin`;
        break;
      case "Student":
        endpoint = `${headerEP}/account/student/signin`;
        break;
      default:
        break;
    }

    try {
      // console.log(email, password);

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      // console.log(data);

      if (response.ok) {
        dispatch(
          addUser({ token: data.token, profile: data.role, id: data.userid })
        );
        navigate("/home");
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error("Error occurred at login", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[90vh] flex w-screen items-center justify-center">
      <form action="" onSubmit={(e) => handleLogin(e)}>
        <Card className="w-full max-w-sm ">
          <RadioGroup
            defaultValue="Principal"
            onValueChange={handleProfileChange}
            className="mt-5 flex justify-around"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Principal" id="option-one" />
              <Label htmlFor="option-one">Principal</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Teacher" id="option-two" />
              <Label htmlFor="option-two">Teacher</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Student" id="option-two" />
              <Label htmlFor="option-two">Student</Label>
            </div>
          </RadioGroup>
          <CardHeader>
            <CardTitle className="text-2xl">{profile} login</CardTitle>
            <CardDescription>
              Enter your email below to login to your account.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" type="submit" disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
