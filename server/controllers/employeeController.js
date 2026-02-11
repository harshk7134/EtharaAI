const Employee = require('../models/Employee');
const Attendance = require('../models/Attendance');
const generateEmployeeId = require('../utils/generateEmployeeId');

// @desc    Get all employees
// @route   GET /api/employees
exports.getEmployees = async (req, res, next) => {
  try {
    const employees = await Employee.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      data: employees,
      count: employees.length,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single employee
// @route   GET /api/employees/:id
exports.getEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found',
      });
    }
    res.json({ success: true, data: employee });
  } catch (error) {
    next(error);
  }
};

// @desc    Create employee
// @route   POST /api/employees
exports.createEmployee = async (req, res, next) => {
  try {
    const { fullName, email, department } = req.body;

    // Required fields
    if (!fullName || !email || !department) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: fullName, email, department',
      });
    }

    // Email format
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address',
      });
    }

    // Duplicate email check
    const existingEmployee = await Employee.findOne({
      email: email.toLowerCase(),
    });
    if (existingEmployee) {
      return res.status(409).json({
        success: false,
        message: 'An employee with this email already exists',
      });
    }

    // Auto-generate employee ID
    const employeeId = await generateEmployeeId();

    const employee = await Employee.create({
      employeeId,
      fullName,
      email,
      department,
    });

    res.status(201).json({ success: true, data: employee });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete employee (cascade-deletes attendance)
// @route   DELETE /api/employees/:id
exports.deleteEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found',
      });
    }

    // Remove related attendance records first
    await Attendance.deleteMany({ employee: req.params.id });
    await Employee.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Employee and related attendance records deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
