const { connectToDatabase } = require("../db");
import type { NextApiRequest, NextApiResponse } from "next";
import {
  readAllSales,
  createSales,
  updateSales,
  deleteSales,
} from "../../../controllers/sales-controller";

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
          readAllSales(req, res);
          break;
        case "POST":
          createSales(req, res);
          break;
        case "PATCH":
          updateSales(req, res);
          break;
        case "DELETE":
          deleteSales(req, res);
          break;
      }
    })
    .catch((err: any) => {
      console.log("this is mongo mmp error---", err);
    });
}
