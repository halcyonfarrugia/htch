const cloudinary = require('cloudinary').v2
const express = require('express')
const router = require('express').Router()
const Product = require('../../models/Product')
const path = require('path')
const fs = require('fs')

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})


const create = async (req, res) => {
    try {
        if (!req.user.isAdmin) return res.status(403).json({ message: "User not authorized" })
        const result = await cloudinary.uploader.upload(req.file.path);
        if (!result) return res.status(500).json({ message: "Error occurred in uploading image. Please try again later. " })

        const { name, status, description, price, oldPrice, newPrice, size, stock, category } = req.body;

        const product = new Product(
            status === "Sale" ? {
                name,
                description,
                oldPrice,
                category,
                newPrice,
                status,
                size: JSON.parse(size),
                stock,
                image: result.secure_url
            } : {
                name,
                category,
                description,
                price,
                status,
                size: JSON.parse(size),
                stock,
                image: result.secure_url
            }
        );
        const saved = await product.save();

        const delTempFile = await fs.promises.unlink(req.file.path)

        res.status(201).json({ status: true, message: "Product successfully created. Please refresh dashboard." })
    } catch (error) {
        console.log(`Error occurred in ${path.join(__dirname, __filename)}: `, error)
    }
}

module.exports = { create }