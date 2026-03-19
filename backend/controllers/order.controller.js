const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET /auth/orders/:customerId
exports.getOrdersByCustomer = async (req, res) => {
  try {
    const { customerId } = req.params;
    const id = Number(customerId);

    if (!id) {
      return res.status(400).json({ message: 'Invalid customer id' });
    }

    const orders = await prisma.order.findMany({
      where: { customer_id: id },
      orderBy: { created_at: 'desc' },
      include: {
        order_items: {
          include: { product: true },
        },
        payment: true,
        shipping: true,
      },
    });

    const statusMap = {
      pending: 'รอชำระเงิน',
      paid: 'ชำระแล้ว',
      preparing: 'กำลังจัดเตรียม',
      shipped: 'จัดส่งแล้ว',
      delivered: 'จัดส่งสำเร็จ',
      cancelled: 'ยกเลิก',
    };

    const formattedOrders = orders.map((order) => {
      const items = order.order_items.map((item) => ({
        product_id: item.product_id,
        name: item.product?.name ?? 'Unknown product',
        qty: item.quantity,
        price: Number(item.price_at_purchase),
      }));

      const totalAmount = items.reduce((sum, item) => sum + item.price * item.qty, 0);

      const dateStr = order.created_at ? new Date(order.created_at).toISOString().split('T')[0] : '';

      return {
        id: `ORD-${String(order.order_id).padStart(4, '0')}`,
        date: dateStr,
        status: statusMap[order.status] ?? order.status ?? 'ไม่ระบุสถานะ',
        items,
        totalAmount,
        payment_status: order.payment?.status ?? null,
        shipping_status: order.shipping?.status ?? null,
      };
    });

    if (!formattedOrders.length) {
      return res.json({ orders: [], message: 'ยังไม่มีคำสั่งซื้อ' });
    }

    res.json({ orders: formattedOrders });
  } catch (error) {
    console.error('Failed to fetch orders', error);
    res.status(500).json({ message: 'Failed to load orders', error: error.message });
  }
};

exports.createOrder = async (req, res) => {
  const { customerId, address, addressId, paymentMethod, totalAmount, items, discountId } = req.body;

  try {
    let finalAddressId = addressId;

    // Robust check: truthy and not 'new' string
    if (!finalAddressId || finalAddressId === 'new') {
      const existingAddress = await prisma.address.findFirst({
        where: {
          customer_id: Number(customerId),
          address_line: `${address.name} ${address.phone} | ${address.street}`,
          province: address.province,
          zip_code: address.zip
        }
      });

      if (existingAddress) {
        finalAddressId = existingAddress.address_id;
      } else {
        const newAddress = await prisma.address.create({
          data: {
            customer_id: Number(customerId),
            address_line: `${address.name} ${address.phone} | ${address.street}`,
            province: address.province,
            zip_code: address.zip
          }
        });
        finalAddressId = newAddress.address_id;
      }
    }

    // Create Order with nested writes
    const newOrder = await prisma.order.create({
      data: {
        customer_id: Number(customerId),
        total_amount: Number(totalAmount),
        status: 'pending',
        discount_id: discountId ? Number(discountId) : null,
        order_items: {
          create: items.map(item => ({
            product_id: Number(item.product_id),
            quantity: Number(item.quantity),
            price_at_purchase: Number(item.price)
          }))
        },
        payment: {
          create: {
            amount: Number(totalAmount),
            payment_method: paymentMethod,
            status: paymentMethod === 'cod' ? 'pending' : 'paid',
            paid_at: paymentMethod === 'cod' ? null : new Date()
          }
        },
        shipping: {
          create: {
            address_id: Number(finalAddressId),
            status: 'preparing'
          }
        }
      }
    });

    // Deduct stock for each purchased item
    await Promise.all(items.map(async (item) => {
      await prisma.product.update({
        where: { product_id: Number(item.product_id) },
        data: {
          stock_quantity: {
            decrement: Number(item.quantity)
          }
        }
      });
    }));

    // Clear only purchased items from cart
    const purchasedProductIds = items.map(item => Number(item.product_id));
    await prisma.cartItem.deleteMany({
      where: {
        customer_id: Number(customerId),
        product_id: { in: purchasedProductIds }
      }
    });

    res.status(201).json({ success: true, orderId: newOrder.order_id, message: 'บันทึกคำสั่งซื้อสำเร็จ' });
  } catch (error) {
    console.error('Failed to create order', error);
    res.status(500).json({ message: 'Failed to create order', error: error.message });
  }
};