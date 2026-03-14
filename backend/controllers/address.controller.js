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

// POST /auth/addresses
exports.createAddress = async (req, res) => {
  try {
    const { customer_id, address_line, province, zip_code, is_default: requestedIsDefault } = req.body;

    if (!customer_id || Number.isNaN(Number(customer_id))) {
      return res.status(400).json({ message: 'Invalid customer id' });
    }

    // Safely verify address_line is string and not empty
    if (!address_line || typeof address_line !== 'string' || !address_line.trim()) {
      return res.status(400).json({ message: 'Address line is required and must be a valid text' });
    }

    // Check if it's the first address, if so make it default
    const existingCount = await prisma.address.count({
      where: { customer_id: Number(customer_id) },
    });

    let is_default = existingCount === 0 ? true : Boolean(requestedIsDefault);

    if (is_default && existingCount > 0) {
      // Set other addresses to false if this new one is default
      await prisma.address.updateMany({
        where: { customer_id: Number(customer_id) },
        data: { is_default: false },
      });
    }

    const newAddress = await prisma.address.create({
      data: {
        customer_id: Number(customer_id),
        address_line: address_line.trim(),
        province: province ? String(province).trim() : null,
        zip_code: zip_code ? String(zip_code).trim() : null,
        is_default: is_default,
      },
    });

    res.status(201).json({
      message: 'เพิ่มที่อยู่สำเร็จ',
      address: {
        address_id: newAddress.address_id,
        customer_id: newAddress.customer_id,
        address_line: newAddress.address_line,
        province: newAddress.province || '',
        zip_code: newAddress.zip_code || '',
        is_default: newAddress.is_default || false,
      }
    });
  } catch (error) {
    console.error('Failed to create address', error);
    res.status(500).json({ message: 'Failed to create address', error: error.message });
  }
};

// DELETE /auth/addresses/:addressId
exports.deleteAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const id = Number(addressId);

    if (!id || Number.isNaN(id)) {
      return res.status(400).json({ message: 'Invalid address id' });
    }

    const address = await prisma.address.findUnique({
      where: { address_id: id },
      include: {
        shippings: true
      }
    });

    if (!address) {
      return res.status(404).json({ message: 'Address not found' });
    }

    // Check if the address is being used in any shippings
    if (address.shippings && address.shippings.length > 0) {
      return res.status(400).json({ 
        message: 'ไม่สามารถลบที่อยู่นี้ได้เนื่องจากถูกใช้งานในรายการสั่งซื้อแล้ว' 
      });
    }

    await prisma.address.delete({
      where: { address_id: id }
    });

    res.json({ message: 'ลบที่อยู่สำเร็จ', address_id: id });
  } catch (error) {
    console.error('Failed to delete address', error);
    
    // Check for Prisma foreign key constraint error just in case
    if (error.code === 'P2003') {
      return res.status(400).json({ 
        message: 'ไม่สามารถลบที่อยู่นี้ได้เนื่องจากมีข้อมูลอื่นอ้างอิงอยู่' 
      });
    }

    res.status(500).json({ message: 'Failed to delete address', error: error.message });
  }
};