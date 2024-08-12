import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu";
import store from "@/store";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
export const Nav = () => {
  const profile = useSelector((store) => store.user.profile);
  const id = useSelector((store) => store.user.id);
  const navigate = useNavigate();
  return (
    <div className="flex justify-center w-screen">
      {profile.toLowerCase() === "PRINCIPAL".toLowerCase() && (
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger onClick={() => navigate("/allTeacher")}>
                Teachers
              </NavigationMenuTrigger>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger onClick={() => navigate("/allClassroom")}>
                Classroom
              </NavigationMenuTrigger>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger onClick={() => navigate("/allstudent")}>
                Students
              </NavigationMenuTrigger>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger onClick={() => navigate("/create")}>
                Create
              </NavigationMenuTrigger>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      )}
      {profile.toLowerCase() === "TEACHER".toLowerCase() && (
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger
                onClick={() => navigate(`/classroom/teacher/${id}`)}
              >
                Classroom
              </NavigationMenuTrigger>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger
                onClick={() => navigate(`/teacher/${teacherId}/students`)}
              >
                Students
              </NavigationMenuTrigger>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      )}
      {profile.toLowerCase() === "STUDENT".toLowerCase() && (
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger
                onClick={() => navigate(`/classroom/student/${id}`)}
              >
                Go to your classroom
              </NavigationMenuTrigger>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      )}
    </div>
  );
};
