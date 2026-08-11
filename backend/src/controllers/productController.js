import jwt from "jsonwebtoken";
import * as productService from "../services/productService.js";

const isAdminRequest = async (req) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return false;
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.role === "ADMIN";
  } catch {
    return false;
  }
};

export const getProducts = async (req, res, next) => {
  try {
    const includeInactive = await isAdminRequest(req);

    const result = await productService.getProducts({
      search: req.query.search,
      category: req.query.category,
      categoryId: req.query.categoryId,
      page: req.query.page,
      limit: req.query.limit,
      includeInactive,
    });

    res.json({
      success: true,
      products: result.products,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
};

export const getProduct = async (req, res, next) => {
  try {
    const includeInactive = await isAdminRequest(req);
    const product = await productService.getProductById(req.params.id, includeInactive);

    res.json({
      success: true,
      product,
    });
  } catch (error) {
    next(error);
  }
};
