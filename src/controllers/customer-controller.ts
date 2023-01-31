import type { NextApiRequest, NextApiResponse } from "next";
import mongoose from "mongoose";
import Customers from "../models/customer-model";

export async function createCustomer(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const customerData = req.body;
    if (!customerData) {
      res.status(404).json({ error: "customer data not provided" });
    }
    Customers.create(customerData, (err: any, data: any) => {
      if (err)
        res.status(404).json({ error: "error while inserting customer data" });
      return res.status(200).json(data);
    });
  } catch (error) {
    res.status(404).json({ error: "error while inserting customer data" });
  }
}

// const readCustomer = (req: Request, res: Response, next: NextFunction) => {
//   const customer_id = req.params.customerId;
//   return customers
//     .findById(customer_id)
//     .then((customer) =>
//       customer
//         ? res.status(200).json({ customer })
//         : res.status(400).json({ message: "customer not found" })
//     )
//     .catch((error) => res.status(500).json({ error }));
// };

export async function readAllCustomer(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const customers = await Customers.find();
    if (!customers) {
      return res.status(404).json({ error: "Customers not found" });
    }
    res.status(200);
    return res.json({ customers });
  } catch (error) {
    res.status(404).json({ error: "error while fetching customers" });
  }
}

export async function updateCustomer(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { customerId } = req.body;
  const { customer_name, contact_person, address, mobile } = req.body;

  const modifiedCustomerDetail = {
    customer_name: customer_name,
    contact_person: contact_person,
    address: address,
    mobile: mobile,
  };
  try {
    const updatedCustomer = await Customers.findByIdAndUpdate(
      customerId,
      modifiedCustomerDetail
    );
    return res.status(200).json({ updateCustomer });
  } catch (error) {
    return res.status(404).json({ error: error });
  }
}

export async function deleteCustomer(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { customerId } = req.query;
    const deletedCustomer = await Customers.findByIdAndDelete(customerId);
    return res.status(201).json({ message: deletedCustomer });
  } catch (error) {
    return res.status(404).json({ error: error });
  }

  //   return customers
  //     .findByIdAndDelete(customer_id)
  //     .then((customer) =>
  //       customer
  //         ? res.status(201).json({ message: "customer deleted" })
  //         : res.status(400).json({ message: "customer not found" })
  //     )
  //     .catch((error) => res.status(500).json({ error }));
}
