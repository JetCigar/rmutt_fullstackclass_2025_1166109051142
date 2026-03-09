const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

/* GET addresses */
router.get("/", async (req, res) => {
  try {

    const customerId = 1;

    // หา customer
    const customer = await prisma.customer.findUnique({
      where: {
        customer_id: customerId
      }
    });

    if (!customer) {
      return res.status(404).json({
        error: "Customer not found"
      });
    }

    // หา address ของ customer
    const addresses = await prisma.address.findMany({
      where: {
        customer_id: customerId
      },
      orderBy: {
        is_default: "desc"
      }
    });

    res.json({
      customerName: `${customer.first_name} ${customer.last_name}`,
      addresses: addresses
    });

  } catch (error) {

    console.error("GET ADDRESS ERROR:", error);

    res.status(500).json({
      error: "Server error"
    });

  }
});


/* CREATE address */
router.post("/", async (req, res) => {

  try {

    const { address_line, province, zip_code } = req.body;

    const newAddress = await prisma.address.create({
      data: {
        customer_id: 1,
        address_line,
        province,
        zip_code,
        is_default: false
      }
    });

    res.json(newAddress);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Create address failed"
    });

  }

});


/* UPDATE address */
router.put("/:id", async (req, res) => {

  try {

    const id = Number(req.params.id);

    const { address_line, province, zip_code } = req.body;

    const updated = await prisma.address.update({
      where: {
        address_id: id
      },
      data: {
        address_line,
        province,
        zip_code
      }
    });

    res.json(updated);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Update address failed"
    });

  }

});


/* DELETE address */
router.delete("/:id", async (req, res) => {

  try {

    const id = Number(req.params.id);

    await prisma.address.delete({
      where: {
        address_id: id
      }
    });

    res.json({
      message: "Address deleted"
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Delete address failed"
    });

  }

});

module.exports = router;