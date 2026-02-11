const Employee = require('../models/Employee');

const generateEmployeeId = async () => {
  const lastEmployee = await Employee.findOne()
    .sort({ employeeId: -1 })
    .select('employeeId');

  if (!lastEmployee) {
    return 'EMP-0001';
  }

  const lastIdNum = parseInt(lastEmployee.employeeId.split('-')[1], 10);
  const newIdNum = lastIdNum + 1;
  return `EMP-${String(newIdNum).padStart(4, '0')}`;
};

module.exports = generateEmployeeId;
