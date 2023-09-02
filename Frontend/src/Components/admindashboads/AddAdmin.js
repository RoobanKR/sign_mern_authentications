  import React, { useState, useEffect } from "react";
  import { useDispatch, useSelector } from 'react-redux';
  import axios from "axios";
  import {
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TextField,
    Modal,
  } from "@mui/material";
  import EditIcon from "@mui/icons-material/Edit";
  import DeleteIcon from "@mui/icons-material/Delete";
  import { Link } from "react-router-dom";
import { addCategory, deleteCategory, fetchCategories, updateCategory } from "../../Slice/AddadminSlice";

  const AddAdmin = () => {
    const dispatch = useDispatch();

    const categories = useSelector((state) => state.categories.categories);
    const [newCategory, setNewCategory] = useState("");
    const [editedCategory, setEditedCategory] = useState("");
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);

    useEffect(() => {
      fetchCategories();
    }, []);
    // Fetch categories from the backend
    useEffect(() => {
      // Dispatch the fetchCategories action when the component mounts
      dispatch(fetchCategories());
    }, [dispatch]);
  
    const handleAddCategory = () => {
      if (newCategory.trim() !== '') {
        dispatch(addCategory(newCategory)); // Dispatch the addCategory action
        setNewCategory('');
      }
    };
  

    const handleEditCategory = (category) => {
      setEditedCategory(category);
      setEditModalOpen(true);
    };

    const handleUpdateCategory = () => {
      if (editedCategory && newCategory.trim() !== "") {
        dispatch(updateCategory({ categoryId: editedCategory._id, newCategory }));
        setEditModalOpen(false);
      }
    };

    const handleDeleteCategory = (category) => {
      setSelectedCategory(category);
      setDeleteModalOpen(true);
    };
    const handleConfirmDelete = () => {
      if (!selectedCategory) {
        console.error("No category selected for deletion.");
        return;
      }
  
      dispatch(deleteCategory(selectedCategory._id))
        .then(() => {
          // Handle any post-deletion logic here
          setDeleteModalOpen(false);
        })
        .catch((error) => {
          console.error("Error deleting category:", error);
          // You can also inspect the error response from the server to get more information.
          if (error.response) {
            console.error("Server responded with:", error.response.data);
          }
        });
    };

    return (
      <div style={{ padding: "20px", background: "grey" }}>
        <h2>Enter Admin name here</h2>
        <br></br>
        <TextField
          label="Add New Category"
          variant="outlined"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          style={{ marginBottom: "10px" }}
        />
        <br></br>
        <Button variant="contained" onClick={handleAddCategory}>
          ADD
        </Button>

        <TableContainer component={Paper} style={{ marginTop: "20px" }}>
          <Table className="table-bordered">
            <TableHead>
              <TableRow>
                <TableCell
                  style={{
                    border: "2px solid black",
                    padding: "8px",
                    textAlign: "left",
                    background: "#C4C1A4",
                  }}
                >
                  #
                </TableCell>
                <TableCell
                  style={{
                    border: "2px solid black",
                    padding: "8px",
                    textAlign: "left",
                    background: "#C4C1A4",
                  }}
                >
                  Category Name
                </TableCell>
                <TableCell
                  style={{
                    border: "2px solid black",
                    padding: "8px",
                    textAlign: "left",
                    background: "#C4C1A4",
                  }}
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categories.map((category, index) => (
                <TableRow key={index}>
                  <TableCell
                    style={{
                      border: "1px solid black",
                      padding: "8px",
                      textAlign: "left",
                    }}
                  >
                    {index + 1}
                  </TableCell>
                  <TableCell
                    style={{
                      border: "1px solid black",
                      padding: "8px",
                      textAlign: "left",
                    }}
                  >
                    {category.category}
                  </TableCell>
                  <TableCell
                    style={{
                      border: "1px solid black",
                      padding: "8px",
                      textAlign: "left",
                    }}
                  >
                    <Button
                      variant="outlined"
                      startIcon={<EditIcon />}
                      style={{ margin: "10px" }}
                      onClick={() => handleEditCategory(category)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<DeleteIcon />}
                      onClick={() => handleDeleteCategory(category)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Edit Category Modal */}
        <Modal open={editModalOpen} onClose={() => setEditModalOpen(false)}>
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              background: "white",
              padding: "20px",
            }}
          >
            <h3>Edit</h3>
            <br></br>
            <TextField
              label="Category Name"
              variant="outlined"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            />
            <br></br>
            <Button
              variant="contained"
              onClick={handleUpdateCategory}
              style={{ marginTop: "10px" }}
            >
              Update
            </Button>
          </div>
        </Modal>

        {/* Delete Category Confirmation Modal */}
        <Modal open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              background: "white",
              padding: "20px",
            }}
          >
            <h3>Confirm Deletion</h3>
            <br></br>
            <p>
              Are you sure you want to delete the admin :{" "}
              {selectedCategory ? selectedCategory.category : ""}?
            </p>
            <br></br>
            <Button
              variant="contained"
              color="error"
              onClick={handleConfirmDelete}
              style={{ marginRight: "10px" }}
            >
              Delete
            </Button>
            <Button variant="contained" onClick={() => setDeleteModalOpen(false)}>
              Cancel
            </Button>
          </div>
        </Modal>

        {/* Additional Button */}
        <Link to ='/dashboard'>
          <Button>Back</Button>
        </Link>
      </div>
    );
  };

  export default AddAdmin;
