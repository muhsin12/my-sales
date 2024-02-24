const { END_POINT } = require("../config");
const salesEndPoint = END_POINT.SALES;

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

export const deleteSales = (salesId: string) => {
  const deleteUrl = `${salesEndPoint}/?salesId=${salesId}`;
  return fetch(deleteUrl, {
    method: "DELETE",
  });
};

export const searchSales = (params: any) => {
  let searchUrl = salesEndPoint;
  if (params.fromDate && params.toDate) {
    searchUrl = `${salesEndPoint}?firstDate=${params.fromDate}&lastDate=${params.toDate}`;
  }
  return fetch(searchUrl, { method: "GET" });
};
