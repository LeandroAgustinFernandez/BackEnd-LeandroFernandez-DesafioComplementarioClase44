class ProductDTO {
    async product(product) {
        let productParams = {
            title: product.title,
            description: product.description,
            price: product.price,
            thumbnails: product.thumbnails,
            code: product.code,
            stock: product.stock,
            category: product.category,
            status: product.status,
            owner: product.owner
        }
        return productParams
    }
}

export default ProductDTO;