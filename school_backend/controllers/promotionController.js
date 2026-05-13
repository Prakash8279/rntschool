const db = require('../config/db');

const KNOWN_ORDER = [
    'Nursery', 'LKG', 'UKG',
    'One', 'Two', 'Three', 'Four', 'Five',
    'Six', 'Seven', 'Eight', 'Nine', 'Ten',
    'Eleven', 'Twelve',
    'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5',
    'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10',
    'Class 11', 'Class 12',
    '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'
];

const sortClasses = (classes) =>
    [...classes].sort((a, b) => {
        const ai = KNOWN_ORDER.indexOf(a), bi = KNOWN_ORDER.indexOf(b);
        if (ai === -1 && bi === -1) return a.localeCompare(b);
        if (ai === -1) return 1;
        if (bi === -1) return -1;
        return ai - bi;
    });

const getNextClass = (current, allClasses) => {
    const sorted = sortClasses(allClasses);
    const idx = sorted.indexOf(current);
    if (idx === -1 || idx === sorted.length - 1) return null;
    return sorted[idx + 1];
};

const getAcademicYear = () => {
    const today = new Date();
    const month = today.getMonth();
    const year = month < 3 ? today.getFullYear() - 1 : today.getFullYear();
    return `${year}-${year + 1}`;
};

// Calculate full dues breakdown for one student
const calcStudentDues = (student, payments, structure) => {
    const admDate = new Date(student.admission_date || student.created_at || new Date());
    const now = new Date();
    const expectedMonths = Math.max(
        0,
        (now.getFullYear() - admDate.getFullYear()) * 12 +
        (now.getMonth() - admDate.getMonth()) + 1
    );

    const monthlyRate = Number(structure.monthly_fee || 0);
    const busRate = Number(structure.bus_fee || 0);
    const examRate = Number(structure.exam_fee || 0);
    const admissionRate = Number(structure.admission_fee || structure.annual_fee || 0);
    const dressRate = Number(structure.dress_fee || 0);
    const bookRate = Number(structure.book_fee || 0);

    const monthlyPaid = payments.reduce((s, p) => s + Number(p.monthly_fees || 0), 0);
    const busPaid = payments.reduce((s, p) => s + Number(p.bus_fee || 0), 0);
    const finePaid = payments.reduce((s, p) => s + Number(p.fine || 0), 0);

    const admissionPaid = payments.some(p => Number(p.annual_fee) > 0);
    const examPaid = payments.some(p => Number(p.exam_fees) > 0);
    const dressPaid = payments.some(p => Number(p.dress_fee) > 0);
    const bookPaid = payments.some(p => Number(p.book_fee) > 0);

    const monthlyPending = Math.max(0, expectedMonths * monthlyRate - monthlyPaid);
    const busPending = student.uses_bus
        ? Math.max(0, expectedMonths * busRate - busPaid)
        : 0;
    const examPending = examPaid ? 0 : examRate;
    const admissionPending = admissionPaid ? 0 : admissionRate;
    const dressPending = dressPaid ? 0 : dressRate;
    const bookPending = bookPaid ? 0 : bookRate;
    const prevDues = Number(student.previous_year_dues || 0);
    const fineRate = Number(structure.fine || 0);
    const fineAlreadyPaid = payments.some(p => Number(p.fine) > 0);
    const finePending = fineAlreadyPaid ? 0 : fineRate; // Include fine to match fee management

    const otherPending = examPending + admissionPending + dressPending + bookPending + prevDues + finePending;
    const totalPending = monthlyPending + busPending + otherPending;

    return {
        monthlyPending,
        busPending,
        examPending,
        admissionPending,
        dressPending,
        bookPending,
        finePending,
        otherPending,
        totalPending,
    };
};

// --- GET ALL CLASSES ---
exports.getClassList = async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT DISTINCT classname FROM students ORDER BY classname');
        res.json(sortClasses(rows.map(r => r.classname)));
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// --- GET STUDENTS WITH FULL DUES INFO for a class ---
exports.getStudentsForPromotion = async (req, res) => {
    try {
        const { classname } = req.query;
        if (!classname) return res.status(400).json({ message: 'classname required' });

        const [students] = await db.execute(
            `SELECT id, admission_no, student_name, classname, roll_no,
              father_name, contact_no, previous_year_dues,
              uses_bus, admission_date, created_at
       FROM students WHERE classname = ? ORDER BY roll_no`,
            [classname]
        );

        const [classRows] = await db.execute('SELECT DISTINCT classname FROM students');
        const [feeStructures] = await db.execute('SELECT * FROM fee_structure');
        const structureMap = {};
        feeStructures.forEach(f => { structureMap[f.classname] = f; });

        const allClasses = classRows.map(r => r.classname);

        // Batch load all payments for these students
        const admNos = students.map(s => s.admission_no);
        let allPayments = [];
        let feeDuesMap = {};
        if (admNos.length > 0) {
            const ph = admNos.map(() => '?').join(',');
            const [prows] = await db.execute(
                `SELECT admission_no, monthly_fees, bus_fee, annual_fee,
                exam_fees, dress_fee, book_fee, fine
         FROM fee_collections WHERE admission_no IN (${ph})`,
                admNos
            );
            allPayments = prows;

            // Also fetch the true source of truth for previous dues: fee_dues
            const [drows] = await db.execute(
                `SELECT admission_no, due_amount FROM fee_dues WHERE admission_no IN (${ph})`,
                admNos
            );
            drows.forEach(d => { feeDuesMap[String(d.admission_no)] = Number(d.due_amount); });
        }

        const result = students.map(s => {
            const structure = structureMap[s.classname] || {};
            const payments = allPayments.filter(p => String(p.admission_no) === String(s.admission_no));

            // Override with global source of truth
            if (feeDuesMap[String(s.admission_no)] !== undefined) {
                s.previous_year_dues = feeDuesMap[String(s.admission_no)];
            }

            const dues = calcStudentDues(s, payments, structure);

            return {
                id: s.id,
                _id: s.id.toString(),
                admission_no: s.admission_no,
                student_name: s.student_name,
                classname: s.classname,
                roll_no: s.roll_no,
                father_name: s.father_name,
                contact_no: s.contact_no,
                previous_year_dues: feeDuesMap[String(s.admission_no)] !== undefined ? feeDuesMap[String(s.admission_no)] : Number(s.previous_year_dues || 0),
                next_class: getNextClass(s.classname, allClasses),
                // Full dues breakdown
                monthlyPending: dues.monthlyPending,
                busPending: dues.busPending,
                examPending: dues.examPending,
                admissionPending: dues.admissionPending,
                dressPending: dues.dressPending,
                bookPending: dues.bookPending,
                finePending: dues.finePending,
                otherPending: dues.otherPending,
                totalPending: dues.totalPending,
                current_dues: dues.totalPending, // keep backward compat
            };
        });

        res.json(result);
    } catch (err) {
        console.error('getStudentsForPromotion error:', err);
        res.status(500).json({ message: err.message });
    }
};

// --- PROMOTE STUDENTS ---
exports.promoteStudents = async (req, res) => {
    const { studentIds, fromClass, toClass, promotedBy, notes } = req.body;
    if (!studentIds?.length || !fromClass || !toClass) {
        return res.status(400).json({ message: 'studentIds, fromClass, toClass required' });
    }

    const academicYear = getAcademicYear();
    const promoted = [], errors = [];

    for (const studentId of studentIds) {
        try {
            const [rows] = await db.execute('SELECT * FROM students WHERE id = ?', [studentId]);
            if (!rows.length) { errors.push(`Student ${studentId} not found`); continue; }
            const student = rows[0];

            // Override with global source of truth
            const [drows] = await db.execute('SELECT due_amount FROM fee_dues WHERE admission_no = ?', [student.admission_no]);
            if (drows.length > 0) {
                student.previous_year_dues = drows[0].due_amount;
            }

            // Calculate actual dues
            const [feeRows] = await db.execute('SELECT * FROM fee_structure WHERE classname = ?', [student.classname]);
            const structure = feeRows[0] || {};
            const [payments] = await db.execute(
                'SELECT monthly_fees, bus_fee, annual_fee, exam_fees, dress_fee, book_fee, fine FROM fee_collections WHERE admission_no = ?',
                [student.admission_no]
            );
            const { totalPending } = calcStudentDues(student, payments, structure);

            const existingPrevDues = Number(student.previous_year_dues || 0);
            const newPrevDues = existingPrevDues + totalPending;

            await db.execute(
                'UPDATE students SET classname = ?, previous_year_dues = ?, promotion_year = ? WHERE id = ?',
                [toClass, newPrevDues, new Date().getFullYear(), studentId]
            );

            // Sync with fee_dues table for the global FeeManagement dashboard
            await db.execute(
                `INSERT INTO fee_dues (admission_no, due_amount) VALUES (?, ?) 
                 ON DUPLICATE KEY UPDATE due_amount = ?`,
                [student.admission_no, newPrevDues, newPrevDues]
            );

            await db.execute(
                `INSERT INTO class_promotion_history
          (admission_no, student_name, from_class, to_class, academic_year, dues_at_promotion, promoted_by, notes)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [student.admission_no, student.student_name, fromClass, toClass, academicYear, totalPending, promotedBy || 'Admin', notes || '']
            );

            promoted.push({
                admission_no: student.admission_no,
                student_name: student.student_name,
                from_class: fromClass,
                to_class: toClass,
                dues_carried: totalPending,
            });
        } catch (err) {
            errors.push(`Error for student ${studentId}: ${err.message}`);
        }
    }

    res.json({ message: `${promoted.length} students promoted`, promoted, errors });
};

// --- PROMOTION HISTORY ---
exports.getPromotionHistory = async (req, res) => {
    try {
        const { academic_year } = req.query;
        let query = 'SELECT * FROM class_promotion_history';
        const params = [];
        if (academic_year) { query += ' WHERE academic_year = ?'; params.push(academic_year); }
        query += ' ORDER BY promoted_at DESC LIMIT 500';
        const [rows] = await db.execute(query, params);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
