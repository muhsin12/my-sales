import type { NextApiRequest, NextApiResponse } from "next";
import mongoose from "mongoose";
import Category from "../models/category-model";

export async function createCategory(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const categoryData = req.body;
    if (!categoryData) {
      return res.status(400).json({ error: "Category data not provided" });
    }

    // Create a new category document
    const category = await Category.create(categoryData);

    return res.status(201).json(category);
  } catch (error) {
    console.error("Error while inserting category data:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function getAllCategory(page: number, pageSize: number) {
  const skipCount = (page - 1) * pageSize;
  const categoryRecords = await Category.find().skip(skipCount).limit(pageSize);
  const categoryCount = await Category.countDocuments({});
  const result = { categoryCount, categoryRecords };
  return result;
}

async function getAllCategoryWithoutPagination() {
  const categoryRecords = await Category.find();
  const categoryCount = await Category.countDocuments({});
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
    res.status(404).json({ error: "error while fetching category" });
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
    const updatedCategory = await Category.findByIdAndUpdate(
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
    const deletedCategory = await Category.findByIdAndDelete(categoryId);
    return res.status(201).json({ message: deletedCategory });
  } catch (error) {
    return res.status(404).json({ error: error });
  }
}
