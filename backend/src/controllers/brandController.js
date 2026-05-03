import prisma from '../config/prisma.js';

export const getAllBrands = async (req, res) => {
  try {
    const brands = await prisma.brand.findMany({
      orderBy: { name: 'asc' },
    });
    res.status(200).json(brands);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getBrandById = async (req, res) => {
  try {
    const { id } = req.params;
    const brand = await prisma.brand.findUnique({
      where: { id: parseInt(id) },
      include: {
        products: {
          include: { images: { orderBy: { order: 'asc' } }, category: true },
        },
      },
    });
    if (!brand) return res.status(404).json({ message: 'Brand not found' });
    res.status(200).json(brand);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
