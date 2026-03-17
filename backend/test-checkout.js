const axios = require('axios');

async function testCheckout() {
  try {
    const payload = {
      customerId: 3, // Assuming user ID 3
      address: {
        name: 'Vteca User',
        phone: '081-234-5678',
        street: '123 Test Street',
        province: 'Bangkok',
        zip: '10000'
      },
      paymentMethod: 'card',
      totalAmount: 4500,
      items: [
        {
          product_id: 1,
          quantity: 1,
          price: 4500
        }
      ]
    };

    console.log('Sending checkout request:', payload);
    const res = await axios.post('http://localhost:9999/auth/orders/create', payload);
    console.log('Response:', res.data);
  } catch (err) {
    console.error('Error:', err.response ? err.response.data : err.message);
  }
}

testCheckout();
