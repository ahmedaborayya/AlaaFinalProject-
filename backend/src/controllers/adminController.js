import prisma from '../config/prisma.js';

const UNCATEGORIZED_SLUG = 'uncategorized';

/** Ensure the fallback "Uncategorized" category always exists, return its id */
async function getOrCreateUncategorized() {
  let cat = await prisma.category.findUnique({ where: { slug: UNCATEGORIZED_SLUG } });
  if (!cat) {
    cat = await prisma.category.create({
      data: { name: 'Uncategorized', slug: UNCATEGORIZED_SLUG },
    });
  }
  return cat;
}

// --- Products ---
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, stock, categoryId, brandId, imageUrl } = req.body;
    const newProduct = await prisma.product.create({
      data: {
        name, description, price,
        stock: Number(stock) || 0,
        categoryId: Number(categoryId),
        brandId: brandId ? Number(brandId) : null,
        imageUrl,
      },
    });
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, stock, categoryId, brandId, imageUrl } = req.body;

    const updatedProduct = await prisma.product.update({
      where: { id: parseInt(id) },
      data: {
        name, description, price,
        stock: Number(stock) || 0,
        categoryId: Number(categoryId),
        brandId: brandId ? Number(brandId) : null,
        imageUrl,
      },
    });
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.product.delete({ where: { id: parseInt(id) } });
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// --- Categories ---
export const createCategory = async (req, res) => {
  try {
    const { name, slug, videoUrl } = req.body;
    const newCategory = await prisma.category.create({
      data: { name, slug, videoUrl: videoUrl || null },
    });
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, slug, videoUrl } = req.body;
    const updated = await prisma.category.update({
      where: { id: parseInt(id) },
      data: { name, slug, videoUrl: videoUrl || null },
    });
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const catId = parseInt(id);

    // Get or create the "Uncategorized" fallback
    const uncategorized = await getOrCreateUncategorized();

    // Cannot delete the uncategorized category itself
    if (catId === uncategorized.id) {
      return res.status(400).json({ message: 'Cannot delete the Uncategorized fallback category.' });
    }

    // Reassign all products from the deleted category to Uncategorized
    await prisma.product.updateMany({
      where: { categoryId: catId },
      data: { categoryId: uncategorized.id },
    });

    // Now delete the category
    await prisma.category.delete({ where: { id: catId } });

    res.status(200).json({
      message: 'Category deleted. Its products have been moved to Uncategorized.',
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// --- Orders ---
export const getAllOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: { select: { id: true, name: true, email: true } },
        orderItems: { include: { product: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updatedOrder = await prisma.order.update({
      where: { id: parseInt(id) },
      data: { status },
    });
    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// --- Users ---
export const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
