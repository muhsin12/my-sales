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

async function getProductsBasedOnCategory(
  categoryId: any,
  page: number,
  pageSize: number
) {
  const skipCount = (page - 1) * pageSize;
  const productRecords = await Products.find({
    categoryId: { $eq: categoryId },
  })
    .skip(skipCount)
    .limit(pageSize);
  const productCount = await Products.countDocuments({
    categoryId: { $eq: categoryId },
  });
  const result = { productCount, productRecords };
  return result;
}

// Function to retrieve all purchases
async function getAllProducts(page: number, pageSize: number) {
  const skipCount = (page - 1) * pageSize;
  const productRecords = await Products.find().skip(skipCount).limit(pageSize);
  const productCount = await Products.countDocuments({});
  const result = { productCount, productRecords };
  return result;
}

async function getAllProductsWithoutPagination() {
  const productRecords = await Products.find();
  const productCount = await Products.countDocuments({});
  const result = { productCount, productRecords };
  return result;
}

export async function readAllProducts(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    let queryResult: any;
    const { categoryId, page, pageSize } = req.query;
    if (!categoryId && !page && !pageSize) {
      queryResult = await getAllProductsWithoutPagination();
    } else if (categoryId) {
      queryResult = await getProductsBasedOnCategory(
        categoryId,
        Number(page),
        Number(pageSize)
      );
    } else {
      queryResult = await getAllProducts(Number(page), Number(pageSize));
    }

    if (!queryResult || queryResult.productCount === 0) {
      return res.status(404).json({ error: "purchases not found" });
    }
    res.status(200).json({
      products: queryResult.productRecords,
      totalProducts: queryResult.productCount,
    });
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
