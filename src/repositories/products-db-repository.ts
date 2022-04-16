import {client} from "./db";
import {ObjectId} from "mongodb";

type ProductType = {
    id: number
    title: string
}

export const productsDbRepository = {
   async findProducts(title: string | null | undefined): Promise<ProductType[]> {
      const filter: any = {}
        if (title) {
            filter.title = {$regex: title}
        }
       return await client.db().collection<ProductType>('products').find(filter).toArray()
    },
    async findProductById(id: number): Promise<ProductType | null> {
        const product = await client.db().collection<ProductType>('products').findOne({id: id})
        if (product) {
            return product
        } else {
            return null
        }
    },
    async createProduct(title: string): Promise<ProductType> {
        const newProduct = {
            id: +(new Date()),
            title: title
        }
        const result = await client.db().collection<ProductType>('products').insertOne(newProduct)
        return newProduct
    },
    async updateProduct(id: number, title: string): Promise<boolean | undefined> {
        const product = await client.db().collection<ProductType>('products').findOne({id: id})
        if (product) {
            const result = await client.db().collection<ProductType>('products').updateOne({title: product.title}, {$set: {title}})
            return result.modifiedCount === 1
        }
    },
    async deleteProduct(id: number): Promise<boolean> {
        const products = await client.db().collection<ProductType>('products').find({}).toArray()
        for (let i = 0; i < products.length; i++) {
            if (products[i].id === id) {
                const result =  await client.db().collection<ProductType>('products').deleteOne({"_id": ObjectId(products[i]._id)})
                console.log('result', result)
                if (result) {
                    return true
                }
            }
        }
        return false
    }
}
