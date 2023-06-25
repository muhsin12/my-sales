const salesEndPoint = "http://localhost:3000/api/sales";

export const fetchSales = () => {
  return fetch(salesEndPoint, { method: "GET" });
};

export const createSales = (dataBody: any, mode: boolean, salesId?: string) => {
  const salesMethod = !mode ? "POST" : "PATCH";
  return fetch(salesEndPoint, {
    method: salesMethod,
    headers: {
      "Content-Type": "application/json",
    },
    body: !mode
      ? JSON.stringify(dataBody)
      : JSON.stringify({ ...dataBody, salesId: salesId }),
  });
};

export const deleteItem = (salesId: string) => {
  const deleteUrl = `${salesEndPoint}/?salesId=${salesId}`;
  return fetch(deleteUrl, {
    method: "DELETE",
  });
};
