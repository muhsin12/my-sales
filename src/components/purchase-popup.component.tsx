import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  TextField,
} from "@mui/material";
import { fetchCategories } from "../services/expense-category-service";

function PurchasePopup(props: any) {
  const [categoryList, setCategoryList] = useState([]);
  function getModalStyle() {
    const top = 0;
    const left = 0;

    return {
      top: `${top}%`,
      margin: "auto",
      left: `${left}%`,
      transform: `translate(-${top}%, -${left}%)`,
      height: "535px",
      width: "500px",
    };
  }

  interface IpurchaseForm {
    purchaseName: string;
    description: string;
    price: number;
    categoryId: string;
    purchaseDate: string;
  }
  const initialValues: IpurchaseForm = {
    purchaseName: "",
    description: "",
    price: 0,
    categoryId: "",
    purchaseDate: "",
  };
  const [values, setValues] = useState<IpurchaseForm>(initialValues);
  const [errors, setErrors] = useState<any>(null);

  useEffect(() => {
    fetchCategories()
      .then((res) => res.json())
      .then((data) => {
        setCategoryList(data.category);
      });
  }, []);

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

  const handleInputChange = (e: any) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const validate = () => {
    let tmp: any = {};
    tmp.purchaseName = values.purchaseName ? "" : "Purchase Name is required";
    tmp.price = values.price ? 0 : "Price is required";
    setErrors({ ...tmp });
    return Object.values(tmp).every((x) => x == "");
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (validate()) {
      props.purchaseFormSubmit(values);
    }
  };
  const title = "Add/Update Purchase";
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
        name="puchaseForm"
        sx={{
          "& .MuiTextField-root": { mt: 2, p: 1, width: "65%" },
          height: "535px",
          width: "500px",
          backgroundColor: "#b2ebf2",
        }}
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit}
      >
        <h3 className="title">{title}</h3>
        <div className="formFieldContainer">
          <FormControl sx={{ m: 1, minWidth: 250 }}>
            <InputLabel id="demo-simple-select-label">
              Purchase Category
            </InputLabel>
            <Select
              id="categoryId"
              name="categoryId"
              value={values.categoryId}
              label="Category"
              onChange={handleInputChange}
            >
              {categoryList.map((category: any) => (
                <MenuItem key={category._id} value={category._id}>
                  {category.categoryName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className="formFieldContainer">
          <TextField
            variant="outlined"
            id="purchaseName"
            name="purchaseName"
            label="Item Name"
            type="text"
            value={values.purchaseName}
            onChange={handleInputChange}
            {...(errors && { error: true, helperText: errors.purchaseName })}
          />
        </div>
        <div className="formFieldContainer">
          <TextField
            variant="outlined"
            id="description"
            name="description"
            label="Description"
            type="text"
            value={values.description}
            onChange={handleInputChange}
          />
        </div>
        <div className="formFieldContainer">
          <TextField
            variant="outlined"
            id="price"
            name="price"
            label="price"
            type="text"
            value={values.price}
            onChange={handleInputChange}
            {...(errors && { error: true, helperText: errors.price })}
          />
        </div>
        <div className="formFieldContainer">
          <TextField
            sx={{ m: 1, minWidth: 250 }}
            id="purchaseDate"
            name="purchaseDate"
            label="purchase Date"
            type="date"
            value={values.purchaseDate}
            onChange={handleInputChange}
            {...(errors && { error: true, helperText: errors.price })}
            InputLabelProps={{
              shrink: true,
            }}
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
            {!props.editMode ? "Add Item" : "Update Item"}
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

export default PurchasePopup;
