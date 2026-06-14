import api from "./axios";

// Users API
export const syncUser = async (userData) => {
    const { data } = await api.post("/users/sync", userData );
    return data;
};

// Products API
export const GetAllProduct = async () => {
    const { data } = await api.get("/products");
    return data;
};

// Single Product API
export const getProductById = async (id) => {
    const { data } = await api.get(`/products/${id}`);
    return data;
};

// User's Products API
export const getMyProducts = async () => {
    const { data } = await api.get("/products/my");
    return data;
};

// Create Product API
export const createProduct = async (productData) => {
    const { data } = await api.post("/products", productData);
    return data;
};

// Update Product API
export const updateProduct = async ({id, ...productData}) => {
    const { data } = await api.put(`/products/${id}`, productData);
    return data;
};

// Delete Product API
export const deleteProduct = async (id) => {
    const { data } = await api.delete(`/products/${id}`);
    return data;
};

// Create Comment API
export const createComment = async ({productId, content}) => {
    const { data } = await api.post(`/products/${productId}`, { content });
    return data;
};

// Delete Comment API
export const deleteComment = async ({commentId}) => {
    const { data } = await api.delete(`/comments/${commentId}`);
    return data;
};