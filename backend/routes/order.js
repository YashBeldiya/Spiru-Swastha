const { createOrder, getAllOrders, getOrdersByUserId, updateOrderStatus, deleteOrderByAdmin } = require('../controllers/order');

const router = require('express').Router()

router.post("/add", createOrder);
router.get("/get", getAllOrders);
router.get("/get/:userId", getOrdersByUserId);
router.put("/update-status/:orderId", updateOrderStatus);
router.delete("/delete/:orderId", deleteOrderByAdmin);

module.exports = router