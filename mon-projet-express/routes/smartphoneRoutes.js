const express = require('express');
const router = express.Router();
const controller = require('../controllers/smartphoneController');
const checkDeleteCode = require('../middleware/checkCode');

// ✅ Route principale pour le frontend
router.get('/', controller.getAllSmartphones);  // => /api/products

// Routes CRUD
router.post('/smartphones', controller.addSmartphone);
router.get('/smartphones', controller.getAllSmartphones);
router.get('/smartphones/:id', controller.getSmartphoneById);
router.put('/smartphones/:id', controller.updateSmartphone);

// Suppression avec vérification
router.delete('/smartphones/:id', checkDeleteCode, controller.deleteSmartphone);

module.exports = router;
