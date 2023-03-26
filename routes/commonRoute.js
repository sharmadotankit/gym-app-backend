const express = require('express');
const router = express.Router();
const commanController = require("../controllers/commanController");

router.post('/save-exercise-to-profile',commanController.saveExerciseToProfile);
router.post('/update-user-information',commanController.updateUserInformation);
router.get('/fetch-saved-exercise/:id',commanController.fetchSavedExercise);

module.exports = router;