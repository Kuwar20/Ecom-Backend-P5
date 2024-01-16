import mongoose from "mongoose";
import { myCache } from "../app.js";
import { InvalidateCacheProps } from "../types/types.js";

export const connectDB = () => {
    mongoose
        .connect("mongodb://localhost:27017", {
            dbName: "Ecommerce_24",
        })
        .then((c) => console.log(`Connected to DB to ${c.connection.host}`))
        .catch((e) => console.log(e));
};

export const invalidateCache = ({
    product,
    order,
    admin,
    userId,
    orderId,
    productId,
}: InvalidateCacheProps) => {
    if (product) {
        const productKeys: string[] = [
            "latest-products",
            "categories",
            "all-products",
        ];

        if (typeof productId === "string") productKeys.push(`product-${productId}`);

        if (typeof productId === "object")
            productId.forEach((i) => productKeys.push(`product-${i}`));

        myCache.del(productKeys);
    }
    if (order) {
        const ordersKeys: string[] = [
            "all-orders",
            `my-orders-${userId}`,
            `order-${orderId}`,
        ];

        myCache.del(ordersKeys);
    }
    if (admin) {
        myCache.del([
            "admin-stats",
            "admin-pie-charts",
            "admin-bar-charts",
            "admin-line-charts",
        ]);
    }
};