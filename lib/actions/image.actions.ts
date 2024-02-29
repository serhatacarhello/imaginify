"use server"

import { revalidatePath } from "next/cache"
import { connectToDatabase } from "../database/mongoose"
import { handleError } from "../utils"
import User from "../database/models/user.model"
import Image from "../database/models/image.model"
import { redirect } from "next/navigation"
import { v2 as cloudinary } from "cloudinary"



const populateUser = (query: any) => query.populate({ path: 'author', modal: User, select: '_id firstName lastName' })


// ADD IMAGE
export async function addImage({ image, userId, path }: AddImageParams) {
    try {
        await connectToDatabase()

        const author = await User.findById(userId)

        if (!author) throw new Error('User not found')

        const newImage = await Image.create({
            ...image,
            author: author._id,
        })

        revalidatePath(path)

        return JSON.parse(JSON.stringify(newImage))

    } catch (error) {
        handleError(error)
    }

}
// UPDATE IMAGE
export async function updateImage({ image, userId, path }: UpdateImageParams) {
    try {
        await connectToDatabase()

        const imageToUpdate = await Image.findById(image._id)

        if (!imageToUpdate || imageToUpdate.author.toHexString() !== userId) throw new Error("Unauthorized or image not found")

        const updatedImage = await Image.findByIdAndUpdate(
            imageToUpdate._id,
            image,
            { new: true }
        )

        revalidatePath(path)

        return JSON.parse(JSON.stringify(updatedImage))

    } catch (error) {
        handleError(error)
    }

}

// DELETE IMAGE
export async function deleteImage(imageId: string) {
    try {
        await connectToDatabase()

        await Image.findByIdAndDelete(imageId)

    } catch (error) {
        handleError(error)
    } finally {
        redirect("/")
    }

}

// GET IMAGE
export async function getImageById(imageId: string) {

    try {
        await connectToDatabase()

        const image = await populateUser(Image.findById(imageId))

        if (!image) throw new Error("Image not found")

        return JSON.parse(JSON.stringify(image))

    } catch (error) {
        handleError(error)
    }

}
// GET ALL IMAGES
export async function getAllImages({ limit = 9, page = 1, searchQuery = '' }: { limit?: number, page: number, searchQuery?: string }) {

    try {
        // Connect to the database
        await connectToDatabase()

        // Configure Cloudinary with environment variables
        cloudinary.config({
            cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
            secure: true,
        })

        // Define Cloudinary search expression with a folder name
        let expression = 'folder=imaginify'

        // If there is a search query, append it to the expression
        if (searchQuery) {
            expression += ` AND ${searchQuery}`
        }

        // Execute Cloudinary search and retrieve resources
        const { resources } = await cloudinary.search.expression(expression).execute()

        // Extract public_ids from the retrieved resources
        const recourseIds = resources.map((resource: any) => resource.public_id)

        // Define MongoDB query based on the search query
        let query = {}

        // If there is a search query, filter by public_ids
        if (searchQuery) {
            query = {
                publicId: {
                    $in: recourseIds
                }
            }
        }

        // Calculate the skip amount based on the page and limit
        const skipAmount = (Number(page) - 1) * limit

        // Retrieve images from the database, populate user information, and apply sorting, skipping, and limiting
        const images = await populateUser(Image.find(query)).sort({ updatedAt: -1 }).skip(skipAmount).limit(limit)

        // Count total documents that match the query for pagination
        const totalImages = await Image.find(query).countDocuments()

        // Count total saved images in the database
        const savedImages = await Image.find().countDocuments()

        // Return the result including data, total number of pages, and total saved images
        return {
            data: JSON.parse(JSON.stringify(images)),
            totalPages: Math.ceil(totalImages / limit),
            savedImages,
        }

    } catch (error) {
        // Handle errors and log them
        handleError(error)
    }

}
