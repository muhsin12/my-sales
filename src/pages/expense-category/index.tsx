import * as React from "react";
import Container from "@mui/material/Container";
import { Box, Button } from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridEventListener,
  GridRenderCellParams,
} from "@mui/x-data-grid";

import { useState, useEffect } from "react";

import Nav from "../nav";
import CategoryPopup from "@/components/category-popup.component";
import {
  fetchCategories,
  createCategory,
  deleteCategory,
} from "../../services/expense-category-service";

interface Icategory {
  _id: string;
  categoryName: string;
}

function generateRandom() {
  var length = 8,
    charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
    retVal = "";
  for (var i = 0, n = charset.length; i < length; ++i) {
    retVal += charset.charAt(Math.floor(Math.random() * n));
  }
  return retVal;
}

export default function ExpenseCategory() {
  const [categoryData, setCategoryData] = useState<Icategory[]>([]);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [recordForEdit, setRecordForEdit] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [categoryId, setCategoryId] = useState("");

  const handleOpen = () => {
    setOpen(true);
    setSaveSuccess(false);
  };
  const handleClose = () => {
    setOpen(false);
    setEditMode(false);
    setRecordForEdit(null);
    setSaveSuccess(true);
  };

  useEffect(() => {
    getAllCategory();
  }, []);

  const columns: GridColDef[] = [
    {
      field: "categoryName",
      headerName: "Category Name",
      width: 150,
      editable: true,
    },
    {
      field: "Action",
      renderCell: (cellValues) => {
        return (
          <Button
            variant="contained"
            color="error"
            onClick={(event) => {
              handleDeleteClick(event, cellValues);
            }}
          >
            Delete
          </Button>
        );
      },
    },
  ];

  const handleDeleteClick = (event: any, cellValues: GridRenderCellParams) => {
    event.stopPropagation();
    if (confirm("Are you Sure , Do you want to delete Category?")) {
      deleteCategory(cellValues.row._id)
        .then((response) => {
          console.log(response);
          getAllCategory();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const getAllCategory = () => {
    fetchCategories()
      .then((res) => res.json())
      .then((data) => {
        setCategoryData(data.category);
      });
  };

  const handleRowClick: GridEventListener<"rowClick"> = (params, event) => {
    event.stopPropagation();
    handleOpen();
    setEditMode(true);
    setCategoryId(params.row._id);
    setRecordForEdit(params.row);
    setSaveSuccess(false);
  };

  const categoryFromSubmit = (formData: any) => {
    const dataBody = {
      categoryName: formData.categoryName,
    };
    createCategory(dataBody, editMode, categoryId).then((res) => {
      getAllCategory();
      handleClose();
      setEditMode(false);
    });
  };

  const popUpPropps = {
    open: open,
    editMode: editMode,
    handleClose: handleClose,
    categoryFromSubmit: categoryFromSubmit,
    recordForEdit: recordForEdit,
    saveSuccess: saveSuccess,
  };

  return (
    <>
      <Nav />
      <Container maxWidth="xl">
        <Box sx={{ bgcolor: "#b2ebf2", height: "50px" }}>
          <Button
            variant="outlined"
            style={{ background: "#00838f", color: "white", marginTop: "5px" }}
            onClick={handleOpen}
          >
            ADD Purcahse Category
          </Button>
        </Box>
        <Box sx={{ bgcolor: "white", height: "70vh" }}>
          <DataGrid
            onRowClick={handleRowClick}
            rows={categoryData}
            getRowId={(row: any) => generateRandom()}
            columns={columns}
            pageSize={20}
            rowsPerPageOptions={[5, 10, 15, 20]}
            disableSelectionOnClick
            experimentalFeatures={{ newEditingApi: true }}
          />
        </Box>
        <CategoryPopup {...popUpPropps} />
      </Container>
    </>
  );
}
