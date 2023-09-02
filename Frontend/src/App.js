import "./App.css";
import Home from "./Components/Home/Home";
import {
  BrowserRouter as Router,
  Route,
  Link,
  BrowserRouter,
  Routes,
} from "react-router-dom";
import Signup from "./Components/Signup/Signup";
import AdminPage from "./Components/admindashboads/admin";
import ForgotPassword from "./Components/Forgot/Forgotpassword";
import SignIn from "./Components/Signup/Signin";
import ResetPasswordPage from "./Components/Forgot/resetpassword";
import PrivateRoute from "./Components/Jwt/privateRoute";
import SignupList from "./Components/Signup/SignupList";
import AddUser from "./Components/admindashboads/Adduser";
import AddAdmin from "./Components/admindashboads/AddAdmin";

function App() {
  return (
    <>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        <Route path="/Addadmin" element={<PrivateRoute><AddAdmin /></PrivateRoute>} />

        <Route path="/SignupList" element={<SignupList />} />
        <Route path="/adduser" element={<PrivateRoute><AddUser /></PrivateRoute>} />
        {/* <Route path="/adduser" element={<AddUser />} /> */}



        <Route path="/dashboard" element={<PrivateRoute>  <AdminPage /></PrivateRoute>}
        
        />
      </Routes>

    </>
  );
}

export default App;
