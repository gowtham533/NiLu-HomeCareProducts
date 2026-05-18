import axios from "axios"
import serverURL from "./serverURL"

// ─── Base API URL ─────────────────────────────────────────────────────────────
// Auth routes are at:    /api/users/...
// Product routes are at: /api/products/...   ← same /api prefix
// If your express app mounts the product router differently, update API_BASE.
const API_BASE = `${serverURL}/api`

// ─── commonAPI ────────────────────────────────────────────────────────────────
// For FormData payloads the browser MUST set Content-Type itself so it can
// inject the correct multipart boundary. Never force application/json on FormData.
const commonAPI = (method, url, body, headers = {}) => {
  const isFormData = body instanceof FormData

  return axios({
    method,
    url,
    // Never send a body on GET / DELETE
    ...(body && method !== "GET" && method !== "DELETE" ? { data: body } : {}),
    headers: {
      ...(!isFormData ? { "Content-Type": "application/json" } : {}),
      ...headers,
    },
  })
}

// ─── Auth APIs ────────────────────────────────────────────────────────────────

export const registerAPI = (userDetails) =>
  commonAPI("POST", `${API_BASE}/users/register`, userDetails)

export const loginAPI = (userDetails) =>
  commonAPI("POST", `${API_BASE}/users/login`, userDetails)

// ─── Product APIs ─────────────────────────────────────────────────────────────

// Add Product  — reqBody must be a FormData instance (includes image file)
export const addProductAPI = (reqBody, reqHeader) =>
  commonAPI("POST", `${API_BASE}/products`, reqBody, reqHeader)

// Edit Product  — reqBody must be a FormData instance (image optional)
export const editProductAPI = (id, reqBody, reqHeader) =>
  commonAPI("PUT", `${API_BASE}/products/${id}`, reqBody, reqHeader)

// Delete Product
export const deleteProductAPI = (id, reqHeader) =>
  commonAPI("DELETE", `${API_BASE}/products/${id}`, null, reqHeader)

// Get All Products
export const getAllProductsAPI = (reqHeader) =>
  commonAPI("GET", `${API_BASE}/products`, null, reqHeader)

// Get Single Product
export const getProductAPI = (id, reqHeader) =>
  commonAPI("GET", `${API_BASE}/products/${id}`, null, reqHeader)

// Get Products by Category
export const getProductsByCategoryAPI = (category, reqHeader) =>
  commonAPI("GET", `${API_BASE}/products/category/${category}`, null, reqHeader)