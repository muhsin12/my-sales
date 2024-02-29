const { END_POINT } = require("../config");
const productEndPoint = END_POINT.PRODUCT;

export const fetchItem = (params: any) => {
  let searchUrl = `${productEndPoint}?page=${params.page}&pageSize=${params.pageSize}`;
  if (params.categoryId) {
    searchUrl = `${searchUrl}&categoryId=${params.categoryId}`;
  }
  return fetch(searchUrl, { method: "GET" });
};

export const createItem = (
  dataBody: any,
  mode: boolean,
  productId?: string
) => {
  const categoryMethod = !mode ? "POST" : "PATCH";
  return fetch(productEndPoint, {
    method: categoryMethod,
    headers: {
      "Content-Type": "application/json",
    },
    body: !mode
      ? JSON.stringify(dataBody)
      : JSON.stringify({ ...dataBody, productId: productId }),
  });
};

export const deleteItem = (productId: string) => {
  const deleteUrl = `${productEndPoint}/?productId=${productId}`;
  return fetch(deleteUrl, {
    method: "DELETE",
  });
};
