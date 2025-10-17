const express = require('express');
const router = express.Router();
const controller = require('../controllers/smartphoneController');

// Route racine pour frontend
router.get('/', controller.getAllSmartphones);

// Routes classiques
router.get('/smartphones', controller.getAllSmartphones);
router.get('/smartphones/:id', controller.getSmartphoneById);
router.post('/smartphones', controller.addSmartphone);
router.put('/smartphones/:id', controller.updateSmartphone);

// Suppression avec vérification
const checkDeleteCode = require('../middleware/checkCode');
router.delete('/smartphones/:id', checkDeleteCode, controller.deleteSmartphone);

module.exports = router;
