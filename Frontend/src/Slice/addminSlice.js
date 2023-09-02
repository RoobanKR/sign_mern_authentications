import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  user: null,
  isLoading: true,
  error: null,
  resetMessage: "",
};

// admin Add User
export const signupUser = createAsyncThunk(
  "user/signupUser",
  async (userData, { rejectWithValue }) => {
    try {
      // Define or retrieve the user object with the token
      const user = {
        token: 'your_user_token_here' // Replace with the actual user token
      };

      const response = await axios.post(
        "http://localhost:3535/Adminsignup",
        userData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`
          }
        }
      );

      const { token, message } = response.data;
      return { success: true, message, token };
    } catch (error) {
      if (error.response) {
        return rejectWithValue(error.response.data);
      } else {
        return rejectWithValue("An error occurred");
      }
    }
  }
);

// admin Login User

export const loginUser = createAsyncThunk(
  'user/loginUser',
  async (loginData, { rejectWithValue }) => {
    try {
      const response = await axios.post('http://localhost:3535/logins', loginData, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);


// export const sendPasswordResetEmail = createAsyncThunk(
//   "user/sendPasswordResetEmail",
//   async (email, { rejectWithValue }) => {
//     try {
//       const response = await axios.post(
//         "http://localhost:3535/login/forgot-password",
//         { email }
//       );
//       return response.data.message;
//     } catch (error) {
//       return rejectWithValue("An error occurred");
//     }
//   }
// );

// export const resetPassword = createAsyncThunk(
//   "user/resetPassword",
//   async ({ token, passwords }, { rejectWithValue }) => {
//     try {
//       const response = await fetch(
//         `http://localhost:3535/reset-password/${token}`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ passwords }),
//         }
//       );

//       const data = await response.json();
//       return data.message;
//     } catch (error) {
//       return rejectWithValue("An error occurred");
//     }
//   }
// );

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logoutUser: (state) => {
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signupUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
 
  },
});

export const { logoutUser } = userSlice.actions;

export default userSlice.reducer;
