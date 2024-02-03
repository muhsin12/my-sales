import React, { useEffect, useState } from "react";
import { Box, Button, Modal } from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridEventListener,
  GridRenderCellParams,
} from "@mui/x-data-grid";

function SalesPopup(props: any) {
  const salesDetailsData = props.recordForEdit?.salesDetails
    ? props.recordForEdit?.salesDetails
    : [];

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
  console.log("sales details props--", props.recordForEdit);

  const title = "Sales Details";
  function generateRandomSalesDeatils() {
    var length = 8,
      charset =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
      retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
      retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
  }
  const columns: GridColDef[] = [
    {
      field: "itemName",
      headerName: "Item Name",
      width: 250,
      editable: true,
    },
    {
      field: "price",
      headerName: "Price",
      width: 150,
      editable: true,
      sortable: true,
    },
    {
      field: "quantity",
      headerName: "Quantity",
      width: 210,
      editable: true,
    },
  ];
  return (
    <Modal
      open={props.open}
      onClose={props.handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      style={getModalStyle()}
    >
      <Box
        component="div"
        id="SalesDetailTable"
        sx={{
          "& .MuiTextField-root": { mt: 2, p: 1, width: "95%" },
          height: "300px",
          backgroundColor: "#b2ebf2",
        }}
      >
        <div className="popup-header">
          <div className="header-left">
            <h3 className="title">{title}</h3>
          </div>
          <div className="header-right">
            <Button
              variant="outlined"
              style={{
                background: "red",
                color: "white",
                marginTop: "5px",
                width: "10%",
              }}
              onClick={props.handleClose}
            >
              X
            </Button>
          </div>
        </div>

        <DataGrid
          rows={salesDetailsData}
          getRowId={(row: any) => generateRandomSalesDeatils()}
          columns={columns}
        />

        <div
          className="formFieldContainer"
          style={{ display: "flex", justifyContent: "space-between" }}
        ></div>
      </Box>
    </Modal>
  );
}

export default SalesPopup;
