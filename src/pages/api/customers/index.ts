// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import {
  readAllCustomer,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} from "../../../controllers/customer-controller";
import mongoose from "mongoose";

mongoose.set("strictQuery", false);

type Data = {
  name: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  mongoose
    .connect("mongodb://localhost:27017/my-sales", {
      retryWrites: true,
      w: "majority",
    })
    .then(() => {
      console.log("connected to mongo db ");
    })
    .catch((err) => {
      console.log(err);
    });

  switch (req.method) {
    case "GET":
      readAllCustomer(req, res);
      break;
    case "POST":
      createCustomer(req, res);
      break;
    case "PATCH":
      updateCustomer(req, res);
      break;
    case "DELETE":
      deleteCustomer(req, res);
      break;
  }
}
