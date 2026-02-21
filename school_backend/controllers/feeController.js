// c:\Users\praka\OneDrive\Desktop\school\school_backend\controllers\feeController.js

const db = require("../config/db");

// --- CONSTANTS ---
const ACADEMIC_MONTHS = [
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
  "January",
  "February",
  "March",
];

// --- HELPER: Get Academic Year ---
const getAcademicYear = () => {
  const today = new Date();
  const month = today.getMonth(); // 0=Jan, 3=Apr
  return month < 3 ? today.getFullYear() - 1 : today.getFullYear();
};

// --- HELPER: Calculate Late Fee ---
const calculateLateFee = (dueDate, paymentDate, monthlyFee, lateFeeConfig) => {
  if (!lateFeeConfig || !lateFeeConfig.is_enabled) return 0;

  const due = new Date(dueDate);
  const payment = new Date(paymentDate);

  if (payment <= due) return 0;

  const daysLate = Math.floor((payment - due) / (1000 * 60 * 60 * 24));
  const gracePeriod = lateFeeConfig.grace_period_days || 0;

  if (daysLate <= gracePeriod) return 0;

  const effectiveDaysLate = daysLate - gracePeriod;

  if (lateFeeConfig.fee_type === "fixed") {
    return lateFeeConfig.fixed_amount || 0;
  } else if (lateFeeConfig.fee_type === "percentage") {
    const percentage = lateFeeConfig.percentage || 0;
    return Math.round((monthlyFee * percentage) / 100);
  } else if (lateFeeConfig.fee_type === "per_day") {
    const perDayFee = lateFeeConfig.per_day_amount || 0;
    const maxFee = lateFeeConfig.max_late_fee || monthlyFee * 0.5;
    return Math.min(effectiveDaysLate * perDayFee, maxFee);
  }

  return 0;
};

// --- GET FEE HISTORY ---
exports.getFeeHistory = async (req, res) => {
  try {
    const { 
      academic_year, 
      classname, 
      month, 
      payment_mode, 
      limit = '1000',  // Default limit for performance
      offset = '0',     // Support pagination
      student_id       // Filter by specific student
    } = req.query;

    // Count total records first (for pagination)
    let countQuery = "SELECT COUNT(*) as total FROM fee_collections WHERE 1=1";
    const countParams = [];

    if (academic_year) {
      countQuery += " AND year = ?";
      countParams.push(academic_year);
    }

    if (classname) {
      countQuery += " AND classname = ?";
      countParams.push(classname);
    }

    if (month) {
      countQuery += " AND month = ?";
      countParams.push(month);
    }

    if (payment_mode) {
      countQuery += " AND payment_mode = ?";
      countParams.push(payment_mode);
    }

    if (student_id) {
      countQuery += " AND admission_no = ?";
      countParams.push(student_id);
    }

    const [countResult] = await db.execute(countQuery, countParams);
    const totalRecords = countResult[0]?.total || 0;

    // Main query with optimized columns (reduce data transfer)
    let query = `SELECT 
      id, admission_no, student_name, classname, roll_no, 
      month, year, monthly_fees, exam_fees, annual_fee, 
      other_fee, bus_fee, dress_fee, book_fee, fine, late_fee,
      discount, scholarship, total_amount, payment_date, 
      payment_mode, receipt_no, notes, uses_bus, is_partial, 
      payment_type, academic_year 
    FROM fee_collections WHERE 1=1`;
    const params = [];

    if (academic_year) {
      query += " AND year = ?";
      params.push(academic_year);
    }

    if (classname) {
      query += " AND classname = ?";
      params.push(classname);
    }

    if (month) {
      query += " AND month = ?";
      params.push(month);
    }

    if (payment_mode) {
      query += " AND payment_mode = ?";
      params.push(payment_mode);
    }

    if (student_id) {
      query += " AND admission_no = ?";
      params.push(student_id);
    }

    query += " ORDER BY payment_date DESC";
    
    // Apply pagination
    const safeLimit = Math.min(parseInt(limit), 5000); // Max 5000 records per request
    const safeOffset = Math.max(0, parseInt(offset));
    query += " LIMIT ? OFFSET ?";
    params.push(safeLimit, safeOffset);

    const [rows] = await db.execute(query, params);

    console.log(`[getFeeHistory] Returning ${rows.length} of ${totalRecords} fee collection records (paginated)`);

    // Map database columns to frontend expected format
    const history = rows.map((f) => ({
      _id: f.id,
      admissionNo: f.admission_no,
      studentName: f.student_name,
      classname: f.classname,
      roll_no: f.roll_no,
      month: f.month,
      year: f.year,
      monthly_fees: Number(f.monthly_fees || 0),
      exam_fees: Number(f.exam_fees || 0),
      admission_fees: Number(f.annual_fee || 0),
      other_fee: Number(f.other_fee || 0),
      bus_fee: Number(f.bus_fee || 0),
      dress_fee: Number(f.dress_fee || 0),
      book_fee: Number(f.book_fee || 0),
      fine: Number(f.fine || 0),
      late_fee: Number(f.late_fee || 0),
      discount: Number(f.discount || 0),
      scholarship: Number(f.scholarship || 0),
      totalAmount: Number(f.total_amount || 0),
      date: f.payment_date,
      paymentMode: f.payment_mode,
      receiptNo: f.receipt_no,
      notes: f.notes,
      usesBus: f.uses_bus === 1,
      is_partial: f.is_partial === 1,
      payment_type: f.payment_type || "full",
      academic_year: f.academic_year || f.year,
    }));

    // Return paginated response with metadata
    res.json({
      data: history,
      pagination: {
        total: totalRecords,
        limit: safeLimit,
        offset: safeOffset,
        currentPage: Math.floor(safeOffset / safeLimit) + 1,
        totalPages: Math.ceil(totalRecords / safeLimit),
        hasMore: (safeOffset + safeLimit) < totalRecords
      }
    });
  } catch (err) {
    console.error("Error fetching fee history:", err);
    res.status(500).json({ message: err.message });
  }
};

// --- COLLECT FEE (SAVE PAYMENT) ---
exports.collectFee = async (req, res) => {
  
  try {
    const {
      admissionNo,
      studentName,
      classname,
      roll_no,
      month,
      year,
      monthly_fees,
      exam_fees,
      admission_fees,
      other_fee,
      bus_fee,
      dress_fee,
      book_fee,
      fine,
      late_fee,
      discount,
      scholarship,
      totalAmount,
      date,
      notes,
      paymentMode,
      receiptNo,
      usesBus,
      is_partial,
      payment_type,
      paid_amount,
      due_amount,
    } = req.body;

    // Calculate academic year
    const academicYear = getAcademicYear();

    // --- DUPLICATE CHECKS (Optimized: Single Query) ---
    const [existingFees] = await db.execute(
      `SELECT 
        SUM(CASE WHEN month = ? AND year = ? AND monthly_fees > 0 AND is_partial = 0 THEN 1 ELSE 0 END) as monthly_paid,
        SUM(CASE WHEN annual_fee > 0 THEN 1 ELSE 0 END) as admission_paid,
        SUM(CASE WHEN exam_fees > 0 AND (year = ? OR academic_year = ?) THEN 1 ELSE 0 END) as exam_paid,
        SUM(CASE WHEN dress_fee > 0 THEN 1 ELSE 0 END) as dress_paid,
        SUM(CASE WHEN book_fee > 0 THEN 1 ELSE 0 END) as book_paid
      FROM fee_collections WHERE admission_no = ?`,
      [month, year, year, academicYear, admissionNo]
    );

    const checks = existingFees[0];

    // Check monthly fee
    if (monthly_fees > 0 && month !== "Miscellaneous" && checks.monthly_paid > 0) {
      return res.status(400).json({
        message: `Monthly fees for ${month} ${year} already collected in full`,
      });
    }

    // Check admission fee
    if (admission_fees > 0 && checks.admission_paid > 0) {
      return res.status(400).json({
        message: "Admission fee already collected for this student",
      });
    }

    // Check exam fee
    if (exam_fees > 0 && checks.exam_paid > 0) {
      return res.status(400).json({
        message: `Exam fee already collected for academic year ${academicYear}`,
      });
    }

    // Check dress fee
    if (dress_fee > 0 && checks.dress_paid > 0) {
      return res.status(400).json({ 
        message: "Dress fee already collected for this student" 
      });
    }

    // Check book fee
    if (book_fee > 0 && checks.book_paid > 0) {
      return res.status(400).json({ 
        message: "Book fee already collected for this student" 
      });
    }

    // --- INSERT INTO DATABASE ---
    // Use basic columns that definitely exist
    const query = `
      INSERT INTO fee_collections (
        admission_no, student_name, classname, roll_no, month, year,
        monthly_fees, exam_fees, annual_fee, other_fee, bus_fee, 
        dress_fee, book_fee, fine, discount, total_amount, 
        payment_date, notes, payment_mode, receipt_no, uses_bus
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      admissionNo,
      studentName,
      classname,
      roll_no,
      month,
      year,
      Number(monthly_fees) || 0,
      Number(exam_fees) || 0,
      Number(admission_fees) || 0,
      Number(other_fee) || 0,
      Number(bus_fee) || 0,
      Number(dress_fee) || 0,
      Number(book_fee) || 0,
      Number(fine) || 0,
      Number(discount) || 0,
      Number(paid_amount) || 0,
      new Date(),
      notes,
      paymentMode,
      receiptNo,
      usesBus ? 1 : 0,
    ];

    const [result] = await db.execute(query, values);

    const due_query = `
  INSERT INTO fee_dues (admission_no, due_amount)
  VALUES (?, ?)
  ON DUPLICATE KEY UPDATE
    due_amount = VALUES(due_amount)
  `;

    const due_values = [admissionNo, Number(due_amount) || 0];

    const [due_result] = await db.execute(due_query, due_values);

    // Update student's fee ledger for tracking
    await updateFeeLedger(admissionNo, month, year, paid_amount, payment_type);

    // Log details for audit trail
    console.log(
      `Fee collected successfully for Admission No: ${admissionNo}, Receipt: ${receiptNo}`,
    );
    console.log(
      `Payment Details - Monthly: ₹${monthly_fees || 0}, Bus: ₹${bus_fee || 0}, Exam: ₹${exam_fees || 0}, Total: ₹${paid_amount}`,
    );
    if (bus_fee > 0) {
      console.log(
        `Bus fee collected for ${studentName} (${admissionNo}) - Month: ${month} ${year}`,
      );
    }

    res
      .status(201)
      .json({ _id: result.insertId, message: "Fee collected successfully" });
  } catch (err) {
    console.error("Fee Collection Error:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

// --- UPDATE FEE LEDGER (Track monthly fee status) ---
async function updateFeeLedger(admissionNo, month, year, amount, paymentType) {
  // Skip if ledger table doesn't exist yet
  if (!admissionNo || !month || !year) return;

  try {
    // Check if table exists first
    const [tables] = await db.execute("SHOW TABLES LIKE 'fee_ledger'");
    if (tables.length === 0) {
      console.log("Fee ledger table not found - skipping update");
      return;
    }

    // Upsert into fee_ledger table
    await db.execute(
      `
      INSERT INTO fee_ledger (admission_no, month, year, amount_paid, payment_status, last_payment_date)
      VALUES (?, ?, ?, ?, ?, NOW())
      ON DUPLICATE KEY UPDATE 
        amount_paid = amount_paid + VALUES(amount_paid),
        payment_status = IF(payment_status = 'partial' AND ? = 'full', 'paid', payment_status),
        last_payment_date = NOW()
    `,
      [
        admissionNo,
        month,
        year,
        amount,
        paymentType || "full",
        paymentType || "full",
      ],
    );
  } catch (err) {
    // Table might not exist - ignore for now
    console.log("Fee ledger update skipped:", err.message);
  }
}

// --- GET STUDENT FEE SUMMARY ---
exports.getStudentFeeSummary = async (req, res) => {
  try {
    const { admissionNo } = req.params;
    const academicYear = getAcademicYear();

    // Get all payments for this student
    const [payments] = await db.execute(
      "SELECT * FROM fee_collections WHERE admission_no = ? ORDER BY payment_date DESC",
      [admissionNo],
    );

    // Get student info
    const [students] = await db.execute(
      "SELECT * FROM students WHERE admission_no = ?",
      [admissionNo],
    );

    if (students.length === 0) {
      return res.status(404).json({ message: "Student not found" });
    }

    const student = students[0];

    // Get fee structure for student's class
    const [feeStructure] = await db.execute(
      "SELECT * FROM fee_structure WHERE classname = ?",
      [student.classname],
    );

    const structure = feeStructure[0] || {};

    // Calculate totals
    const totalPaid = payments.reduce(
      (sum, p) => sum + Number(p.total_amount || 0),
      0,
    );
    const monthlyPaid = payments.reduce(
      (sum, p) => sum + Number(p.monthly_fees || 0),
      0,
    );
    const busPaid = payments.reduce(
      (sum, p) => sum + Number(p.bus_fee || 0),
      0,
    );

    // Get months paid
    const monthsPaid = payments
      .filter((p) => p.monthly_fees > 0 && p.month !== "Miscellaneous")
      .map((p) => ({ month: p.month, year: p.year }));

    // Calculate expected fees based on admission date
    const admissionDate = student.admission_date || student.created_at;
    let expectedMonths = 0;

    if (admissionDate) {
      const admDate = new Date(admissionDate);
      const now = new Date();

      // Calculate months from admission to now
      const monthsDiff =
        (now.getFullYear() - admDate.getFullYear()) * 12 +
        (now.getMonth() - admDate.getMonth()) +
        1;
      expectedMonths = Math.max(0, monthsDiff);
    }

    const expectedMonthlyFees = expectedMonths * (structure.monthly_fee || 0);
    const expectedBusFees = student.uses_bus
      ? expectedMonths * (structure.bus_fee || 0)
      : 0;

    // One-time fees status
    const admissionFeePaid = payments.some((p) => Number(p.annual_fee) > 0);
    const examFeePaid = payments.some((p) => Number(p.exam_fees) > 0);
    const dressFeePaid = payments.some((p) => Number(p.dress_fee) > 0);
    const bookFeePaid = payments.some((p) => Number(p.book_fee) > 0);

    res.json({
      student: {
        admission_no: student.admission_no,
        student_name: student.student_name,
        classname: student.classname,
        roll_no: student.roll_no,
        uses_bus: student.uses_bus,
      },
      feeStructure: structure,
      summary: {
        totalPaid,
        monthlyPaid,
        busPaid,
        expectedMonths,
        expectedMonthlyFees,
        expectedBusFees,
        monthlyPending: Math.max(0, expectedMonthlyFees - monthlyPaid),
        busPending: Math.max(0, expectedBusFees - busPaid),
        monthsPaid,
        oneTimeFees: {
          admission: {
            required: structure.annual_fee || 0,
            paid: admissionFeePaid,
            pending: admissionFeePaid ? 0 : structure.annual_fee || 0,
          },
          exam: {
            required: structure.exam_fee || 0,
            paid: examFeePaid,
            pending: examFeePaid ? 0 : structure.exam_fee || 0,
          },
          dress: {
            required: structure.dress_fee || 0,
            paid: dressFeePaid,
            pending: dressFeePaid ? 0 : structure.dress_fee || 0,
          },
          book: {
            required: structure.book_fee || 0,
            paid: bookFeePaid,
            pending: bookFeePaid ? 0 : structure.book_fee || 0,
          },
        },
      },
      payments: payments.map((f) => ({
        _id: f.id,
        month: f.month,
        year: f.year,
        monthly_fees: Number(f.monthly_fees || 0),
        bus_fee: Number(f.bus_fee || 0),
        totalAmount: Number(f.total_amount || 0),
        date: f.payment_date,
        receiptNo: f.receipt_no,
      })),
    });
  } catch (err) {
    console.error("Error fetching student fee summary:", err);
    res.status(500).json({ message: err.message });
  }
};

// --- GET FEE ANALYTICS ---
exports.getFeeAnalytics = async (req, res) => {
  try {
    const { academic_year } = req.query;
    const year = academic_year || getAcademicYear();

    // Total collection
    const [totalResult] = await db.execute(
      "SELECT SUM(total_amount) as total FROM fee_collections WHERE year = ? OR academic_year = ?",
      [year, year],
    );

    // Monthly collection breakdown
    const [monthlyBreakdown] = await db.execute(
      `
      SELECT month, SUM(total_amount) as total, COUNT(*) as transactions
      FROM fee_collections 
      WHERE year = ? OR academic_year = ?
      GROUP BY month
      ORDER BY FIELD(month, 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December', 'January', 'February', 'March')
    `,
      [year, year],
    );

    // Class-wise collection
    const [classWise] = await db.execute(
      `
      SELECT classname, SUM(total_amount) as total, COUNT(DISTINCT admission_no) as students
      FROM fee_collections 
      WHERE year = ? OR academic_year = ?
      GROUP BY classname
      ORDER BY classname
    `,
      [year, year],
    );

    // Payment mode breakdown
    const [paymentModes] = await db.execute(
      `
      SELECT payment_mode, SUM(total_amount) as total, COUNT(*) as count
      FROM fee_collections 
      WHERE year = ? OR academic_year = ?
      GROUP BY payment_mode
    `,
      [year, year],
    );

    // Fee type breakdown
    const [feeTypes] = await db.execute(
      `
      SELECT 
        SUM(monthly_fees) as monthly,
        SUM(bus_fee) as bus,
        SUM(exam_fees) as exam,
        SUM(annual_fee) as admission,
        SUM(dress_fee) as dress,
        SUM(book_fee) as book,
        SUM(other_fee) as other,
        SUM(fine) as fine,
        SUM(discount) as discount
      FROM fee_collections 
      WHERE year = ? OR academic_year = ?
    `,
      [year, year],
    );

    // Today's collection
    const [todayResult] = await db.execute(
      "SELECT SUM(total_amount) as total, COUNT(*) as count FROM fee_collections WHERE DATE(payment_date) = CURDATE()",
    );

    // This month's collection
    const [thisMonthResult] = await db.execute(
      "SELECT SUM(total_amount) as total, COUNT(*) as count FROM fee_collections WHERE MONTH(payment_date) = MONTH(CURDATE()) AND YEAR(payment_date) = YEAR(CURDATE())",
    );

    res.json({
      academicYear: year,
      totalCollection: Number(totalResult[0]?.total || 0),
      todayCollection: {
        amount: Number(todayResult[0]?.total || 0),
        transactions: Number(todayResult[0]?.count || 0),
      },
      thisMonthCollection: {
        amount: Number(thisMonthResult[0]?.total || 0),
        transactions: Number(thisMonthResult[0]?.count || 0),
      },
      monthlyBreakdown: monthlyBreakdown.map((m) => ({
        month: m.month,
        total: Number(m.total || 0),
        transactions: Number(m.transactions || 0),
      })),
      classWise: classWise.map((c) => ({
        classname: c.classname,
        total: Number(c.total || 0),
        students: Number(c.students || 0),
      })),
      paymentModes: paymentModes.map((p) => ({
        mode: p.payment_mode,
        total: Number(p.total || 0),
        count: Number(p.count || 0),
      })),
      feeTypes: feeTypes[0]
        ? {
            monthly: Number(feeTypes[0].monthly || 0),
            bus: Number(feeTypes[0].bus || 0),
            exam: Number(feeTypes[0].exam || 0),
            admission: Number(feeTypes[0].admission || 0),
            dress: Number(feeTypes[0].dress || 0),
            book: Number(feeTypes[0].book || 0),
            other: Number(feeTypes[0].other || 0),
            fine: Number(feeTypes[0].fine || 0),
            totalDiscount: Number(feeTypes[0].discount || 0),
          }
        : {},
    });
  } catch (err) {
    console.error("Error fetching fee analytics:", err);
    res.status(500).json({ message: err.message });
  }
};

// --- GET DEFAULTERS LIST ---
exports.getDefaultersList = async (req, res) => {
  try {
    const { classname, min_pending } = req.query;

    // Get students (limited to active students only)
    let studentQuery = "SELECT admission_no, student_name, classname, roll_no, father_name, contact, admission_date, created_at, uses_bus FROM students WHERE 1=1";
    const params = [];

    if (classname) {
      studentQuery += " AND classname = ?";
      params.push(classname);
    }

    studentQuery += " LIMIT 500";

    const [students] = await db.execute(studentQuery, params);

    // Get fee structure (only required fields)
    const [feeStructures] = await db.execute("SELECT classname, monthly_fee, bus_fee, exam_fee, annual_fee, dress_fee, book_fee FROM fee_structure");
    const structureMap = {};
    feeStructures.forEach((f) => {
      structureMap[f.classname] = f;
    });

    // Get payments only for these students (optimized with IN clause)
    const admissionNos = students.map(s => s.admission_no);
    let allPayments = [];
    
    if (admissionNos.length > 0) {
      const placeholders = admissionNos.map(() => '?').join(',');
      const [payments] = await db.execute(
        `SELECT admission_no, monthly_fees, bus_fee, annual_fee, exam_fees, dress_fee, book_fee, payment_date FROM fee_collections WHERE admission_no IN (${placeholders})`,
        admissionNos
      );
      allPayments = payments;
    }

    // Calculate pending for each student
    const defaulters = [];

    for (const student of students) {
      const structure = structureMap[student.classname] || {};
      const studentPayments = allPayments.filter(
        (p) => String(p.admission_no) === String(student.admission_no),
      );

      // Calculate expected months
      const admissionDate = student.admission_date || student.created_at;
      let expectedMonths = 0;

      if (admissionDate) {
        const admDate = new Date(admissionDate);
        const now = new Date();
        const monthsDiff =
          (now.getFullYear() - admDate.getFullYear()) * 12 +
          (now.getMonth() - admDate.getMonth()) +
          1;
        expectedMonths = Math.max(0, monthsDiff);
      }

      const expectedMonthly = expectedMonths * (structure.monthly_fee || 0);
      const expectedBus = student.uses_bus
        ? expectedMonths * (structure.bus_fee || 0)
        : 0;

      const monthlyPaid = studentPayments.reduce(
        (sum, p) => sum + Number(p.monthly_fees || 0),
        0,
      );
      const busPaid = studentPayments.reduce(
        (sum, p) => sum + Number(p.bus_fee || 0),
        0,
      );

      const monthlyPending = Math.max(0, expectedMonthly - monthlyPaid);
      const busPending = Math.max(0, expectedBus - busPaid);

      // One-time fees
      const admissionPending = studentPayments.some(
        (p) => Number(p.annual_fee) > 0,
      )
        ? 0
        : structure.annual_fee || 0;
      const examPending = studentPayments.some((p) => Number(p.exam_fees) > 0)
        ? 0
        : structure.exam_fee || 0;
      const dressPending = studentPayments.some((p) => Number(p.dress_fee) > 0)
        ? 0
        : structure.dress_fee || 0;
      const bookPending = studentPayments.some((p) => Number(p.book_fee) > 0)
        ? 0
        : structure.book_fee || 0;

      const totalPending =
        monthlyPending +
        busPending +
        admissionPending +
        examPending +
        dressPending +
        bookPending;

      if (totalPending > (Number(min_pending) || 0)) {
        defaulters.push({
          admission_no: student.admission_no,
          student_name: student.student_name,
          classname: student.classname,
          roll_no: student.roll_no,
          father_name: student.father_name,
          contact: student.contact,
          monthlyPending,
          busPending,
          admissionPending,
          examPending,
          dressPending,
          bookPending,
          totalPending,
          lastPaymentDate:
            studentPayments.length > 0 ? studentPayments[0].payment_date : null,
        });
      }
    }

    // Sort by total pending descending
    defaulters.sort((a, b) => b.totalPending - a.totalPending);

    res.json(defaulters);
  } catch (err) {
    console.error("Error fetching defaulters:", err);
    res.status(500).json({ message: err.message });
  }
};

// --- DELETE FEE RECORD ---
exports.deleteFeeRecord = async (req, res) => {
  try {
    const { id } = req.params;

    // Get record details before deletion for audit
    const [record] = await db.execute(
      "SELECT * FROM fee_collections WHERE id = ?",
      [id],
    );

    if (record.length === 0) {
      return res.status(404).json({ message: "Record not found" });
    }

    await db.execute("DELETE FROM fee_collections WHERE id = ?", [id]);

    console.log(
      `Fee record deleted: ID=${id}, Receipt=${record[0].receipt_no}`,
    );
    res.json({ message: "Fee record deleted successfully" });
  } catch (err) {
    console.error("Error deleting fee record:", err);
    res.status(500).json({ message: err.message });
  }
};


// Get All Fee Dues
exports.getAllFeeDues = async (req, res) => {
  try {
    const sql = `SELECT admission_no, due_amount FROM fee_dues WHERE due_amount != 0`;
    const [rows] = await db.execute(sql);
    
    // Return as object map for easy lookup
    const duesMap = {};
    rows.forEach(row => {
      duesMap[row.admission_no] = Number(row.due_amount || 0);
    });
    
    return res.json(duesMap);
  } catch (error) {
    console.error("Error fetching all fee dues:", error);
    return res.status(500).json({ message: error.message });
  }
};


// Student Fee Due By Admission No

exports.getFeeDueByAdmissionNo = async (req, res) => {
  
  try {
    const { admissionNo } = req.params;

    if (!admissionNo) {
      return res.status(400).json({ message: "Admission No is required" });
    }

    // CORE MYSQL QUERY
    const sql = `
      SELECT admission_no, due_amount
      FROM fee_dues
      WHERE admission_no = ?      
      LIMIT 1
    `;

    const [rows] = await db.execute(sql, [admissionNo]);

    if (!rows || rows.length === 0) {
      return res.json({
        admission_no: admissionNo,
        due_amount: 0,
      });
    }

    return res.json({
      admission_no: rows[0].admission_no,
      due_amount: Number(rows[0].due_amount || 0),
    });
  } catch (error) {
    console.error("Error fetching fee due:", error);
    return res.status(500).json({ message: error });
  }
};

// Get All Student Advances
exports.getAllStudentAdvances = async (req, res) => {
  try {
    const sql = `
      SELECT admission_no, advance_amount
      FROM fee_advances
      WHERE advance_amount > 0
      ORDER BY admission_no
    `;

    const [rows] = await db.execute(sql);
    
    const advancesMap = {};
    rows.forEach(row => {
      advancesMap[row.admission_no] = Number(row.advance_amount || 0);
    });
    
    return res.json(advancesMap);
  } catch (error) {
    console.error("Error fetching all student advances:", error);
    return res.status(500).json({ message: error.message });
  }
};

// Get Student Advance By Admission No
exports.getStudentAdvance = async (req, res) => {
  try {
    const { admissionNo } = req.params;

    if (!admissionNo) {
      return res.status(400).json({ message: "Admission No is required" });
    }

    const sql = `
      SELECT admission_no, advance_amount
      FROM fee_advances
      WHERE admission_no = ?
      LIMIT 1
    `;

    const [rows] = await db.execute(sql, [admissionNo]);

    if (!rows || rows.length === 0) {
      return res.json({
        admission_no: admissionNo,
        advance_amount: 0,
      });
    }

    return res.json({
      admission_no: rows[0].admission_no,
      advance_amount: Number(rows[0].advance_amount || 0),
    });
  } catch (error) {
    console.error("Error fetching student advance:", error);
    return res.status(500).json({ message: error.message });
  }
};