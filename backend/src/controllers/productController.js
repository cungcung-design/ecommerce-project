import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken";
import cloudinary from "../config/cloudinary.js";

const isAdminRequest = async (req) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return false;
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.role === "ADMIN";
  } catch (error) {
    return false;
  }
};

export const getProducts = async (req, res) => {
  try {
    const {
      search = "",
      category = "",
      page = 1,
      limit = 12,
    } = req.query;

    const currentPage = Number(page);
    const pageSize = Number(limit);
    const skip = (currentPage - 1) * pageSize;

    const where = {
      ...(search && {
        name: {
          contains: search,
          mode: "insensitive",
        },
      }),

      ...(category && {
        category: {
          name: category,
        },
      }),
    };

    const admin = await isAdminRequest(req);

    if (!admin) {
      where.isActive = true;
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: true,
        },
        skip,
        take: pageSize,
        orderBy: {
          createdAt: "desc",
        },
      }),

      prisma.product.count({
        where,
      }),
    ]);

    res.json({
      success: true,
      products,
      pagination: {
        page: currentPage,
        limit: pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
    });
  }
};

export const getProduct = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const where = { id };

    const admin = await isAdminRequest(req);

    if (!admin) {
      where.isActive = true;
    }

    const product = await prisma.product.findUnique({
      where,
      include: {
        category: true,
      },
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      product,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch product",
    });
  }
};

export const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      stock,
      categoryId,
      imageUrl,
      imagePublicId,
    } = req.body;

    if (!name || !price) {
      return res.status(400).json({
        success: false,
        message: "Name and price are required",
      });
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: Number(price),
        stock: Number(stock),
        categoryId: Number(categoryId),
        imageUrl: imageUrl || null,
        imagePublicId: imagePublicId || null,
      },
      include: {
        category: true,
      },
    });

    res.status(201).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to create product",
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const {
      name,
      description,
      price,
      stock,
      categoryId,
      imageUrl,
      imagePublicId,
      isActive,
    } = req.body;

    const existingProduct = await prisma.product.findUnique({
      where: { id },
      select: {
        imageUrl: true,
        imagePublicId: true,
      },
    });

    let finalImageUrl = existingProduct.imageUrl;
    let finalImagePublicId = existingProduct.imagePublicId;

    if (imageUrl !== undefined) {
      if (imageUrl && existingProduct.imagePublicId && existingProduct.imagePublicId !== imagePublicId) {
        await cloudinary.uploader.destroy(existingProduct.imagePublicId);
      }

      if (!imageUrl && existingProduct.imagePublicId) {
        await cloudinary.uploader.destroy(existingProduct.imagePublicId);
      }

      finalImageUrl = imageUrl || null;
      finalImagePublicId = imagePublicId || null;
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        name,
        description,
        price: Number(price),
        stock: Number(stock),
        categoryId: Number(categoryId),
        imageUrl: finalImageUrl,
        imagePublicId: finalImagePublicId,
        ...(isActive !== undefined && { isActive: Boolean(isActive) }),
      },
      include: {
        category: true,
      },
    });

    res.json({
      success: true,
      product,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to update product",
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const product = await prisma.product.findUnique({
      where: { id },
      select: {
        imagePublicId: true,
      },
    });

    if (product?.imagePublicId) {
      await cloudinary.uploader.destroy(product.imagePublicId);
    }

    await prisma.product.update({
      where: { id },
      data: { isActive: false },
    });

    res.json({
      success: true,
      message: "Product deactivated successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to deactivate product",
    });
  }
};
