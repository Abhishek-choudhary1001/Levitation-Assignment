import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  createInvoice,
  getInvoices,
  getInvoiceById,
  updateInvoice,
  deleteInvoice
} from "../controllers/invoiceController.js";
import { generateInvoice } from '../controllers/pdfController.js';

const router = express.Router();

router.post("/", authMiddleware, createInvoice);
router.get("/", authMiddleware, getInvoices);
router.get("/:id", authMiddleware, getInvoiceById);
router.put("/:id", authMiddleware, updateInvoice);
router.delete("/:id", authMiddleware, deleteInvoice);
router.get('/generate-pdf/:id', authMiddleware, generateInvoice);
export default router;
