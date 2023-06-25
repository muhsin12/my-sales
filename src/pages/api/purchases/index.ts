// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import {
  readAllPurchases,
  createPurchase,
  updatePurchases,
  deletepurchases,
} from "../../../controllers/purchase-controller";
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
          readAllPurchases(req, res);
          break;
        case "POST":
          createPurchase(req, res);
          break;
        case "PATCH":
          updatePurchases(req, res);
          break;
        case "DELETE":
          deletepurchases(req, res);
          break;
      }
    })
    .catch((err) => {
      console.log("this is mongo mmp error---", err);
    });
}
