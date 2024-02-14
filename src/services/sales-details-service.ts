const { END_POINT } = require("../config");
const salesDetailEndPoint = END_POINT.SALES_DETAIL;

export const fetchSalesDetails = (salesId: any) => {
  console.log("sales id in service-", salesId);
  const bodyData = { salesId: salesId };
  return fetch(salesDetailEndPoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(bodyData),
  });
};

export const createSalesDetail = (
  dataBody: any,
  mode: boolean,
  salesId?: string
) => {
  console.log("databody=", dataBody);
  console.log("mode=", mode);
  const salesMethod = !mode ? "POST" : "PATCH";
  return fetch(salesDetailEndPoint, {
    method: salesMethod,
    headers: {
      "Content-Type": "application/json",
    },
    body: !mode
      ? JSON.stringify(dataBody)
      : JSON.stringify({ ...dataBody, salesId: salesId }),
  });
};

export const deleteSalesDetail = (salesId: string) => {
  const deleteUrl = `${salesDetailEndPoint}/?salesId=${salesId}`;
  return fetch(deleteUrl, {
    method: "DELETE",
  });
};
