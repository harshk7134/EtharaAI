const Attendance = require('../models/Attendance');
const Employee = require('../models/Employee');

// @desc    Mark attendance for an employee
// @route   POST /api/attendance
exports.markAttendance = async (req, res, next) => {
  try {
    const { employeeId, date, status } = req.body;

    // Validate required fields
    if (!employeeId || !date || !status) {
      return res.status(400).json({
        success: false,
        message: 'Please provide employeeId, date, and status',
      });
    }

    // Validate status enum
    if (!['Present', 'Absent'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be either Present or Absent',
      });
    }

    // Check employee exists
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found',
      });
    }

    // Normalise date to UTC midnight
    const attendanceDate = new Date(date);
    attendanceDate.setUTCHours(0, 0, 0, 0);

    // Upsert – update if already marked, otherwise create
    const existing = await Attendance.findOne({
      employee: employeeId,
      date: attendanceDate,
    });

    if (existing) {
      existing.status = status;
      await existing.save();
      return res.json({
        success: true,
        data: existing,
        message: 'Attendance updated',
      });
    }

    const attendance = await Attendance.create({
      employee: employeeId,
      date: attendanceDate,
      status,
    });

    res.status(201).json({ success: true, data: attendance });
  } catch (error) {
    next(error);
  }
};

// @desc    Get attendance records for an employee (with optional date filter)
// @route   GET /api/attendance/:employeeId
exports.getAttendance = async (req, res, next) => {
  try {
    const { employeeId } = req.params;
    const { date, startDate, endDate } = req.query;

    // Check employee exists
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found',
      });
    }

    const query = { employee: employeeId };

    // Filter by specific date
    if (date) {
      const filterDate = new Date(date);
      filterDate.setUTCHours(0, 0, 0, 0);
      const nextDay = new Date(filterDate);
      nextDay.setUTCDate(nextDay.getUTCDate() + 1);
      query.date = { $gte: filterDate, $lt: nextDay };
    }

    // Filter by date range
    if (startDate && endDate) {
      const start = new Date(startDate);
      start.setUTCHours(0, 0, 0, 0);
      const end = new Date(endDate);
      end.setUTCHours(23, 59, 59, 999);
      query.date = { $gte: start, $lte: end };
    }

    const records = await Attendance.find(query)
      .populate('employee', 'employeeId fullName department')
      .sort({ date: -1 });

    const totalPresent = records.filter((r) => r.status === 'Present').length;
    const totalAbsent = records.filter((r) => r.status === 'Absent').length;

    res.json({
      success: true,
      data: records,
      summary: {
        total: records.length,
        present: totalPresent,
        absent: totalAbsent,
      },
      employee,
    });
  } catch (error) {
    next(error);
  }
};
