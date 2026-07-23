import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongodb';
import Employee from '@/lib/db/models/Employee';

export async function GET(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    
    let employee = null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      employee = await Employee.findById(id);
    }
    if (!employee) {
      employee = await Employee.findOne({ empId: id });
    }

    if (!employee) {
      return NextResponse.json({ success: false, message: 'Employee verification record not found' }, { status: 404 });
    }

    // Mask Aadhar Number for public view e.g. XXXX-XXXX-1234
    const cleanAadhar = (employee.aadharNumber || '').replace(/\D/g, '');
    const maskedAadhar = cleanAadhar.length >= 4 
      ? `XXXX-XXXX-${cleanAadhar.slice(-4)}`
      : 'XXXX-XXXX-XXXX';

    return NextResponse.json({ 
      success: true, 
      employee: {
        _id: employee._id,
        empId: employee.empId,
        name: employee.name,
        email: employee.email,
        phone: employee.phone,
        maskedAadhar,
        department: employee.department,
        designation: employee.designation,
        joiningDate: employee.joiningDate,
        bloodGroup: employee.bloodGroup,
        address: employee.address,
        status: employee.status,
        photo: employee.photo,
        performanceRating: employee.performanceRating
      } 
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
