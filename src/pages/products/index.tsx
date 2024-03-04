import * as React from "react";
import Container from "@mui/material/Container";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import {
  GridColDef,
  GridEventListener,
  GridRenderCellParams,
} from "@mui/x-data-grid";

import { useState, useEffect, useCallback } from "react";

import Nav from "../nav";
import ProductPopup from "@/components/product-popup.component";
import { createItem, deleteItem, fetchItem } from "../../services/item-service";
import { fetchCategories } from "../../services/category-service";
import ConfirmBox from "@/components/confirm-popup.component";
import DataGridComponent from "@/components/data-grid.component";

interface Iproduct {
  _id: string;
  productName: string;
  price: number;
  description: string;
  categoryId: string;
}
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

export default function Products() {
  const [productData, setProductData] = useState<Iproduct[]>([]);
  const [productRawData, setProductRawData] = useState<Iproduct[]>([]);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [recordForEdit, setRecordForEdit] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [productId, setProductId] = useState("");
  const [categoryData, setCategoryData] = useState<Icategory[]>([]);
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
    setSaveSuccess(false);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setEditMode(false);
    setSaveSuccess(true);
    setRecordForEdit(null);
  };

  useEffect(() => {
    getAllCategories();
  }, []);

  useEffect(() => {
    getAllProducts();
  }, [pageState.page, pageState.pageSize, categoryId]);

  const columns: GridColDef[] = [
    {
      field: "productName",
      headerName: "Item Name",
      width: 150,
      editable: true,
    },
    {
      field: "description",
      headerName: "Description",
      width: 150,
      editable: true,
      sortable: true,
    },
    {
      field: "price",
      headerName: "Price",
      width: 110,
      editable: true,
    },
    {
      field: "categoryName",
      headerName: "Category Name",
      width: 110,
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
    deleteItem(recordId)
      .then((response) => {
        console.log(response);
        getAllProducts();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getAllProducts = async () => {
    setPageState((old) => ({ ...old, isLoading: true }));

    const params: any = {
      page: pageState.page,
      pageSize: pageState.pageSize,
    };
    if (categoryId != "") {
      params.categoryId = categoryId;
    }
    try {
      const res = await fetchItem(params);
      const data = await res.json();

      setProductData(data.products);
      setProductRawData(data.products);
      if (data.totalProducts > 0) {
        setPageState((old) => ({
          ...old,
          isLoading: false,
          data: data.products,
          totalCount: data.totalProducts,
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
      // Handle error if needed
      setPageState((old) => ({
        ...old,
        isLoading: false,
        data: [],
        totalCount: 0,
      }));
    }
  };

  const getAllCategories = () => {
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
    setProductId(params.row._id);
    console.log(params.row);
    setRecordForEdit(params.row);
    setSaveSuccess(false);
  };

  const productFormSubmit = (formData: any) => {
    createItem(formData, editMode, productId).then((res) => {
      getAllProducts();
      handleClose();
      setEditMode(false);
      setRecordForEdit(null);
    });
  };

  const popUpPropps = {
    open: open,
    editMode: editMode,
    handleClose: handleClose,
    productFormSubmit: productFormSubmit,
    recordForEdit: recordForEdit,
    saveSuccess: saveSuccess,
  };
  // filtering the expense
  const filterProducts = (event: SelectChangeEvent) => {
    console.log("change event-", event.target);
    let categoryId = event.target.value;
    if (categoryId != "") {
      setCategoryId(categoryId);
    } else {
      setCategoryId("");
    }
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
        <Box sx={{ bgcolor: "#b2ebf2", height: "60px" }}>
          <Button
            variant="outlined"
            style={{ background: "#00838f", color: "white", marginTop: "5px" }}
            onClick={handleOpen}
          >
            ADD ITEM
          </Button>
          <FormControl sx={{ m: 1, minWidth: 250 }}>
            <InputLabel id="demo-simple-select-label">Category</InputLabel>
            <Select
              id="categoryId"
              name="categoryId"
              value={categoryId}
              label="Select Category"
              onChange={filterProducts}
            >
              <MenuItem value="">Select Category</MenuItem>
              {categoryData.map((category: any) => (
                <MenuItem key={category._id} value={category._id}>
                  {category.categoryName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
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
        <ProductPopup {...popUpPropps} />
      </Container>
    </>
  );
}
