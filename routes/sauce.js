const express = require('express');

const router = express.Router();

const sauceCtrl = require('../controllers/sauce');


router.get('/:id', sauceCtrl.getOneSauce);
router.get('/', sauceCtrl.getAllSauces);
router.post('/', sauceCtrl.CreateSauce);
router.put('/:id', sauceCtrl.ModifySauce);
router.delete('/:id', sauceCtrl.DeleteSauce);


module.exports = router;