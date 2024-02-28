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
  TextField,
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
  searchPurchases,
} from "../../services/expense-service";
import { fetchCategories } from "../../services/expense-category-service";
import ConfirmBox from "@/components/confirm-popup.component";
import Purchases from "@/models/purchase-model";

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
  const [categoryId, setCategoryId] = useState("");
  const [expenseTotal, setExpenseTotal] = useState(0);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
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

  const getAllCategories = () => {
    fetchCategories()
      .then((res) => res.json())
      .then((data) => {
        setCategoryData(data.category);
      });
  };
  useEffect(() => {
    getAllCategories();
  }, []);

  useEffect(() => {
    if (fromDate == "" && toDate == "" && categoryId == "") {
      getAllExpenses();
    } else {
      handleSearch();
    }
  }, [pageState.page, pageState.pageSize]);

  //find total
  const findTotalExpenses = (expenses: any) => {
    const sum = expenses?.reduce((accumulator: any, object: any) => {
      return accumulator + object.price;
    }, 0);
    setExpenseTotal(sum);
  };

  useEffect(() => {
    const sum = expenseData.reduce((accumulator: any, object: any) => {
      return accumulator + object.price;
    }, 0);
    setExpenseTotal(sum);
  }, [expenseData]);

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
      field: "purchaseDate",
      headerName: "Expense Date",
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
  const handleDeleteClick = (recordId: string) => {
    deletePurchase(recordId)
      .then((response) => {
        console.log(response);
        getAllExpenses();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //find all expense

  const getAllExpenses = async () => {
    try {
      setPageState((old) => ({ ...old, isLoading: true }));

      const response = await fetchPurchases(pageState.page, pageState.pageSize);
      const data = await response.json();

      if (data?.purchases) {
        const updatedPurchases = data?.purchases?.map((expense: any) => {
          const updateDate = expense?.purchaseDate?.split("T")[0];
          return { ...expense, purchaseDate: updateDate };
        });
        setExpenseData(updatedPurchases);
        setPageState((old) => ({
          ...old,
          isLoading: false,
          data: updatedPurchases,
          totalCount: data.totalPurchases,
        }));
      }

      setPageState((old) => ({ ...old, isLoading: false }));
    } catch (error) {
      console.error("Error fetching purchases:", error);
      // Handle error here if necessary
      setPageState((old) => ({
        ...old,
        isLoading: false,
        data: [],
        totalCount: 0,
      }));
    }
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
      setRecordForEdit(null);
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

  const handleSearch = async () => {
    try {
      setPageState((old) => ({ ...old, isLoading: true }));
      const filterObj = {
        fromDate,
        toDate,
        categoryId,
        page: pageState.page,
        pageSize: pageState.pageSize,
      };

      const response = await searchPurchases(filterObj);
      const data = await response.json();

      if (data?.purchases) {
        const updatedPurchases = data?.purchases?.map((expense: any) => {
          const updateDate = expense?.purchaseDate?.split("T")[0];
          return { ...expense, purchaseDate: updateDate };
        });

        setExpenseData(updatedPurchases);
        setPageState((old) => ({
          ...old,
          isLoading: false,
          data: updatedPurchases,
          totalCount: data.totalPurchases,
        }));
      } else {
        setExpenseData([]);
        setExpenseRawData([]);
        findTotalExpenses([]);
      }
    } catch (error) {
      console.error("Error searching purchases:", error);
      // Handle error here if necessary
      setPageState((old) => ({
        ...old,
        isLoading: false,
        data: [],
        totalCount: 0,
      }));
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
        <Box sx={{ bgcolor: "#b2ebf2", height: "70px" }}>
          <Button
            variant="outlined"
            style={{ background: "#00838f", color: "white", marginTop: "15px" }}
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
              onChange={(e) => setCategoryId(e.target.value)}
            >
              <MenuItem value="">Select Category</MenuItem>
              {categoryData.map((category: any) => (
                <MenuItem key={category._id} value={category._id}>
                  {category.categoryName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl>
            <TextField
              sx={{ m: 1, minWidth: 250 }}
              id="fromDate"
              name="fromDate"
              label="From Date"
              type="date"
              InputLabelProps={{
                shrink: true,
              }}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </FormControl>
          <FormControl>
            <TextField
              sx={{ m: 1, minWidth: 250 }}
              id="toDate"
              name="toDate"
              label="To Date"
              type="date"
              InputLabelProps={{
                shrink: true,
              }}
              onChange={(e) => setToDate(e.target.value)}
            />
          </FormControl>
          <FormControl>
            <Button
              variant="outlined"
              style={{
                background: "#00838f",
                color: "white",
                marginTop: "15px",
              }}
              onClick={handleSearch}
            >
              Search
            </Button>
          </FormControl>
        </Box>
        <Box sx={{ bgcolor: "white", height: "70vh" }}>
          <DataGrid
            onRowClick={handleRowClick}
            getRowId={(row: any) => generateRandom()}
            columns={columns}
            pagination
            rows={pageState.data}
            rowCount={pageState.totalCount}
            loading={pageState.isLoading}
            page={pageState.page - 1}
            pageSize={pageState.pageSize}
            onPageChange={(newPage) =>
              setPageState((old) => ({ ...old, page: newPage + 1 }))
            }
            onPageSizeChange={(newPageSize) =>
              setPageState((old) => ({ ...old, pageSize: newPageSize }))
            }
            rowsPerPageOptions={[5, 10, 15, 20]}
            paginationMode="server"
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
