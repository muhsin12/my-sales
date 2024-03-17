import * as React from "react";
import Container from "@mui/material/Container";
import { Box, Button } from "@mui/material";
import {
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
} from "../../services/category-service";
import ConfirmBox from "@/components/confirm-popup.component";
import DataGridComponent from "@/components/data-grid.component";

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

export default function Category() {
  const [categoryData, setCategoryData] = useState<Icategory[]>([]);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [recordForEdit, setRecordForEdit] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [categoryId, setCategoryId] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [recordIdToDelete, setRecordIdToDelete] = useState<string>("");
  const [pageState, setPageState] = useState({
    isLoading: false,
    data: [],
    totalCount: 0,
    page: 1,
    pageSize: 5,
  });

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
  }, [pageState.page, pageState.pageSize]);

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
              handleOpenDialog(event, cellValues);
            }}
          >
            Delete
          </Button>
        );
      },
    },
  ];

  const handleDeleteClick = (recordId: string) => {
    deleteCategory(recordId)
      .then((response) => {
        console.log(response);
        getAllCategory();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getAllCategory = async () => {
    setPageState((old) => ({ ...old, isLoading: true }));

    const params: any = {
      page: pageState.page,
      pageSize: pageState.pageSize,
    };
    try {
      const res = await fetchCategories(params);
      const data = await res.json();
      setCategoryData(data.category);
      if (data.totalRecords > 0) {
        setPageState((old) => ({
          ...old,
          isLoading: false,
          data: data.category,
          totalCount: data.totalRecords,
        }));
      } else {
        setPageState((old) => ({
          ...old,
          isLoading: false,
          data: [],
          totalCount: 0,
        }));
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setPageState((old) => ({
        ...old,
        isLoading: false,
        data: [],
        totalCount: 0,
      }));
    }
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

  const handleOpenDialog = (event: any, cellValues: GridRenderCellParams) => {
    event.stopPropagation();
    setRecordIdToDelete(cellValues.row._id);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleConfirmAction = () => {
    if (recordIdToDelete !== null) {
      // Call your delete record API with recordIdToDelete
      handleDeleteClick(recordIdToDelete);
    }
    setRecordIdToDelete("");
    handleCloseDialog();
  };

  return (
    <>
      <Nav />
      <Container maxWidth="xl">
        <ConfirmBox
          open={dialogOpen}
          onClose={handleCloseDialog}
          onConfirm={handleConfirmAction}
          context={"delete this record"}
        />
        <Box sx={{ bgcolor: "#b2ebf2", height: "50px" }}>
          <Button
            variant="outlined"
            style={{ background: "#00838f", color: "white", marginTop: "5px" }}
            onClick={handleOpen}
          >
            ADD Users
          </Button>
        </Box>
        <Box sx={{ bgcolor: "white", height: "70vh" }}>
          <DataGridComponent
            pageState={pageState}
            handleRowClick={handleRowClick}
            totalAmount={0}
            columns={columns}
            generateRandom={generateRandom}
            setPageState={setPageState}
          />
        </Box>
        <CategoryPopup {...popUpPropps} />
      </Container>
    </>
  );
}
