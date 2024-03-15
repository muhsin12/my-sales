import type { NextApiRequest, NextApiResponse } from "next";
import { compare } from "bcrypt";
import Users from "../models/users-model";

export async function createUser(req: NextApiRequest, res: NextApiResponse) {
  try {
    const userData = req.body;
    if (!userData) {
      return res.status(400).json({ error: "User data not provided" });
    }

    // Create a new user document
    const user = await Users.create(userData);

    return res.status(201).json(user);
  } catch (error) {
    console.error("Error while inserting user data:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function getAllUsers(page: number, pageSize: number) {
  const skipCount = (page - 1) * pageSize;
  const userRecords = await Users.find().skip(skipCount).limit(pageSize);
  const userCount = await Users.countDocuments({});
  const result = { userCount, userRecords };
  return result;
}

async function getAllUsersWithoutPagination() {
  const userRecords = await Users.find();
  const userCount = await Users.countDocuments({});
  const result = { userCount, userRecords };
  return result;
}

export async function readAllUser(req: NextApiRequest, res: NextApiResponse) {
  try {
    let queryResult: any;
    const { page, pageSize } = req.query;

    if (!page && !pageSize) {
      queryResult = await getAllUsersWithoutPagination();
    } else {
      queryResult = await getAllUsers(Number(page), Number(pageSize));
    }
    if (!queryResult || queryResult.userCount === 0) {
      return res.status(404).json({ error: "user not found" });
    }
    res.status(200).json({
      user: queryResult.userRecords,
      totalRecords: queryResult.userCount,
    });
  } catch (error) {
    res.status(404).json({ error: "error while fetching user" });
  }
}

export async function updateUser(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = req.body;
  const { userName } = req.body;

  const modifiedCustomerDetail = {
    userName: userName,
  };
  try {
    const updatedUser = await Users.findByIdAndUpdate(
      userId,
      modifiedCustomerDetail
    );
    return res.status(200).json({ updatedUser });
  } catch (error) {
    return res.status(404).json({ error: error });
  }
}

export async function deleteUser(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { userId } = req.query;
    const deletedUser = await Users.findByIdAndDelete(userId);
    return res.status(201).json({ message: deletedUser });
  } catch (error) {
    return res.status(404).json({ error: error });
  }
}

export async function loginUser(req: NextApiRequest, res: NextApiResponse) {
  const { username, password } = req.body;
  const existingUser = await Users.findOne({ username });
  if (existingUser) {
    // Implement session management, JWT token creation, or other authentication mechanisms here.
    const passwordMatch = await compare(password, existingUser.password);
    if (passwordMatch) {
      const userDetails = {
        username: existingUser.username,
        role: existingUser.role,
      };
      res.status(200).json({ message: "Login successful", userDetails });
      console.log("Login successful");
    }
  } else {
    res.status(401).json({ message: "Invalid username or password" });
  }
}
