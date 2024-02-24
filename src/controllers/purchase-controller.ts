import type { NextApiRequest, NextApiResponse } from "next";
import Purchases from "../models/purchase-model";

// Create a new purchase
export async function createPurchase(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Retrieve purchase data from request body
    const purchaseData = req.body;
    if (!purchaseData) {
      // If purchase data is not provided, return an error response
      return res.status(404).json({ error: "purchase data not provided" });
    }

    // Extract purchase fields from request body
    const purchaseInsertData = {
      purchaseName: req.body.purchaseName,
      price: req.body.price,
      description: req.body.description,
      categoryId: req.body.categoryId,
      purchaseDate: req.body.purchaseDate,
    };

    // Log the purchase data
    console.log("inside controller mp -- ", purchaseInsertData);

    // Insert the purchase data into the database
    Purchases.create(purchaseInsertData, (err: any, data: any) => {
      if (err)
        return res
          .status(404)
          .json({ error: "error while inserting purchase data" });
      return res.status(200).json(data);
    });
  } catch (error) {
    // Return an error response if an exception occurs
    return res
      .status(404)
      .json({ error: "error while inserting purchase data" });
  }
}

// Function to retrieve purchases within a date range
async function getPurchasesInDateRange(startDate: Date, endDate: Date) {
  return await Purchases.find({
    purchaseDate: { $gte: startDate, $lte: endDate },
  });
}

// Function to retrieve purchases for a specific category
async function getPurchasesForSpecificCategoryAndDateRange(
  startDate: Date,
  endDate: Date,
  categoryId: any
) {
  return await Purchases.find({
    categoryId: { $eq: categoryId },
    purchaseDate: { $gte: startDate, $lte: endDate },
  });
}

// Function to retrieve purchases for a specific category
async function getPurchasesBasedOnCategory(categoryId: any) {
  return await Purchases.find({
    categoryId: { $eq: categoryId },
  });
}

// Function to retrieve all purchases
async function getAllPurchases() {
  return await Purchases.find();
}

// Read all purchases
export async function readAllPurchases(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Extract date range parameters from request query
    const { firstDate, lastDate, categoryId } = req.query;
    let queryResult;
    if (firstDate && lastDate && categoryId) {
      // Retrieve purchases within the specified date range
      const startDate = new Date(firstDate.toString());
      const endDate = new Date(lastDate.toString());

      queryResult = await getPurchasesForSpecificCategoryAndDateRange(
        startDate,
        endDate,
        categoryId
      );
    } else if (firstDate && lastDate && categoryId === undefined) {
      // Retrieve purchases for a specific date
      const startDate = new Date(firstDate.toString());
      const endDate = new Date(lastDate.toString());
      queryResult = await getPurchasesInDateRange(startDate, endDate);
    } else if (
      categoryId &&
      firstDate === undefined &&
      lastDate === undefined
    ) {
      queryResult = await getPurchasesBasedOnCategory(categoryId);
    } else {
      // Retrieve all purchases if no date range is specified
      queryResult = await getAllPurchases();
    }

    if (!queryResult || queryResult.length === 0) {
      return res.status(404).json({ error: "purchases not found" });
    }

    res.status(200).json({ purchases: queryResult });
  } catch (error) {
    // Return an error response if an exception occurs
    res.status(404).json({ error: "error while fetching purchases" });
  }
}

// Update a purchase
export async function updatePurchases(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { purchaseId } = req.body;
  const { purchaseName, description, price, categoryId, purchaseDate } =
    req.body;

  // Define modified purchase details
  const modifiedPurchaseDetail = {
    purchaseName,
    description,
    price,
    categoryId,
    purchaseDate,
  };
  try {
    // Update the purchase details in the database
    const updatedPurchase = await Purchases.findByIdAndUpdate(
      purchaseId,
      modifiedPurchaseDetail
    );
    return res.status(200).json({ updatedPurchase });
  } catch (error) {
    // Return an error response if an exception occurs
    return res.status(404).json({ error: error });
  }
}

// Delete a purchase
export async function deletePurchases(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Extract purchase ID from request query
    const { purchaseId } = req.query;

    // Delete the purchase from the database
    const deletedPurchase = await Purchases.findByIdAndDelete(purchaseId);
    return res.status(201).json({ message: deletedPurchase });
  } catch (error) {
    // Return an error response if an exception occurs
    return res.status(404).json({ error: error });
  }
}
