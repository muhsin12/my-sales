const productEndPoint = "http://localhost:3000/api/products";

export const fetchItem = () => {
  return fetch(productEndPoint, { method: "GET" });
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
