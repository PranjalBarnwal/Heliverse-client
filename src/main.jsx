import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Signin } from './comp/Signin.jsx'
import { Provider } from 'react-redux'
import store from './store.js'
import { AllTeacher } from './comp/AllTeacher.jsx'
import { AllClassrooms } from './comp/AllClass.jsx'
import {
  createHashRouter,
  RouterProvider,
} from "react-router-dom";
import { Home } from './comp/Home.jsx'
import {AllStudents} from './comp/AllStudents.jsx'
import CreateEntities from './comp/CreateEntities.jsx'

const router = createHashRouter([
  {
    path: "/",
    element: <App />,
    // errorElement: <ErrorPage />,
    children: [
      {
        path: "signin",
        element: <Signin />,
      },
      {
        path: "home",
        element: <Home />,
      },
      {
        path: "allteacher",
        element: <AllTeacher />,
      },
      {
        path: "allstudent",
        element: <AllStudents />,
      },
      {
        path: "allclassroom",
        element: <AllClassrooms />,
      },
      {
        path: "create",
        element: <CreateEntities />,
      },
   
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>,
  </StrictMode>,
)
