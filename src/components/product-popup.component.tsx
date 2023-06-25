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
import { fetchCategories } from "../services/category-service";

function ProductPopup(props: any) {
  const [categoryList, setCategoryList] = useState([]);
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

  interface IproductForm {
    productName: string;
    description: string;
    price: number;
    categoryId: string;
  }
  const initialValues: IproductForm = {
    productName: "",
    description: "",
    price: 0,
    categoryId: "",
  };
  const [values, setValues] = useState<IproductForm>(initialValues);
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
    tmp.productName = values.productName ? "" : "Item Name is required";
    tmp.price = values.price ? "" : "Price is required";
    setErrors({ ...tmp });
    return Object.values(tmp).every((x) => x == "");
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (validate()) {
      props.productFormSubmit(values);
    }
  };
  const title = "Add/Update Item";
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
        name="productForm"
        sx={{
          "& .MuiTextField-root": { mt: 2, p: 1, width: "95%" },
          height: "500px",
          backgroundColor: "#b2ebf2",
        }}
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit}
      >
        <h3 className="title">{title}</h3>
        <div className="formFieldContainer">
          <FormControl sx={{ m: 1, minWidth: 250 }}>
            <InputLabel id="demo-simple-select-label">Category</InputLabel>
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
            id="productName"
            name="productName"
            label="Item Name"
            type="text"
            value={values.productName}
            onChange={handleInputChange}
            {...(errors && { error: true, helperText: errors.productName })}
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

export default ProductPopup;
