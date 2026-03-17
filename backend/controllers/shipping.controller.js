const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET /auth/shippings/:customerId
exports.getShippingsByCustomer = async (req, res) => {
  try {
    const { customerId } = req.params;
    const id = Number(customerId);

    if (!id || Number.isNaN(id)) {
      return res.status(400).json({ message: 'Invalid customer id' });
    }

    const shippings = await prisma.shipping.findMany({
      where: {
        order: {
          customer_id: id,
        },
      },
      orderBy: { shipping_id: 'desc' },
      include: {
        order: true,
        address: true,
      },
    });

    const formatted = shippings.map((s) => ({
      shipping_id: s.shipping_id,
      order_id: s.order_id,
      order_code: s.order ? `ORD-${String(s.order.order_id).padStart(4, '0')}` : 'Unknown',
      tracking_number: s.tracking_number || 'รอหมายเลขจัดส่ง',
      status: s.status || 'pending',
      shipped_at: s.shipped_at ? new Date(s.shipped_at).toISOString().split('T')[0] : '',
      address:
        s.address?.address_line ??
        `${s.address?.province ?? ''} ${s.address?.zip_code ?? ''}`.trim(),
    }));

    if (!formatted.length) {
      return res.json({ shippings: [], message: 'ยังไม่มีข้อมูลการจัดส่ง' });
    }

    res.json({ shippings: formatted });
  } catch (error) {
    console.error('Failed to fetch shippings', error);
    res.status(500).json({ message: 'Failed to load shippings', error: error.message });
  }
};