const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

async function main() {
  // Check product images
  const images = await p.productImage.findMany({ take: 3 });
  console.log('=== Product Images (first 3) ===');
  console.log(JSON.stringify(images, null, 2));

  // Check cart items for customer 3
  const cart = await p.cartItem.findMany({
    where: { customer_id: 3 },
    include: {
      product: {
        include: {
          images: { where: { is_primary: true }, take: 1 }
        }
      }
    }
  });
  console.log('=== Cart items for customer 3 ===');
  console.log(JSON.stringify(cart, null, 2));
}

main()
  .catch(console.error)
  .finally(() => p.$disconnect());
