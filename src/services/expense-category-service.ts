const { END_POINT } = require("../config");
const expenseCategoryEndPoint = END_POINT.EXPENSE_CATEGORY;

export const fetchCategories = (params?: any) => {
  let searchUrl = expenseCategoryEndPoint;
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
  return fetch(expenseCategoryEndPoint, {
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
  const deleteUrl = `${expenseCategoryEndPoint}/?categoryId=${categoryId}`;
  return fetch(deleteUrl, {
    method: "DELETE",
  });
};
