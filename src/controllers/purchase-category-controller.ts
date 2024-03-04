import type { NextApiRequest, NextApiResponse } from "next";
import mongoose from "mongoose";
import PurchaseCategory from "../models/purchase-category-model";

export async function createCategory(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const categoryData = req.body;
    if (!categoryData) {
      res.status(404).json({ error: "category data not provided" });
    }
    PurchaseCategory.create(categoryData, (err: any, data: any) => {
      if (err) res.status(404).json({ error: "error while insertin  data" });
      return res.status(200).json(data);
    });
  } catch (error) {
    res.status(404).json({ error: "error while inserting category data" });
  }
}

async function getAllCategory(page: number, pageSize: number) {
  const skipCount = (page - 1) * pageSize;
  const categoryRecords = await PurchaseCategory.find()
    .skip(skipCount)
    .limit(pageSize);
  const categoryCount = await PurchaseCategory.countDocuments({});
  const result = { categoryCount, categoryRecords };
  return result;
}

async function getAllCategoryWithoutPagination() {
  const categoryRecords = await PurchaseCategory.find();
  const categoryCount = await PurchaseCategory.countDocuments({});
  const result = { categoryCount, categoryRecords };
  return result;
}

export async function readAllCategory(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    let queryResult: any;
    const { page, pageSize } = req.query;
    if (!page && !pageSize) {
      queryResult = await getAllCategoryWithoutPagination();
    } else {
      queryResult = await getAllCategory(Number(page), Number(pageSize));
    }
    if (!queryResult || queryResult.categoryCount === 0) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.status(200).json({
      category: queryResult.categoryRecords,
      totalRecords: queryResult.categoryCount,
    });
  } catch (error) {
    res.status(404).json({ error: "error while fetching  purchase category" });
  }
}

export async function updateCategory(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { categoryId } = req.body;
  const { categoryName } = req.body;

  const modifiedCustomerDetail = {
    categoryName: categoryName,
  };
  try {
    const updatedCategory = await PurchaseCategory.findByIdAndUpdate(
      categoryId,
      modifiedCustomerDetail
    );
    return res.status(200).json({ updatedCategory });
  } catch (error) {
    return res.status(404).json({ error: error });
  }
}

export async function deleteCategory(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { categoryId } = req.query;
    const deletedCategory = await PurchaseCategory.findByIdAndDelete(
      categoryId
    );
    return res.status(201).json({ message: deletedCategory });
  } catch (error) {
    return res.status(404).json({ error: error });
  }

  //   return customers
  //     .findByIdAndDelete(customer_id)
  //     .then((customer) =>
  //       customer
  //         ? res.status(201).json({ message: "customer deleted" })
  //         : res.status(400).json({ message: "customer not found" })
  //     )
  //     .catch((error) => res.status(500).json({ error }));
}
