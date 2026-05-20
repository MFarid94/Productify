import { Router } from "express";
import * as productController from "../controllers/productController";
import { requireAuth } from "@clerk/express";

const router = Router();

// GET /api/products => Get all products (public)
router.get("/", productController.getAllProducts);

// GET /api/products/my => Get products of current user (protected)
router.get("/my", requireAuth, productController.getMyProducts);


// GET /api/products/my/:id => Get single product by ID for current user (protected)
router.get("/my/:id", requireAuth, productController.getMyProductById);

// GET /api/products/:id => Get single product by ID (public)
router.get("/:id", productController.getProductById);

// POST /api/products => Create new product (protected)
router.post("/", requireAuth, productController.createProduct);

// PUT /api/products/:id => Update product by ID (protected, only if owned by user)
router.put("/:id", requireAuth, productController.updateProduct);

// DELETE /api/products/:id => Delete product by ID (protected, only if owned by user)
router.delete("/:id", requireAuth, productController.deleteProduct);

export default router;