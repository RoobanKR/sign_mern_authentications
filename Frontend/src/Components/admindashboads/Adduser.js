import React, { useState,useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch,useSelector } from "react-redux";

import './admin.css';
import { signupUser } from "../../Slice/addminSlice";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { fetchCategories } from "../../Slice/AddadminSlice";
const AddUser = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [inputValue, setInputValue] = useState({
    email: "",
    password: "",
    username: "",
    addedby: "", 
  });

  const { email, password, username, addedby } = inputValue;
  const [formErrors, setFormErrors] = useState({
    category: '',
  });
  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setInputValue({
      ...inputValue,
      [name]: value,
    });
  };

  const handleError = (err) =>
    toast.error(err, {
      position: "bottom-left",
    });

  const handleSuccess = (msg) =>
    toast.success(msg, {
      position: "bottom-right",
    });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userData = {
        email,
        password,
        username,
        addedby, // Include the addedBy field in the user data
      };

      const response = await dispatch(signupUser(userData)); //getting api in redux
      const { success, message } = response.payload;  //show the mssage

      if (success) {
        handleSuccess(message);
        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);
      } else {
        handleError(message);
      }
    } catch (error) {
      console.log(error);
    }
    setInputValue({
      ...inputValue,
      email: "",
      password: "",
      username: "",
    });
  };
  const categories = useSelector((state) => state.categories.categories);
  // Fetch categories from the backend
  useEffect(() => {
    // Dispatch the fetchCategories action when the component mounts
    dispatch(fetchCategories());
  }, [dispatch]);

  return (
    <div className="form_container">
      <h2>Admin Signup</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            value={email}
            placeholder="Enter your email"
            onChange={handleOnChange}
          />
        </div>
        <div>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            name="username"
            value={username}
            placeholder="Enter your username"
            onChange={handleOnChange}
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            value={password}
            placeholder="Enter your password"
            onChange={handleOnChange}
          />
        </div>
        <div>
          <label htmlFor="category">CreatedBy</label>
          <select
            id="category"
            name="addedby"
            value={addedby}
            onChange={handleOnChange}
            required
            className={formErrors.category ? 'error' : ''}
          >
            <option value="">admin</option>
            {categories.map((category) => (
              <option key={category.category} value={category.category}>
                {category.category}
              </option>
            ))}
          </select>
          {formErrors.category && (
            <span className="error">{formErrors.category || '** Choose admin name'}</span>
          )}
        </div>
        <button type="submit">Submit</button>
        <br /><br />
     <Link to='/dashboard'>   <button type="submit">Go back</button></Link>

      </form>
      <ToastContainer />
    </div>
  );
};

export default AddUser;
