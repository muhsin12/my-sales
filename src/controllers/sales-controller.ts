import type { NextApiRequest, NextApiResponse } from "next";
import mongoose from "mongoose";
import Sales from "../models/sales-model";
import SalesDetails from "../models/sales-details-model";

export async function createSales(req: NextApiRequest, res: NextApiResponse) {
  try {
    const salesData = req.body;
    if (!salesData) {
      res.status(404).json({ error: "sales data not provided" });
    }

    const salesInsertData = {
      salesTotal: req.body.totalPrice,
      salesDate: new Date(),
    };
    let salesDetails = req.body.details;
    console.log("inside controller mp -- ", salesInsertData);

    Sales.create(salesInsertData, (err: any, data: any) => {
      if (err)
        res.status(404).json({ error: "error while inserting Sales data" });
      console.log("sales insertedd----", data);
      //   return res.status(200).json(data);
      let salesId = data._id;
      let prodId = mongoose.Types.ObjectId;
      salesDetails.forEach((el: any) => {
        let salesDetailsData = {
          salesId: salesId,
          itemId: new prodId(el.itemId),
          itemName: el.itemName,
          price: el.price,
        };
        SalesDetails.create(salesDetailsData, (err: any, data: any) => {
          console.log("sales details inserted----", data);
          return res.status(200).json(data);
        });
      });
    });
  } catch (error) {
    res.status(404).json({ error: "error while inserting Sales data" });
  }
}

// const readproduct = (req: Request, res: Response, next: NextFunction) => {
//   const product_id = req.params.productId;
//   return products
//     .findById(product_id)
//     .then((product) =>
//       product
//         ? res.status(200).json({ product })
//         : res.status(400).json({ message: "product not found" })
//     )
//     .catch((error) => res.status(500).json({ error }));
// };

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
    const { productId } = req.query;
    const deletedProduct = await Sales.findByIdAndDelete(productId);
    return res.status(201).json({ message: deletedProduct });
  } catch (error) {
    return res.status(404).json({ error: error });
  }

  //   return Products
  //     .findByIdAndDelete(customer_id)
  //     .then((customer) =>
  //       customer
  //         ? res.status(201).json({ message: "customer deleted" })
  //         : res.status(400).json({ message: "customer not found" })
  //     )
  //     .catch((error) => res.status(500).json({ error }));
}
