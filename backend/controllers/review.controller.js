const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET /auth/reviews/:customerId
exports.getReviewsByCustomer = async (req, res) => {
  try {
    const { customerId } = req.params;
    const id = Number(customerId);

    if (!id || Number.isNaN(id)) {
      return res.status(400).json({ message: 'Invalid customer id' });
    }

    const reviews = await prisma.review.findMany({
      where: { customer_id: id },
      orderBy: { created_at: 'desc' },
      include: {
        product: true,
        customer: true,
      },
    });

    const formatted = reviews.map((review) => ({
      review_id: review.review_id,
      product_id: review.product_id,
      product_name: review.product?.name ?? 'ไม่ระบุสินค้า',
      customer_id: review.customer_id,
      customer_name: `${review.customer?.first_name ?? ''} ${review.customer?.last_name ?? ''}`.trim(),
      rating: review.rating,
      comment: review.comment ?? '',
      created_at: review.created_at ? new Date(review.created_at).toISOString().split('T')[0] : '',
    }));

    if (!formatted.length) {
      return res.json({ reviews: [], message: 'ยังไม่มีรีวิว' });
    }

    res.json({ reviews: formatted });
  } catch (error) {
    console.error('Failed to fetch reviews', error);
    res.status(500).json({ message: 'Failed to load reviews', error: error.message });
  }
};
