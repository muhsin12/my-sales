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
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridEventListener,
  GridRenderCellParams,
} from "@mui/x-data-grid";

import { useState, useEffect } from "react";

import Nav from "../nav";
import PurchasePopup from "@/components/purchase-popup.component";
import {
  createPurchase,
  deletePurchase,
  fetchPurchases,
} from "../../services/expense-service";
import { fetchCategories } from "../../services/expense-category-service";

interface Iexpense {
  _id: string;
  purchaseName: string;
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

export default function Expenses() {
  const [expenseData, setExpenseData] = useState<Iexpense[]>([]);
  const [expenseRawData, setExpenseRawData] = useState<Iexpense[]>([]);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [recordForEdit, setRecordForEdit] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [expenseId, setExpenseId] = useState("");
  const [categoryData, setCategoryData] = useState<Icategory[]>([]);
  const [categoryId, setCategoryId] = useState("reset");
  const [expenseTotal, setExpenseTotal] = useState(0);
  const handleOpen = () => {
    setSaveSuccess(false);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setEditMode(false);
    setSaveSuccess(true);
  };

  const getAllCategories = () => {
    fetchCategories()
      .then((res) => res.json())
      .then((data) => {
        setCategoryData(data.category);
      });
  };
  useEffect(() => {
    getAllCategories();
    getAllExpenses();
  }, []);

  //find total
  const findTotalExpenses = (expenses: any) => {
    const sum = expenses.reduce((accumulator: any, object: any) => {
      return accumulator + object.price;
    }, 0);
    setExpenseTotal(sum);
  };

  //definition of purchase grid
  const columns: GridColDef[] = [
    {
      field: "purchaseName",
      headerName: "Purchase Name",
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

  //definition of total grid
  const totalColumns: GridColDef[] = [
    {
      field: "totalExpensePrice",
      headerName: "Purchase Name",
      headerClassName: "mp-header",
      width: 150,
    },
  ];

  // handle delete click
  const handleDeleteClick = (event: any, cellValues: GridRenderCellParams) => {
    event.stopPropagation();
    if (confirm("Are you Sure , Do you want to delete this purchase?")) {
      deletePurchase(cellValues.row._id)
        .then((response) => {
          console.log(response);
          getAllExpenses();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  //find all expense
  const getAllExpenses = () => {
    fetchPurchases()
      .then((res) => res.json())
      .then((data) => {
        setExpenseData(data.purchases);
        setExpenseRawData(data.purchases);
        findTotalExpenses(data.purchases);
      });
  };

  //handle row click for popup opening
  const handleRowClick: GridEventListener<"rowClick"> = (params, event) => {
    event.stopPropagation();
    handleOpen();
    setEditMode(true);
    setExpenseId(params.row._id);
    console.log(params.row);
    setRecordForEdit(params.row);
    setSaveSuccess(false);
  };

  // submitting the purchase form
  const purchaseFormSubmit = (formData: any) => {
    createPurchase(formData, editMode, expenseId).then((res) => {
      getAllExpenses();
      handleClose();
      setEditMode(false);
    });
  };

  //properties for  popup component
  const popUpPropps = {
    open: open,
    editMode: editMode,
    handleClose: handleClose,
    purchaseFormSubmit: purchaseFormSubmit,
    recordForEdit: recordForEdit,
    saveSuccess: saveSuccess,
  };

  // filtering the expense
  const filterExpenses = (event: SelectChangeEvent) => {
    console.log("change event-", event.target);
    let categoryId = event.target.value;
    if (categoryId != "reset") {
      setCategoryId(categoryId);
      const filteredExpenseData = expenseRawData.filter(
        (el) => el.categoryId == categoryId
      );
      setExpenseData(filteredExpenseData);
      findTotalExpenses(filteredExpenseData);
    } else {
      setCategoryId("select category");
      setExpenseData(expenseRawData);
      findTotalExpenses(expenseRawData);
    }
  };

  return (
    <>
      <Nav />
      <Container maxWidth="xl">
        <Box sx={{ bgcolor: "#b2ebf2", height: "70px" }}>
          <Button
            variant="outlined"
            style={{ background: "#00838f", color: "white", marginTop: "5px" }}
            onClick={handleOpen}
          >
            ADD Expense
          </Button>
          <FormControl sx={{ m: 1, minWidth: 250 }}>
            <InputLabel id="demo-simple-select-label">Category</InputLabel>
            <Select
              id="categoryId"
              name="categoryId"
              value={categoryId}
              label="Select Category"
              onChange={filterExpenses}
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
            rows={expenseData}
            getRowId={(row: any) => generateRandom()}
            columns={columns}
            pageSize={20}
            rowsPerPageOptions={[5, 10, 15, 20]}
            disableSelectionOnClick
            experimentalFeatures={{ newEditingApi: true }}
          />
          <Box sx={{ bgcolor: "white", height: "30vh" }}>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className="tdWidth">Total</TableCell>
                  <TableCell className="tdWidth">{expenseTotal}</TableCell>
                  <TableCell className="tdWidth"></TableCell>
                  <TableCell className="tdWidth"></TableCell>
                  <TableCell className="tdWidth"></TableCell>
                  <TableCell className="tdWidth"></TableCell>
                  <TableCell className="tdWidth"></TableCell>
                  <TableCell className="tdWidth"></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Box>
        </Box>
        <PurchasePopup {...popUpPropps} />
      </Container>
    </>
  );
}
