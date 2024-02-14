const { END_POINT } = require("../config");
const categoryEndPoint = END_POINT.PRODUCT_CATEGORY;

export const fetchCategories = () => {
  return fetch(categoryEndPoint, { method: "GET" });
};

export const createCategory = (
  dataBody: any,
  mode: boolean,
  categoryId?: string
) => {
  console.log("categroy end point-----", categoryEndPoint);
  const categoryMethod = !mode ? "POST" : "PATCH";
  return fetch(categoryEndPoint, {
    method: categoryMethod,
    headers: {
      "Content-Type": "application/json",
    },
    body: !mode
      ? JSON.stringify(dataBody)
      : JSON.stringify({ ...dataBody, categoryId: categoryId }),
  });
};

export const deleteCategory = (categoryId: string) => {
  const deleteUrl = `${categoryEndPoint}/?categoryId=${categoryId}`;
  return fetch(deleteUrl, {
    method: "DELETE",
  });
};
