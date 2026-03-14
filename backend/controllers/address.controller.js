const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET /auth/addresses/:customerId
exports.getAddressesByCustomer = async (req, res) => {
  try {
    const { customerId } = req.params;
    const id = Number(customerId);

    if (!id || Number.isNaN(id)) {
      return res.status(400).json({ message: 'Invalid customer id' });
    }

    const addresses = await prisma.address.findMany({
      where: { customer_id: id },
      orderBy: { is_default: 'desc' },
    });

    const formatted = addresses.map((item) => ({
      address_id: item.address_id,
      customer_id: item.customer_id,
      address_line: item.address_line,
      province: item.province || '',
      zip_code: item.zip_code || '',
      is_default: item.is_default || false,
    }));

    if (!formatted.length) {
      return res.json({ addresses: [], message: 'ยังไม่มีที่อยู่บันทึก' });
    }

    res.json({ addresses: formatted });
  } catch (error) {
    console.error('Failed to fetch addresses', error);
    res.status(500).json({ message: 'Failed to load addresses', error: error.message });
  }
};