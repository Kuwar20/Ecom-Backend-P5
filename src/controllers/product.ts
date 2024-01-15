import { Request, Response } from "express";
import { TryCatch } from "../middlewares/error.js";
import { NewProductRequestBody } from "../types/types.js";
import { Product } from "../models/product.js";
import ErrorHandler from "../utils/utility-class.js";
import { rm } from "fs";

export const newProduct = TryCatch(
    async (req: Request<{}, {}, NewProductRequestBody>, res, next) => {
        const { name, price, category, stock } = req.body;
        const photo = req.file;

        if (!photo) return next(new ErrorHandler("Please upload a photo", 400));

        if (!name || !price || !category || !stock) {
            rm(photo.path, () => {
                console.log("photo deleted")
            })
        }
        await Product.create({
            name,
            price,
            stock,
            category: category.toLowerCase(),
            photo: photo?.path,
        });

        return res.status(201).json({
            success: true,
            message: "Product created successfully",
        });
    });


export const getlatestProducts = TryCatch(
    async (req, res, next) => {

        const products = await Product.find({}).sort({ createdAt: -1 }).limit(5);
        return res.status(200).json({
            success: true,
            products,
        });
    });

export const getAllCategories = TryCatch(
    async (req, res, next) => {

        const categories = await Product.distinct("category");
        return res.status(200).json({
            success: true,
            categories,
        });
    });