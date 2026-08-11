import * as adminCategoryService from "../services/adminCategoryService.js";

export const getAdminCategories = async (req, res, next) => {
  try {
    const categories = await adminCategoryService.getAdminCategories();

    res.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

export const getAdminCategory = async (req, res, next) => {
  try {
    const category = await adminCategoryService.getAdminCategoryById(req.params.id);

    res.json({
      success: true,
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

export const createAdminCategory = async (req, res, next) => {
  try {
    const category = await adminCategoryService.createAdminCategory(req.body.name);

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

export const updateAdminCategory = async (req, res, next) => {
  try {
    const category = await adminCategoryService.updateAdminCategory(req.params.id, req.body.name);

    res.json({
      success: true,
      message: "Category updated successfully",
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

export const updateAdminCategoryStatus = async (req, res, next) => {
  try {
    const category = await adminCategoryService.updateAdminCategoryStatus(req.params.id, req.body.isActive);

    res.json({
      success: true,
      message: "Category status updated successfully",
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteAdminCategory = async (req, res, next) => {
  try {
    await adminCategoryService.deleteAdminCategory(req.params.id);

    res.json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
