import * as React from "react";
import Container from "@mui/material/Container";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete";

import { useState, useEffect } from "react";

import Nav from "../nav";

import { fetchItem } from "../../services/item-service";
import { fetchCategories } from "../../services/category-service";
import { createSales } from "@/services/sales-service";
import ConfirmBox from "@/components/confirm-popup.component";

interface Iproduct {
  _id: string;
  productName: string;
  price: number;
  description: string;
  categoryId: string;
  productCategory?: any;
}
interface IbillItems {
  itemId: string;
  itemName: string;
  quantity: number;
  price: number;
  itemPrice: number;
}
interface Isales {
  _id: string;
  itemDetails: IbillItems[];
  totalAmount: number;
}

export default function Home() {
  const [categories, setCategories] = useState<Iproduct[]>([]);
  const [items, setItems] = useState<Iproduct[]>([]);
  const [itemList, setItemList] = useState<Iproduct[]>([]);
  const [billItems, setBillItems] = useState<IbillItems[]>([]);
  const [billTotal, setBillTotal] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  useEffect(() => {
    if (billItems.length > 0) {
      setIsButtonDisabled(false);
    } else {
      setIsButtonDisabled(true);
    }
  }, [billItems]);

  useEffect(() => {
    getAllCategories();
    getAllItems();
  }, []);
  useEffect(() => {
    findBillTotal();
  }, [billItems]);

  const getAllCategories = () => {
    fetchCategories()
      .then((res) => res.json())
      .then((data) => {
        setCategories(data.category);
      });
  };

  const getAllItems = () => {
    fetchItem()
      .then((res) => res.json())
      .then((data) => {
        setItems(data.products);
        setItemList(data.products);
      });
  };

  console.log("items in sales page--", items);
  const filterItems = (catId: any) => {
    setItemList(items.filter((el) => el.categoryId == catId));
  };
  const addToBill = (itemId: String) => {
    let index = billItems.findIndex((x) => x.itemId == itemId);
    if (index === -1) {
      let tmpBillItems = [...billItems];
      let tmpItem = items.filter((el) => el._id == itemId)[0];
      let addedItem: any = {
        itemId: tmpItem._id,
        itemName: tmpItem.productName,
        quantity: 1,
        price: tmpItem.price,
        itemPrice: tmpItem.price,
      };
      tmpBillItems.push(addedItem);
      setBillItems(tmpBillItems);
    }
  };
  const updateQuantity = (mode: number, itemId: string) => {
    let index = billItems.findIndex((x) => x.itemId == itemId);
    if (mode == 1) {
      if (billItems[index].quantity > 1) {
        billItems[index].quantity = billItems[index].quantity - 1;
        billItems[index].itemPrice =
          billItems[index].quantity * billItems[index].price;
      }
    } else {
      billItems[index].quantity = billItems[index].quantity + 1;
      billItems[index].itemPrice =
        billItems[index].quantity * billItems[index].price;
    }
    console.log("bill items-", billItems[index]);
    setBillItems([...billItems]);
  };

  const removeItemFromBill = (itemId: string) => {
    let index = billItems.findIndex((x) => x.itemId == itemId);
    billItems.splice(index, 1);
    setBillItems([...billItems]);
  };

  const findBillTotal = () => {
    const sum = billItems.reduce((accumulator, object) => {
      return accumulator + object.itemPrice;
    }, 0);
    setBillTotal(sum);
  };
  const createSale = () => {
    let salesData: any = {};
    salesData.details = billItems;
    salesData.totalPrice = billTotal;
    createSales(salesData, false).then((res) => {
      console.log("after sales created---", res);
      setBillItems([]);
    });
  };

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleConfirmAction = () => {
    console.log("Confirmed");
    // Your confirm action here
    createSale();
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
          context={"ceate this sale"}
          data={billItems}
          totalAmount={billTotal}
        />
        <Box sx={{ bgcolor: "#b2ebf2", height: "100px", overflowX: "auto" }}>
          <Grid
            container
            spacing={2}
            className="cat-grid-row"
            sx={{ display: "flex", flexWrap: "nowrap", padding: "8px" }}
          >
            {categories.map((cat: any) => (
              <Grid key={cat._id} item>
                <Button
                  variant="outlined"
                  size="large"
                  className="category-button"
                  onClick={() => filterItems(cat._id)}
                >
                  {cat.categoryName}
                </Button>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Box sx={{ bgcolor: "white", height: "70vh" }}>
          <div className="sales-wrapper">
            <div className="sales-left">
              <Grid container spacing={3} className="main-grid-row">
                {itemList.map((item: any) => (
                  <Grid key={item._id} xs={3}>
                    <Card className="item-card">
                      <CardContent>{item.productName}</CardContent>
                      <CardContent>{item.price} KD</CardContent>
                      <CardActions disableSpacing>
                        <Button
                          onClick={() => addToBill(item._id)}
                          size="small"
                          color="secondary"
                        >
                          Add to Bill
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </div>
            <div className="sales-right">
              <TableContainer component={Paper} style={{ maxHeight: 550 }}>
                <Table sx={{ minWidth: 250 }} aria-label="simple table">
                  <TableHead>
                    <TableRow className="bill-table-row">
                      <TableCell className="bill-table-head">Item</TableCell>
                      <TableCell className="bill-table-head">
                        Quantity
                      </TableCell>
                      <TableCell className="bill-table-head">Price</TableCell>
                      <TableCell className="bill-table-head">
                        ItemPrice
                      </TableCell>
                      <TableCell className="bill-table-head">Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {billItems.map((item) => (
                      <TableRow
                        key={item.itemId}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell>{item.itemName}</TableCell>
                        <TableCell>
                          <RemoveIcon
                            className="quantity-update-button"
                            sx={{ color: "red" }}
                            onClick={() => updateQuantity(1, item.itemId)}
                          />
                          <span className="item-quantity">{item.quantity}</span>
                          <AddIcon
                            className="quantity-update-button"
                            color="primary"
                            onClick={() => updateQuantity(2, item.itemId)}
                          />
                        </TableCell>
                        <TableCell>{item.price}</TableCell>
                        <TableCell>{item.itemPrice}</TableCell>
                        <TableCell>
                          <DeleteIcon
                            className="quantity-update-button"
                            sx={{ color: "red" }}
                            onClick={() => removeItemFromBill(item.itemId)}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <div className="bill-footer">
                <Typography>Total:{billTotal}</Typography>
              </div>
              <div>
                <Button
                  variant="outlined"
                  size="large"
                  className="category-button"
                  disabled={isButtonDisabled}
                  onClick={() => handleOpenDialog()}
                >
                  Create Sales
                </Button>
              </div>
            </div>
          </div>
        </Box>
      </Container>
    </>
  );
}
