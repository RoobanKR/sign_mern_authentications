// categorySlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Create an async thunk to fetch categories (as previously defined)
export const fetchCategories = createAsyncThunk(
  "categories/fetchCategories",
  async () => {
    const response = await axios.get("http://localhost:3535/admin/getadmin");
    return response.data;
  }
);

// Create an action to add a category
export const addCategory = (newCategory) => async (dispatch) => {
  try {
    const response = await axios.post("http://localhost:3535/admin", {
      category: newCategory,
    });
    dispatch(addCategorySuccess(response.data));
  } catch (error) {
    // Handle the error if needed
    console.error("Error adding category:", error);
  }
};
export const updateCategory = createAsyncThunk(
  "categories/updateCategory",
  async ({ categoryId, newCategory }) => {
    const response = await axios.put(
      `http://localhost:3535/admin/update${categoryId}`,
      { category: newCategory }
    );
    return response.data;
  }
);
export const deleteCategory = createAsyncThunk(
  "categories/deleteCategory",
  async (categoryId) => {
    await axios.delete(`http://localhost:3535/admin/delete${categoryId}`);
    return categoryId; // Return the deleted categoryId for reference
  }
);

const categorySlice = createSlice({
  name: "categories",
  initialState: {
    categories: [],
    loading: "idle",
    error: null,
  },
  reducers: {
    addCategorySuccess: (state, action) => {
      state.categories = [...state.categories, action.payload];
    },
    // You can add other synchronous actions here if needed
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = "idle";
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = "idle";
        state.error = action.error.message;
      });
  },
});

export const { addCategorySuccess } = categorySlice.actions;
export default categorySlice.reducer;
