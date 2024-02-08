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
  DataGrid,
  GridColDef,
  GridEventListener,
  GridRenderCellParams,
} from "@mui/x-data-grid";

import { useState, useEffect, useCallback } from "react";

import Nav from "../nav";
import ProductPopup from "@/components/product-popup.component";
import { createItem, deleteItem, fetchItem } from "../../services/item-service";
import { fetchCategories } from "../../services/category-service";

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
  const [categoryId, setCategoryId] = useState("reset");
  const handleOpen = () => {
    setSaveSuccess(false);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setEditMode(false);
    setSaveSuccess(true);
  };

  useEffect(() => {
    getAllProducts();
    getAllCategories();
  }, []);

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
    if (confirm("Are you Sure , Do you want to delete Product?")) {
      deleteItem(cellValues.row._id)
        .then((response) => {
          console.log(response);
          getAllProducts();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const getAllProducts = () => {
    fetchItem()
      .then((res) => res.json())
      .then((data) => {
        setProductData(data.products);
        setProductRawData(data.products);
      });
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
    if (categoryId != "reset") {
      setCategoryId(categoryId);
      const filteredProductData = productRawData.filter(
        (el) => el.categoryId == categoryId
      );
      setProductData(filteredProductData);
    } else {
      setCategoryId("select category");
      setProductData(productRawData);
    }
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
              <MenuItem value="reset">Select Category</MenuItem>
              {categoryData.map((category: any) => (
                <MenuItem key={category._id} value={category._id}>
                  {category.categoryName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Box sx={{ bgcolor: "white", height: "70vh" }}>
          <DataGrid
            onRowClick={handleRowClick}
            rows={productData}
            getRowId={(row: any) => generateRandom()}
            columns={columns}
            pageSize={20}
            rowsPerPageOptions={[5, 10, 15, 20]}
            disableSelectionOnClick
            experimentalFeatures={{ newEditingApi: true }}
          />
        </Box>
        <ProductPopup {...popUpPropps} />
      </Container>
    </>
  );
}
