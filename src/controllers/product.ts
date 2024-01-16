import { Request, Response } from "express";
import { TryCatch } from "../middlewares/error.js";
import {
    BaseQuery,
    NewProductRequestBody,
    SearchRequestQuery,
} from "../types/types.js";
import { Product } from "../models/product.js";
import ErrorHandler from "../utils/utility-class.js";
import { rm } from "fs";
import { myCache } from "../app.js";
//import { faker } from '@faker-js/faker';

export const newProduct = TryCatch(
    async (req: Request<{}, {}, NewProductRequestBody>, res, next) => {
        const { name, price, category, stock } = req.body;
        const photo = req.file;

        if (!photo) return next(new ErrorHandler("Please upload a photo", 400));

        if (!name || !price || !category || !stock) {
            rm(photo.path, () => {
                console.log("photo deleted");
            });
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
    }
);

// after caching the response time came down from 50ms to 3s
// Revalidate on New, Update, Delete, New Order Product
export const getlatestProducts = TryCatch(async (req, res, next) => {

    let products;

    if (myCache.has("latest-product")) products = JSON.parse(myCache.get("latest-product") as string);
    else {
        products = await Product.find({}).sort({ createdAt: -1 }).limit(5);
        myCache.set("latest-product", JSON.stringify(products));
    }
    return res.status(200).json({
        success: true,
        products,
    });
});

export const getAllCategories = TryCatch(async (req, res, next) => {
    const categories = await Product.distinct("category");
    return res.status(200).json({
        success: true,
        categories,
    });
});

export const getAdminProducts = TryCatch(async (req, res, next) => {
    const products = await Product.find({});

    return res.status(200).json({
        success: true,
        products,
    });
});

export const getSingleProduct = TryCatch(async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    return res.status(200).json({
        success: true,
        product,
    });
});

export const updateProduct = TryCatch(async (req, res, next) => {
    const { id } = req.params;
    const { name, price, category, stock } = req.body;
    const photo = req.file;
    const product = await Product.findById(id);

    if (!product) return next(new ErrorHandler("Product not found", 404));

    if (photo) {
        rm(product.photo, () => {
            console.log("old photo deleted");
        });
        product.photo = photo.path;
    }

    if (name) product.name = name;
    if (price) product.price = price;
    if (stock) product.stock = stock;
    if (category) product.category = category;

    await product.save();

    return res.status(200).json({
        success: true,
        message: "Product Updated Successfully",
    });
});

export const deleteProduct = TryCatch(async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    if (!product) return next(new ErrorHandler("Product not found", 404));

    rm(product.photo, () => {
        console.log("photo deleted");
    });

    await product.deleteOne();

    return res.status(200).json({
        success: true,
        message: "Product Deleted Successfully",
    });
});

export const getAllProducts = TryCatch(
    async (req: Request<{}, {}, SearchRequestQuery>, res, next) => {
        const { search, sort, category, price } = req.query;

        const page = Number(req.query.page) || 1;

        const limit = Number(process.env.PRODUCT_PER_PAGE) || 8;
        const skip = (page - 1) * limit;

        const baseQuery: BaseQuery = {};

        if (search)
            baseQuery.name = {
                $regex: String(search),
                $options: "i",
            };

        if (price)
            baseQuery.price = {
                $lte: Number(price),
            };

        if (category) baseQuery.category = String(category);

        const productsPromise = Product.find(baseQuery)
            .sort(sort && { price: sort === "asc" ? 1 : -1 })
            .limit(limit)
            .skip(skip);

        const [products, filteredOnlyProduct] = await Promise.all([
            productsPromise,
            Product.find(baseQuery),
        ]);

        const totalPage = Math.ceil(filteredOnlyProduct.length / limit);

        return res.status(200).json({
            success: true,
            products,
            totalPage,
        });
    }
);

// const generateRandomProducts = async (count: number = 10) => {
//     const products = [];

//     for (let i = 0; i < count; i++) {
//         const product = {
//             name: faker.commerce.productName(),
//             photo: "uploads\\7489d84c-554b-4c0d-937a-751a55c7a250.png",
//             price: faker.commerce.price({ min: 1500, max: 80000, dec: 0 }),
//             stock: faker.commerce.price({ min: 0, max: 100, dec: 0 }),
//             category: faker.commerce.department(),
//             createdAt: new Date(faker.date.past()),
//             updatedAt: new Date(faker.date.recent()),
//             __v: 0,
//         };

//         products.push(product);
//     }

//     await Product.create(products);

//     console.log({ succecss: true });
// };

//generateRandomProducts(40);

// const deleteRandomsProducts = async (count: number = 10) => {
//     const products = await Product.find({}).skip(2);

//     for (let i = 0; i < products.length; i++) {
//         const product = products[i];
//         await product.deleteOne();
//     }

//     console.log({ succecss: true });
// };

// deleteRandomsProducts(38);