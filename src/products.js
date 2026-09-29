/**
 * Product saving and retrieval from storage.
 *
 * @param {object} product - Product object with nutrition data
 * @param {object} storage - Storage object with { products: [] }
 * @returns {object} The saved product (with generated id)
 */
export function saveProduct(product, storage) {
  if (!storage.products) {
    storage.products = [];
  }

  const savedProduct = { ...product };

  // Generate a unique ID if not provided
  if (!savedProduct.id) {
    savedProduct.id = `product-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }

  storage.products.push(savedProduct);
  return savedProduct;
}

/**
 * Retrieves all products from storage.
 *
 * @param {object} storage - Storage object with { products: [] }
 * @returns {Array} Array of product objects
 */
export function getProducts(storage) {
  return storage.products || [];
}