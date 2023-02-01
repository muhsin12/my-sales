import React from "react";
import { Box, Button, Modal, TextField } from "@mui/material";
import { useForm } from "react-hook-form";

function CustomerPopup(props: any) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

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
  const title = "customer popup";
  console.log("chiild component props---", props);

  return (
    <Modal
      open={props.open}
      onClose={props.handleClose}
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
        onSubmit={handleSubmit(props.customerFormSubmit)}
      >
        <div className="formFieldContainer">
          <TextField
            id="outlined-required"
            label="Customer Name"
            {...register("customerName", { required: true })}
          />
          {errors.customerName && errors.customerName.type == "required" && (
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
          {errors.contactPerson && errors.contactPerson.type == "required" && (
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
            {!props.editMode ? "Add Customer" : "Update Customer"}
          </Button>
          <Button
            variant="outlined"
            style={{
              background: "#424242",
              color: "white",
              marginTop: "5px",
              right: "30px",
            }}
            onClick={props.handleClose}
          >
            Close
          </Button>
        </div>
      </Box>
    </Modal>
  );
}

export default CustomerPopup;
