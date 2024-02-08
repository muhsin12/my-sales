import type { NextApiRequest, NextApiResponse } from "next";
import Products from "../models/product-model";

export async function createProduct(req: NextApiRequest, res: NextApiResponse) {
  try {
    const productData = req.body;
    if (!productData) {
      res.status(404).json({ error: "product data not provided" });
    }

    const productInsertData = {
      productName: req.body.productName,
      price: req.body.price,
      description: req.body.description,
      categoryId: req.body.categoryId,
    };

    Products.create(productInsertData, (err: any, data: any) => {
      if (err)
        res.status(404).json({ error: "error while inserting product data" });
      return res.status(200).json(data);
    });
  } catch (error) {
    res.status(404).json({ error: "error while inserting product data" });
  }
}

export async function readAllProducts(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const products = await Products.find();

    if (!products) {
      return res.status(404).json({ error: "products not found" });
    }
    res.status(200);
    return res.json({ products });
  } catch (error) {
    res.status(404).json({ error: "error while fetching products" });
  }
}

export async function updateProducts(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { productId } = req.body;
  const { productName, description, price, categoryId } = req.body;

  const modifiedProductDetail = {
    productName,
    description,
    price,
    categoryId,
  };
  try {
    const updateProducts = await Products.findByIdAndUpdate(
      productId,
      modifiedProductDetail
    );
    return res.status(200).json({ updateProducts });
  } catch (error) {
    return res.status(404).json({ error: error });
  }
}

export async function deleteProducts(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { productId } = req.query;
    const deletedProduct = await Products.findByIdAndDelete(productId);
    return res.status(201).json({ message: deletedProduct });
  } catch (error) {
    return res.status(404).json({ error: error });
  }
}
