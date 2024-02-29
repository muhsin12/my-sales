const { END_POINT } = require("../config");
const purcaseEndPoint = END_POINT.EXPENSE;

export const fetchPurchases = async (page: number, pageSize: number) => {
  try {
    let purchaseApiEndpoint = `${purcaseEndPoint}?page=${page}&pageSize=${pageSize}`;
    const response = await fetch(purchaseApiEndpoint, { method: "GET" });

    if (!response.ok) {
      throw new Error(`Error fetching purchases: ${response.statusText}`);
    }

    return response;
  } catch (error: any) {
    throw new Error(`Error fetching purchases: ${error.message}`);
  }
};

export const searchPurchases = async (params: any) => {
  let searchUrl = `${purcaseEndPoint}?page=${params.page}&pageSize=${params.pageSize}`;

  if (params.fromDate && params.toDate && params.categoryId) {
    searchUrl = `${searchUrl}&firstDate=${params.fromDate}&lastDate=${params.toDate}&categoryId=${params.categoryId}`;
  } else if (params.fromDate && params.toDate && params.categoryId == "") {
    searchUrl = `${searchUrl}&firstDate=${params.fromDate}&lastDate=${params.toDate}`;
  } else if (
    params.categoryId &&
    params.fromDate == "" &&
    params.toDate == ""
  ) {
    searchUrl = `${searchUrl}&categoryId=${params.categoryId}`;
  }

  try {
    const response = await fetch(searchUrl, { method: "GET" });

    if (!response.ok) {
      throw new Error(`Error searching purchases: ${response.statusText}`);
    }

    return response;
  } catch (error: any) {
    throw new Error(`Error searching purchases: ${error.message}`);
  }
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
