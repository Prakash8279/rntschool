const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = null;
    let role = '';

    // 1. Check Admin/System Users Table
    const [admins] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    if (admins.length > 0) {
      user = admins[0];
      role = user.role;
    }

    // 2. If not found, check Teachers Table
    if (!user) {
      const [teachers] = await db.execute('SELECT * FROM teachers WHERE email = ?', [email]);
      if (teachers.length > 0) {
        user = teachers[0];
        role = 'teacher';
        user.name = user.teacher_name; // Normalize name field
      }
    }

    // 3. If not found, check Students Table
    if (!user) {
      const [students] = await db.execute('SELECT * FROM students WHERE email = ?', [email]);
      if (students.length > 0) {
        user = students[0];
        role = 'student';
        user.name = user.student_name; // Normalize name field
      }
    }

    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    // 4. Verify Password
    // Note: For students/teachers with no password set, we accept "123456" as default (Matches your mock)
    // In production, you would ALWAYS use bcrypt.compare
    const isDefaultPass = password === "123456";
    let isMatch = false;

    if (user.password_hash) {
      isMatch = await bcrypt.compare(password, user.password_hash);
    } else {
      // Allow default login if no custom password set yet
      isMatch = isDefaultPass;
    }

    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    // 5. Generate Token
    const token = jwt.sign({ id: user.id, role: role }, process.env.JWT_SECRET, { expiresIn: '1d' });

    // Build response object
    const response = {
      _id: user.id.toString(),
      name: user.name,
      email: user.email,
      role: role,
      token: token,
      image: user.image_url || user.image
    };

    // Add student-specific fields if user is a student
    if (role === 'student') {
      response.admission_no = user.admission_no;
      response.student_name = user.student_name;
      response.classname = user.classname;
      response.roll_no = user.roll_no;
      response.father_name = user.father_name;
    }

    // Add teacher-specific fields if user is a teacher
    if (role === 'teacher') {
      response.teacher_name = user.teacher_name;
      response.subject = user.subject;
    }

    res.json(response);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Only for creating the initial Admin
exports.registerAdmin = async (req, res) => {
  const { name, email, password, role } = req.body;
  const hash = await bcrypt.hash(password, 10);
  try {
    await db.execute('INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
      [name, email, hash, role]);
    res.json({ message: 'Admin registered' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Self password change - old password verify karke naya set karo
exports.changeOwnPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const { id, role } = req.user; // from JWT middleware

  if (!oldPassword || !newPassword) {
    return res.status(400).json({ message: 'Old aur new password required hain' });
  }
  if (newPassword.length < 6) {
    return res.status(400).json({ message: 'New password kam se kam 6 characters ka hona chahiye' });
  }

  try {
    let user = null;
    let table = '';

    if (role === 'student') {
      const [rows] = await db.execute('SELECT * FROM students WHERE id = ?', [id]);
      user = rows[0]; table = 'students';
    } else if (role === 'teacher') {
      const [rows] = await db.execute('SELECT * FROM teachers WHERE id = ?', [id]);
      user = rows[0]; table = 'teachers';
    } else {
      // admin / finance / studentManager
      const [rows] = await db.execute('SELECT * FROM users WHERE id = ?', [id]);
      user = rows[0]; table = 'users';
    }

    if (!user) return res.status(404).json({ message: 'User not found' });

    // Old password verify
    let isMatch = false;
    if (user.password_hash) {
      isMatch = await bcrypt.compare(oldPassword, user.password_hash);
    } else {
      // Default password for users who never changed it
      isMatch = oldPassword === '123456';
    }

    if (!isMatch) {
      return res.status(401).json({ message: 'Purana password galat hai' });
    }

    const newHash = await bcrypt.hash(newPassword, 10);
    await db.execute(`UPDATE ${table} SET password_hash = ? WHERE id = ?`, [newHash, id]);

    res.json({ message: 'Password successfully change ho gaya!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};