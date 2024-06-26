const express = require('express');

const {createCharacteristicHandler, fetchCharacteristicHandler, updateCharacteristicHandler, deleteCharacteristicHandler} = require("../services/characteristic/characteristic");




const router = express.Router({mergeParams: true});

router.post('/', createCharacteristicHandler);
router.get('/:uri/', fetchCharacteristicHandler);
router.put('/:uri/', updateCharacteristicHandler);
router.delete('/:uri', deleteCharacteristicHandler);

module.exports = router;