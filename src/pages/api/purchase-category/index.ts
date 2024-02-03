const { connectToDatabase } = require("../db");
import type { NextApiRequest, NextApiResponse } from "next";
import {
  readAllCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../../controllers/purchase-category-controller";

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
          readAllCategory(req, res);
          break;
        case "POST":
          createCategory(req, res);
          break;
        case "PATCH":
          updateCategory(req, res);
          break;
        case "DELETE":
          deleteCategory(req, res);
          break;
      }
    })
    .catch((err: any) => {
      console.log("this is mongo mmp error---", err);
    });
}
