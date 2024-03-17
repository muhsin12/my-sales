import type { NextApiRequest, NextApiResponse } from "next";
const { connectToDatabase } = require("../db");
import {
  readAllUser,
  createUser,
  updateUser,
  deleteUser,
} from "../../../controllers/user-controller";
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
          readAllUser(req, res);
          break;
        case "POST":
          createUser(req, res);
          break;
        case "PATCH":
          updateUser(req, res);
          break;
        case "DELETE":
          deleteUser(req, res);
          break;
      }
    })
    .catch((err: any) => {
      console.log("this is mongo connection error---", err);
    });
}
