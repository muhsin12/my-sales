const { END_POINT } = require("../config");
const categoryEndPoint = END_POINT.PRODUCT_CATEGORY;

export const fetchCategories = async (params?: any) => {
  let searchUrl = categoryEndPoint;
  if (params) {
    searchUrl = `${searchUrl}?page=${params.page}&pageSize=${params.pageSize}`;
  }
  return fetch(searchUrl, { method: "GET" });
};

export const createCategory = (
  dataBody: any,
  mode: boolean,
  categoryId?: string
) => {
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
