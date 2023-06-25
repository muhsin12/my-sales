// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import {
  readAllCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../../controllers/category-controller";
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
    .catch((err) => {
      console.log("this is mongo mmp error---", err);
    });
}
