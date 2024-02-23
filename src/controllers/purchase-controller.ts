import type { NextApiRequest, NextApiResponse } from "next";
import mongoose from "mongoose";
import Purchases from "../models/purchase-model";

export async function createPurchase(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const purchaseData = req.body;
    if (!purchaseData) {
      res.status(404).json({ error: "purchase data not provided" });
    }

    // let catid = mongoose.Types.ObjectId;
    const purchaseInsertData = {
      purchaseName: req.body.purchaseName,
      price: req.body.price,
      description: req.body.description,
      categoryId: req.body.categoryId,
      purchaseDate: req.body.purchaseDate,
    };

    console.log("inside controller mp -- ", purchaseInsertData);

    Purchases.create(purchaseInsertData, (err: any, data: any) => {
      if (err)
        res.status(404).json({ error: "error while inserting purchase data" });
      return res.status(200).json(data);
    });
  } catch (error) {
    res.status(404).json({ error: "error while inserting purchase data" });
  }
}

export async function readAllPurchases(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { firstDate, lastDate } = req.query;
    if (firstDate && lastDate) {
      const startDate = new Date(firstDate.toString());
      const endDate = new Date(lastDate.toString());
      const dateRangePurcahses = await Purchases.find({
        purchaseDate: { $gte: startDate, $lte: endDate },
      });

      console.log("muhsin-date--", startDate);
      console.log("specificDatePurchases---", dateRangePurcahses);
      res.status(200);
      return res.json({ dateRangePurcahses });
    } else if (firstDate && lastDate == undefined) {
      const specDate = new Date(firstDate.toString());
      const specificDatePurchases = await Purchases.find({
        purchaseDate: { $eq: specDate },
      });
      res.status(200);
      return res.json({ specificDatePurchases });
    } else {
      const purchases = await Purchases.find();

      if (!purchases) {
        return res.status(404).json({ error: "purchases not found" });
      }
      res.status(200);
      return res.json({ purchases });
    }
  } catch (error) {
    res.status(404).json({ error: "error while fetching purchases" });
  }
}

export async function updatePurchases(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { purchaseId } = req.body;
  const { purchaseName, description, price, categoryId, purchaseDate } =
    req.body;

  const modifiedpurchaseDetail = {
    purchaseName,
    description,
    price,
    categoryId,
    purchaseDate,
  };
  try {
    const updatePurchases = await Purchases.findByIdAndUpdate(
      purchaseId,
      modifiedpurchaseDetail
    );
    return res.status(200).json({ updatePurchases });
  } catch (error) {
    return res.status(404).json({ error: error });
  }
}

export async function deletepurchases(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { purchaseId } = req.query;
    const deletedPurchase = await Purchases.findByIdAndDelete(purchaseId);
    return res.status(201).json({ message: deletedPurchase });
  } catch (error) {
    return res.status(404).json({ error: error });
  }
}

export async function readAllPurchasesForAdate(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const purchases = await Purchases.find();

    if (!purchases) {
      return res.status(404).json({ error: "purchases not found" });
    }
    res.status(200);
    return res.json({ purchases });
  } catch (error) {
    res.status(404).json({ error: "error while fetching purchases" });
  }
}
