const { connectToDatabase } = require("../db");
import type { NextApiRequest, NextApiResponse } from "next";
import {
  readAllPurchases,
  createPurchase,
  updatePurchases,
  deletePurchases,
} from "../../../controllers/purchase-controller";

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
          readAllPurchases(req, res);
          break;
        case "POST":
          createPurchase(req, res);
          break;
        case "PATCH":
          updatePurchases(req, res);
          break;
        case "DELETE":
          deletePurchases(req, res);
          break;
      }
    })
    .catch((err: any) => {
      console.log("this is mongo mmp error---", err);
    });
}
