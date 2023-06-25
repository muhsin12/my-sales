import * as React from "react";
import Container from "@mui/material/Container";
import {
  Box,
  Button,
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

import { useState, useEffect, useCallback } from "react";

import Nav from "../nav";
import ProductPopup from "@/components/product-popup.component";
import { fetchSales } from "../../services/sales-service";

interface ISales {
  _id: string;
  salesTotal: number;
  salesDate: string;
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
  const [salesData, setSalesData] = useState<ISales[]>([]);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [recordForEdit, setRecordForEdit] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [productId, setProductId] = useState("");
  const [totalSales, setTotalSales] = useState(0);
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
    getAllSales();
  }, []);

  useEffect(() => {
    const sum = salesData.reduce((accumulator, object) => {
      return accumulator + object.salesTotal;
    }, 0);
    setTotalSales(sum);
  }, [salesData]);

  const columns: GridColDef[] = [
    {
      field: "_id",
      headerName: "Sales Number",
      width: 250,
      editable: true,
    },
    {
      field: "salesTotal",
      headerName: "Total Price",
      width: 150,
      editable: true,
      sortable: true,
    },
    {
      field: "salesDate",
      headerName: "Sales Date",
      width: 210,
      editable: true,
    },

    {
      field: "Action",
      renderCell: (cellValues) => {
        return (
          <Button variant="contained" color="error">
            Delete
          </Button>
        );
      },
    },
  ];

  //   const handleDeleteClick = (event: any, cellValues: GridRenderCellParams) => {
  //     event.stopPropagation();
  //     if (confirm("Are you Sure , Do you want to delete Product?")) {
  //       deleteItem(cellValues.row._id)
  //         .then((response) => {
  //           console.log(response);
  //           getAllProducts();
  //         })
  //         .catch((err) => {
  //           console.log(err);
  //         });
  //     }
  //   };

  const getAllSales = () => {
    fetchSales()
      .then((res) => res.json())
      .then((data) => {
        setSalesData(data.sales);
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

  return (
    <>
      <Nav />
      <Container maxWidth="xl">
        <Box sx={{ bgcolor: "#b2ebf2", height: "50px" }}></Box>
        <Box sx={{ bgcolor: "white", height: "70vh" }}>
          <DataGrid
            onRowClick={handleRowClick}
            rows={salesData}
            getRowId={(row: any) => generateRandom()}
            columns={columns}
            pageSize={20}
            rowsPerPageOptions={[5, 10, 15, 20]}
            disableSelectionOnClick
            experimentalFeatures={{ newEditingApi: true }}
          />
        </Box>
        <Box sx={{ bgcolor: "white", height: "30vh" }}>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className="tdWidth">Total</TableCell>
                <TableCell className="tdWidth">{totalSales}</TableCell>
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
      </Container>
    </>
  );
}
