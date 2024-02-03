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

export async function readAllCategory(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const category = await Category.find();
    // console.log("mpmuhins   .... .. .. ..  category----", category);
    if (!category) {
      return res.status(404).json({ error: "category not found" });
    }
    res.status(200);
    return res.json({ category });
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

  //   return customers
  //     .findByIdAndDelete(customer_id)
  //     .then((customer) =>
  //       customer
  //         ? res.status(201).json({ message: "customer deleted" })
  //         : res.status(400).json({ message: "customer not found" })
  //     )
  //     .catch((error) => res.status(500).json({ error }));
}
