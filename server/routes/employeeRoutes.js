const express = require('express');
const router = express.Router();
const {
  getEmployees,
  getEmployee,
  createEmployee,
  deleteEmployee,
} = require('../controllers/employeeController');

router.route('/').get(getEmployees).post(createEmployee);
router.route('/:id').get(getEmployee).delete(deleteEmployee);

module.exports = router;
