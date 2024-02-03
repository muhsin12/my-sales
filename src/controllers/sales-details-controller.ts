import type { NextApiRequest, NextApiResponse } from "next";
import mongoose from "mongoose";
import SalesDetails from "../models/sales-details-model";

export async function createSales(req: NextApiRequest, res: NextApiResponse) {}

export async function readSalesDetails(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { salesId } = req.body;
  try {
    const salesDetails = await SalesDetails.find({ salesId: salesId });

    if (!salesDetails) {
      return res.status(404).json({ error: "salesDetails not found" });
    }
    res.status(200);
    return res.json({ salesDetails });
  } catch (error) {
    res.status(404).json({ error: "error while fetching salesDetails" });
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
    const updateProducts = await SalesDetails.findByIdAndUpdate(
      productId,
      modifiedProductDetail
    );
    return res.status(200).json({ updateProducts });
  } catch (error) {
    return res.status(404).json({ error: error });
  }
}

export async function deleteSalesDetail(salesId: any) {
  try {
    const deletedSalesRecord = await SalesDetails.deleteMany({ salesId });
    console.log("sales detail delete =", deletedSalesRecord);
    return deletedSalesRecord.acknowledged;
  } catch (error) {
    return { error: error };
  }
}
