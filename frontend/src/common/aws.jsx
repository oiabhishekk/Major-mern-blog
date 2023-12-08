import axios from "axios";

export const uploadImage = async (img) => {
  let imgUrl = null;
  await axios
    .get(import.meta.env.VITE_SERVER_DOMAIN + "/get-upload-url")
    .then(async ({ data: { uploadedUrl } }) => {
      await axios({
        method: "PUT",
        url: uploadedUrl,
        headers: { "Content-Type": "image/jpeg" },
        data: img,
      }).then(() => {
        imgUrl = uploadedUrl.split("?")[0];
      });
    });
  return imgUrl;
};
