import axios from "axios";
const baseUrl = "/api/login";

const login = async (loginInfo) => {
  try {
    const res = await axios.post(baseUrl, loginInfo);
    return res.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.error || "Login failed");
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
};

export default { login };
