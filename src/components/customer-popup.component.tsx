import React from "react";
import { Box, Button, Modal, TextField } from "@mui/material";
import { useFormik } from "formik";

function CustomerPopup(props: any) {
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
  interface customerFormVaues {
    customerName: string;
    contactPerson: string;
    address: string;
    mobile: number;
  }

  const onSubmit = (values: customerFormVaues) => {
    console.log(JSON.stringify(values, null, 2));
    props.customerFormSubmit(values);
  };

  const validate = (values: customerFormVaues) => {
    let errors: any = {};
    if (!values.customerName) {
      errors.customerName = "Required";
    }
    if (!values.contactPerson) {
      errors.contactPerson = "Required";
    }
    if (!values.address) {
      errors.address = "Required";
    }
    if (!values.mobile) {
      errors.mobile = "Required";
    }
    return errors;
  };
  const initialValues: customerFormVaues = props.customerFormValues;
  const formik = useFormik({
    initialValues,
    onSubmit,
    validate,
  });
  const title = "customer popup";
  console.log("chiild component props---", props.customerFormValues);

  formik.values.customerName = props.customerFormValues.customerName;
  formik.values.contactPerson = props.customerFormValues.contactPerson;
  formik.values.address = props.customerFormValues.address;
  formik.values.mobile = props.customerFormValues.mobile;

  console.log("formik errors--", formik.errors);
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
        name="customerForm"
        sx={{
          "& .MuiTextField-root": { mt: 2, p: 1, width: "95%" },
          height: "500px",
          backgroundColor: "#9E9E9E",
        }}
        noValidate
        autoComplete="off"
        onSubmit={formik.handleSubmit}
      >
        <div className="formFieldContainer">
          <TextField
            id="customerName"
            name="customerName"
            label="Name"
            type="text"
            onChange={formik.handleChange}
            value={formik.values.customerName}
          />
          {formik.errors.customerName ? (
            <span className="error">{formik.errors.customerName}</span>
          ) : null}
        </div>
        <div className="formFieldContainer">
          <TextField
            id="contactPerson"
            name="contactPerson"
            label="contact"
            type="text"
            onChange={formik.handleChange}
            value={formik.values.contactPerson}
          />
          {formik.errors.contactPerson ? (
            <span className="error">{formik.errors.contactPerson}</span>
          ) : null}
        </div>
        <div className="formFieldContainer">
          <TextField
            id="address"
            name="address"
            label="Address"
            type="text"
            onChange={formik.handleChange}
            value={formik.values.address}
          />
          {formik.errors.address ? (
            <span className="error">{formik.errors.address}</span>
          ) : null}
        </div>
        <div className="formFieldContainer">
          <TextField
            id="mobile"
            name="mobile"
            label="Mobile"
            type="number"
            onChange={formik.handleChange}
            value={formik.values.mobile}
          />
          {formik.errors.mobile ? (
            <span className="error">{formik.errors.mobile}</span>
          ) : null}
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
