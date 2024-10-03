import axios from "axios";
const baseUrl = "/api/blogs";

let token = null;

const setToken = (newToken) => {
  token = `Bearer ${newToken}`;
};

const create = async (newObject) => {
  const config = {
    headers: { Authorization: token },
  };

  try {
    const response = await axios.post(baseUrl, newObject, config);
    return response.data;
  } catch (error) {
    throw error.response.data.error || "An unexpected error occurred";
  }
};
const getAll = () => {
  const request = axios.get(baseUrl);
  return request.then((response) => response.data);
};

const update = async (id, updatedBlog) => {
  const response = await axios.put(`${baseUrl}/${id}`, updatedBlog);
  return response.data;
};
const remove = (id) => {
  const config = {
    headers: { Authorization: token },
  };
  return axios
    .delete(`${baseUrl}/${id}`, config)
    .then((response) => response.data);
};
export default { getAll, create, setToken, update, remove };
