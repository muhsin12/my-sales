const { connectToDatabase } = require("../db");
import type { NextApiRequest, NextApiResponse } from "next";
import {
  readSalesDetails,
  createSales,
  updateSales,
} from "../../../controllers/sales-details-controller";

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
        case "POST":
          readSalesDetails(req, res);
          break;
      }
    })
    .catch((err: any) => {
      console.log("this is mongo mmp error---", err);
    });
}
