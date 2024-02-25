import type { NextApiRequest, NextApiResponse } from "next";
import mongoose from "mongoose";
import Counter from "../models/counter-model";
import Sales from "../models/sales-model";
import SalesDetails from "../models/sales-details-model";
import { deleteSalesDetail } from "./sales-details-controller";

async function getNextSequence() {
  try {
    let seqId;

    // Using await with findOneAndUpdate to make it asynchronous
    const cd = await Counter.findOneAndUpdate(
      { id: "salesId" },
      { $inc: { seq: 1 } },
      { new: true }
    );
    if (cd == null) {
      const newVal = new Counter({ id: "salesId", seq: 100 });
      await newVal.save();
      seqId = 100;
    } else {
      seqId = cd.seq;
    }

    return seqId;
  } catch (error) {
    console.error(error);
    throw error; // rethrow the error if needed
  }
}

export async function createSales(req: NextApiRequest, res: NextApiResponse) {
  try {
    const salesData = req.body;
    if (!salesData) {
      return res.status(404).json({ error: "sales data not provided" });
    }

    // Get the next sequence for the salesId
    getNextSequence()
      .then((salesId) => {
        const salesInsertData = {
          salesTotal: req.body.totalPrice,
          salesDate: new Date(),
          salesId: salesId,
        };
        let salesDetails = req.body.details;

        // Create the main sales record
        Sales.create(salesInsertData, (err: any, mainSalesRecord: any) => {
          if (err) {
            return res
              .status(404)
              .json({ error: "error while inserting Sales data" });
          }

          // Log the main sales record
          console.log("main sales record--1--", mainSalesRecord);

          const mainSalesId = mainSalesRecord._id;

          // Create sales details records
          const promises = salesDetails.map((el: any) => {
            return new Promise((resolve, reject) => {
              let salesDetailsData = {
                salesId: mainSalesId,
                itemId: el.itemId,
                itemName: el.itemName,
                price: el.price,
                quantity: el.quantity,
                itemPrice: el.itemPrice,
              };

              // Create each sales details record
              SalesDetails.create(salesDetailsData, (err: any, data: any) => {
                if (err) {
                  reject(err);
                  return;
                }
                // Log each sales details record
                console.log("sales details record---2---", data);
                resolve(data);
              });
            });
          });

          // Wait for all promises to resolve
          Promise.all(promises)
            .then((results) => {
              // Return success message
              res
                .status(200)
                .json({ message: "Sales data inserted successfully" });
            })
            .catch((error) => {
              // Handle error while inserting sales details
              console.error(error);
              res
                .status(500)
                .json({ error: "Error while inserting sales details" });
            });
        });
      })
      .catch((error) => {
        // Handle error while getting next sequence
        console.error(error);
        res.status(500).json({ error: "Error while creating sales record" });
      });
  } catch (error) {
    // Handle any other errors
    res.status(500).json({ error: "Error while processing request" });
  }
}

// Function to retrieve sales within a date range
async function getSalesInDateRange(startDate: Date, endDate: Date) {
  return await Sales.find({
    salesDate: { $gte: startDate, $lte: endDate },
  });
}

// Function to retrieve all purchases
async function getAllSales() {
  return await Sales.find();
}
// read all sales
export async function readAllSales(req: NextApiRequest, res: NextApiResponse) {
  console.log("reqest object url---", req.url);
  try {
    // Extract date range parameters from request query
    const { firstDate, lastDate } = req.query;
    let queryResult;
    if (firstDate && lastDate) {
      // Retrieve purchases for a specific date
      const startDate = new Date(firstDate.toString());
      const endDate = new Date(lastDate.toString());
      queryResult = await getSalesInDateRange(startDate, endDate);
    } else {
      // Retrieve all purchases if no date range is specified
      queryResult = await getAllSales();
    }

    if (!queryResult || queryResult.length === 0) {
      return res.status(404).json({ error: "Sales not found" });
    }

    res.status(200).json({ sales: queryResult });
  } catch (error) {
    // Return an error response if an exception occurs
    res.status(404).json({ error: "error while fetching sales" });
  }
}

export async function updateSales(req: NextApiRequest, res: NextApiResponse) {
  const { productId } = req.body;
  const { productName, description, price } = req.body;

  const modifiedProductDetail = {
    productName,
    description,
    price,
  };
  try {
    const updateProducts = await Sales.findByIdAndUpdate(
      productId,
      modifiedProductDetail
    );
    return res.status(200).json({ updateProducts });
  } catch (error) {
    return res.status(404).json({ error: error });
  }
}

export async function deleteSales(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { salesId } = req.query;
    const salesDetailDeleted = await deleteSalesDetail(salesId);
    if (salesDetailDeleted) {
      const deletedSalesRecord = await Sales.findByIdAndDelete(salesId);
      return res.status(201).json({ message: deletedSalesRecord });
    }
  } catch (error) {
    return res.status(404).json({ error: error });
  }
}
