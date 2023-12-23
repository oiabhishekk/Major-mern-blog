import axios from "axios";

export const filterPaginationData = async ({
  create_new_arr = false,
  state,
  data,
  page,
  countRoute,
  dataToSend = {},
}) => {
  let obj;

  if (state !== null && !create_new_arr) {
    obj = { ...state, results: [...state.results, ...data], page: page };
  } else {
    await axios
      .post(import.meta.env.VITE_SERVER_DOMAIN + countRoute, dataToSend)
      .then(({ data: { totalDocs } }) => {
        obj = { results: data, page: 1, totalDocs };
      })
      .catch((err) => {
        console.log(err);
      });
  }
  return obj;
};
