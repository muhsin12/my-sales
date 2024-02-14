const { END_POINT } = require("../config");
const purcaseEndPoint = END_POINT.EXPENSE;

export const fetchPurchases = () => {
  return fetch(purcaseEndPoint, { method: "GET" });
};

export const createPurchase = (
  dataBody: any,
  mode: boolean,
  purchaseId?: string
) => {
  const categoryMethod = !mode ? "POST" : "PATCH";
  return fetch(purcaseEndPoint, {
    method: categoryMethod,
    headers: {
      "Content-Type": "application/json",
    },
    body: !mode
      ? JSON.stringify(dataBody)
      : JSON.stringify({ ...dataBody, purchaseId: purchaseId }),
  });
};

export const deletePurchase = (purchaseId: string) => {
  const deleteUrl = `${purcaseEndPoint}/?purchaseId=${purchaseId}`;
  return fetch(deleteUrl, {
    method: "DELETE",
  });
};
