import { configureStore } from "@reduxjs/toolkit"
import formreducer from './Slice/UserSlice'
import userReducer from './Slice/addminSlice'; // Import your user reducer
import categoryReducer from './Slice/AddadminSlice'; // Import your category reducer

export const store = configureStore({
    reducer: {
        Forms:formreducer,
        user: userReducer,
        categories: categoryReducer, // Add your category reducer here

    }
})



