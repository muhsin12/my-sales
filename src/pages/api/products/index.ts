// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import {
  readAllProducts,
  createProduct,
  updateProducts,
  deleteProducts,
} from "../../../controllers/product-controller";
import mongoose from "mongoose";

mongoose.set("strictQuery", false);

type Data = {
  name: string;
};

const mongoURI = `mongodb+srv://dlSales:dlSales@dl-sales.sst2qkr.mongodb.net/dlSales?retryWrites=true&w=majority`;

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  mongoose
    .connect(mongoURI, {
      retryWrites: true,
      w: "majority",
    })
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
    .catch((err) => {
      console.log("this is mongo mmp error---", err);
    });
}
