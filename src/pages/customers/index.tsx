import * as React from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { Button, TextField, Typography, useFormControl } from "@mui/material";
import Modal from "@mui/material/Modal";

import {
  DataGrid,
  GridColDef,
  GridEventListener,
  GridRenderCellParams,
} from "@mui/x-data-grid";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";

import Nav from "../nav";

interface Icustomer {
  _id: string;
  customer_name: string;
  address: string;
  contact_person: string;
  mobile: string;
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

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    margin: "auto",
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

export default function Customers() {
  const [customerData, setCustomerData] = useState<Icustomer[]>([]);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const customerEndPoint = "http://localhost:3001/api/customers";
  const [customerId, setCustomerId] = useState("");
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setEditMode(false);
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    getAllCustomers();
  }, []);

  const columns: GridColDef[] = [
    {
      field: "customer_name",
      headerName: "Customer name",
      width: 150,
      editable: true,
    },
    {
      field: "contact_person",
      headerName: "Contact Person",
      width: 150,
      editable: true,
      sortable: true,
    },
    {
      field: "address",
      headerName: "Address",
      width: 110,
      editable: true,
    },
    {
      field: "mobile",
      headerName: "Mobile",
      sortable: false,
      width: 160,
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
    const deleteUrl = `${customerEndPoint}/?customerId=${cellValues.row._id}`;
    if (confirm("Are you Sure , Do you want to delete Customer?")) {
      fetch(deleteUrl, {
        method: "DELETE",
      })
        .then((response) => {
          console.log(response);
          getAllCustomers();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const getAllCustomers = () => {
    fetch(customerEndPoint, { method: "GET" })
      .then((res) => res.json())
      .then((data) => {
        setCustomerData(data.customers);
        console.log("customer data-", data);
      });
  };

  const handleRowClick: GridEventListener<"rowClick"> = (params, event) => {
    event.stopPropagation();
    handleOpen();
    setEditMode(true);
    setCustomerId(params.row._id);
    reset({
      customerName: params.row.customer_name,
      contactPerson: params.row.contact_person,
      address: params.row.address,
      mobile: params.row.mobile,
    });
    console.log(params.row);
  };

  const customerFormSubmit = (formData: any) => {
    console.log("inside form update-", formData);
    const dataBody = {
      customer_name: formData.customerName,
      contact_person: formData.contactPerson,
      address: formData.address,
      mobile: formData.mobile,
    };

    const customerMethod = !editMode ? "POST" : "PATCH";

    fetch(customerEndPoint, {
      method: customerMethod,
      headers: {
        "Content-Type": "application/json",
      },
      body: !editMode
        ? JSON.stringify(dataBody)
        : JSON.stringify({ ...dataBody, customerId: customerId }),
    }).then((res) => {
      console.log("post response from mongo--", res);
      reset();
      getAllCustomers();
      handleClose();
      setEditMode(false);
    });
  };

  return (
    <>
      <Nav />
      <Container maxWidth="xl">
        <Box sx={{ bgcolor: "#616161", height: "50px" }}>
          <Button
            variant="outlined"
            style={{ background: "#424242", color: "white", marginTop: "5px" }}
            onClick={handleOpen}
          >
            ADD CUSTOMER
          </Button>
        </Box>
        <Box sx={{ bgcolor: "#757575", height: "70vh" }}>
          <DataGrid
            onRowClick={handleRowClick}
            rows={customerData}
            getRowId={(row: any) => generateRandom()}
            columns={columns}
            pageSize={20}
            rowsPerPageOptions={[5, 10, 15, 20]}
            disableSelectionOnClick
            experimentalFeatures={{ newEditingApi: true }}
          />
        </Box>

        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          style={getModalStyle()}
        >
          <Box
            component="form"
            sx={{
              "& .MuiTextField-root": { mt: 2, p: 1, width: "95%" },
              height: "500px",
              backgroundColor: "#9E9E9E",
            }}
            noValidate
            autoComplete="off"
            onSubmit={handleSubmit(customerFormSubmit)}
          >
            <div className="formFieldContainer">
              <TextField
                id="outlined-required"
                label="Customer Name"
                {...register("customerName", { required: true })}
              />
              {errors.customerName &&
                errors.customerName.type == "required" && (
                  <span style={{ color: "red" }}>
                    Please fill customer name field!
                  </span>
                )}
            </div>
            <div className="formFieldContainer">
              <TextField
                id="outlined-required"
                label="Contact Person"
                {...register("contactPerson", { required: true })}
              />
              {errors.contactPerson &&
                errors.contactPerson.type == "required" && (
                  <span style={{ color: "red" }}>
                    Please fill contactPerson field!
                  </span>
                )}
            </div>
            <div className="formFieldContainer">
              <TextField
                id="outlined-required"
                label="Address"
                {...register("address", { required: true })}
              />
              {errors.address && errors.address.type == "required" && (
                <span style={{ color: "red" }}>Please fill address field!</span>
              )}
            </div>
            <div className="formFieldContainer">
              <TextField
                id="outlined-required"
                label="Mobile"
                type="number"
                {...register("mobile", { required: true })}
              />
              {errors.mobile && errors.mobile.type == "required" && (
                <span style={{ color: "red" }}>Please fill mobile field!</span>
              )}
            </div>
            <div
              className="formFieldContainer"
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              <Button
                variant="outlined"
                style={{
                  background: "#424242",
                  color: "white",
                  marginTop: "5px",
                }}
                type="submit"
              >
                {!editMode ? "Add Customer" : "Update Customer"}
              </Button>
              <Button
                variant="outlined"
                style={{
                  background: "#424242",
                  color: "white",
                  marginTop: "5px",
                  right: "30px",
                }}
                onClick={handleClose}
              >
                Close
              </Button>
            </div>
          </Box>
        </Modal>
      </Container>
    </>
  );
}
