const { END_POINT } = require("../config");
const salesEndPoint = END_POINT.SALES;

export const fetchSales = async (page: number, pageSize: number) => {
  let salesApiEndpoint = `${salesEndPoint}?page=${page}&pageSize=${pageSize}`;
  try {
    const response = await fetch(salesApiEndpoint, { method: "GET" });
    if (!response.ok) {
      throw new Error(`Error fetching sales data: ${response.statusText}`);
    }
    return response;
  } catch (error: any) {
    throw new Error(`Error fetching sales data: ${error.message}`);
  }
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

export const searchSales = async (params: any) => {
  let searchUrl = `${salesEndPoint}?page=${params.page}&pageSize=${params.pageSize}`;

  if (params.fromDate && params.toDate) {
    searchUrl = `${salesEndPoint}?firstDate=${params.fromDate}&lastDate=${params.toDate}`;
  }

  try {
    const response = await fetch(searchUrl, { method: "GET" });

    if (!response.ok) {
      throw new Error(`Error searching sales data: ${response.statusText}`);
    }

    return response;
  } catch (error: any) {
    throw new Error(`Error searching sales data: ${error?.message}`);
  }
};
