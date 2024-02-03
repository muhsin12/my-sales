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
      res.status(404).json({ error: "sales data not provided" });
    }

    getNextSequence()
      .then((salesId) => {
        console.log("result-", salesId);
        const salesInsertData = {
          salesTotal: req.body.totalPrice,
          salesDate: new Date(),
          salesId: salesId,
        };
        let salesDetails = req.body.details;
        Sales.create(salesInsertData, (err: any, data: any) => {
          console.log("my sales-mp--", data);
          if (err)
            res.status(404).json({ error: "error while inserting Sales data" });
          let prodId = mongoose.Types.ObjectId;
          let salesid = mongoose.Types.ObjectId;
          salesDetails.forEach((el: any) => {
            let salesDetailsData = {
              salesId: new salesid(data._id),
              itemId: new prodId(el.itemId),
              itemName: el.itemName,
              price: el.price,
              quantity: el.quantity,
              itemPrice: el.itemPrice,
            };
            console.log("sales details data----mp-", salesDetailsData);
            SalesDetails.create(salesDetailsData, (err: any, data: any) => {
              if (err) console.log("sales deail errrrror--", err);
              console.log("after sales detail inserted-", data);
            });
          });
        });
      })
      .catch((error) => {
        console.error(error);
      });
  } catch (error) {
    res.status(404).json({ error: "error while inserting Sales data" });
  }
}

export async function readAllSales(req: NextApiRequest, res: NextApiResponse) {
  try {
    // const agg = [
    //   {
    //     $lookup: {
    //       from: "categories",
    //       localField: "categoryId",
    //       foreignField: "_id",
    //       as: "productCategory",
    //     },
    //   },
    // ];

    // const products = await Sales.aggregate(agg);

    const sales = await Sales.find();

    if (!sales) {
      return res.status(404).json({ error: "Sales not found" });
    }
    res.status(200);
    return res.json({ sales });
  } catch (error) {
    res.status(404).json({ error: "error while fetching Sales" });
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
