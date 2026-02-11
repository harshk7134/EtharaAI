const Employee = require('../models/Employee');
const Attendance = require('../models/Attendance');

// @desc    Get dashboard summary
// @route   GET /api/dashboard
exports.getDashboard = async (req, res, next) => {
  try {
    const totalEmployees = await Employee.countDocuments();

    // Today's date range (UTC)
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);

    const todayAttendance = await Attendance.find({
      date: { $gte: today, $lt: tomorrow },
    });

    const presentToday = todayAttendance.filter(
      (a) => a.status === 'Present'
    ).length;
    const absentToday = todayAttendance.filter(
      (a) => a.status === 'Absent'
    ).length;

    // Department-wise count
    const departmentStats = await Employee.aggregate([
      { $group: { _id: '$department', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Recent employees
    const recentEmployees = await Employee.find()
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      data: {
        totalEmployees,
        todayAttendance: {
          present: presentToday,
          absent: absentToday,
          unmarked: totalEmployees - presentToday - absentToday,
        },
        departmentStats,
        recentEmployees,
      },
    });
  } catch (error) {
    next(error);
  }
};
