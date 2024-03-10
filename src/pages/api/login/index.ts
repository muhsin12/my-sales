import type { NextApiRequest, NextApiResponse } from "next";
const { connectToDatabase } = require("../db");
import { loginUser } from "../../../controllers/user-controller";
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
      loginUser(req, res);
    })
    .catch((err: any) => {
      console.log("this is mongo connection error---", err);
    });
}
