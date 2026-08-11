import * as adminUserService from "../services/adminUserService.js";

export const listUsers = async (req, res, next) => {
  try {
    const users = await adminUserService.getAllUsers({
      search: req.query.search,
    });

    res.json({
      success: true,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

export const showUser = async (req, res, next) => {
  try {
    const user = await adminUserService.getUserById(req.params.id);

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const changeUserRole = async (req, res, next) => {
  try {
    const user = await adminUserService.updateUserRole(
      req.params.id,
      req.body.role,
      req.user.id
    );

    res.json({
      success: true,
      message: "User role updated",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const changeUserStatus = async (req, res, next) => {
  try {
    const user = await adminUserService.updateUserStatus(
      req.params.id,
      req.body.isActive,
      req.user.id
    );

    res.json({
      success: true,
      message: "User status updated",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};
