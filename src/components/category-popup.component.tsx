import React, { useState, useEffect } from "react";
import { Box, Button, Modal, TextField, Typography } from "@mui/material";

function CategoryPopup(props: any) {
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
  interface IcategoryForm {
    categoryName: string;
  }
  const initialValues: IcategoryForm = {
    categoryName: "",
  };
  const [values, setValues] = useState<IcategoryForm>(initialValues);
  const [errors, setErrors] = useState<any>(null);

  useEffect(() => {
    if (props.recordForEdit != null) {
      setValues(props.recordForEdit);
    }
  }, [props.recordForEdit]);

  useEffect(() => {
    if (props.saveSuccess) {
      resetFormValues();
    }
  }, [props.saveSuccess]);

  const resetFormValues = () => {
    setValues({ ...initialValues });
    setErrors(null);
  };

  const title = "Add/Update Category";
  const handleInputChange = (e: any) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const validate = () => {
    let tmp: any = {};
    console.log("validate--catfff-", values.categoryName);
    tmp.categoryName = values.categoryName ? "" : "Category Name is required";
    setErrors({ ...tmp });
    return Object.values(tmp).every((x) => x == "");
  };
  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (validate()) {
      props.categoryFromSubmit(values);
    }
  };
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
        name="categoryForm"
        sx={{
          "& .MuiTextField-root": { mt: 1, p: 1, width: "95%" },
          height: "500px",
          backgroundColor: "#b2ebf2",
        }}
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit}
      >
        <h3 className="title">{title}</h3>

        <div className="formFieldContainer">
          <TextField
            id="categoryName"
            name="categoryName"
            label="Category Name"
            type="text"
            value={values.categoryName}
            onChange={handleInputChange}
            {...(errors && { error: true, helperText: errors.categoryName })}
          />
        </div>
        <div
          className="formFieldContainer"
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          <Button
            variant="outlined"
            style={{
              background: "#00838f",
              color: "white",
              marginTop: "5px",
            }}
            type="submit"
          >
            {!props.editMode ? "Add category" : "Update category"}
          </Button>
          <Button
            variant="outlined"
            style={{
              background: "#00838f",
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

export default CategoryPopup;
