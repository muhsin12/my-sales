import type { NextApiRequest, NextApiResponse } from "next";
const { connectToDatabase } = require("../db");
import {
  readAllProducts,
  createProduct,
  updateProducts,
  deleteProducts,
} from "../../../controllers/product-controller";

type Data = {
  name: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  connectToDatabase()
    .then(() => {
      console.log("connected to mongo db ");
      switch (req.method) {
        case "GET":
          readAllProducts(req, res);
          break;
        case "POST":
          createProduct(req, res);
          break;
        case "PATCH":
          updateProducts(req, res);
          break;
        case "DELETE":
          deleteProducts(req, res);
          break;
      }
    })
    .catch((err: any) => {
      console.log("this is mongo mmp error---", err);
    });
}
