import prisma from '../config/prisma.js';

export const getAllProducts = async (req, res) => {
  try {
    const { categoryId, brandId } = req.query;
    const where = {};
    if (categoryId) where.categoryId = parseInt(categoryId);
    if (brandId) where.brandId = parseInt(brandId);

    const products = await prisma.product.findMany({
      where,
      include: {
        category: true,
        brand: true,
        images: { orderBy: { order: 'asc' } },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) },
      include: {
        category: true,
        brand: true,
        images: { orderBy: { order: 'asc' } },
      },
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
