// Exam Schedule & Admit Card Management

const API_URL = 'http://localhost:5000/api';

export interface ExamSubject {
  subject: string;
  date: string;
  time: string;
  duration: string;
}

export interface ExamSchedule {
  examName: string;
  examDate: string;
  classname: string; // Class for which this exam schedule is configured
  subjects: ExamSubject[];
  allowStudentDownload: boolean; // Admin can enable/disable student access
}

export interface AdmitCardAccess {
  studentId: string;
  allowed: boolean;
  allowedDate?: string;
}

// Get Exam Schedule from API
export const getExamSchedule = async (classname?: string): Promise<ExamSchedule | null> => {
  try {
    const token = localStorage.getItem('token');
    const url = classname 
      ? `${API_URL}/exams/schedule?classname=${encodeURIComponent(classname)}`
      : `${API_URL}/exams/schedule`;
      
    console.log('[getExamSchedule] Fetching from:', url);
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error('Failed to fetch exam schedule');
    }
    
    const data = await response.json();
    console.log('[getExamSchedule] Received data:', data);
    
    const schedule = Array.isArray(data) ? (data.length > 0 ? data[0] : null) : data;
    console.log('[getExamSchedule] Final schedule:', schedule);
    console.log('[getExamSchedule] Subjects count:', schedule?.subjects?.length || 0);
    
    return schedule;
  } catch (error) {
    console.error("Error loading exam schedule:", error);
    return null;
  }
};

// Save Exam Schedule to API
export const saveExamSchedule = async (schedule: ExamSchedule): Promise<boolean> => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/exams/schedule`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(schedule)
    });
    
    if (!response.ok) {
      throw new Error('Failed to save exam schedule');
    }
    
    return true;
  } catch (error) {
    console.error("Error saving exam schedule:", error);
    return false;
  }
};

// Get Admit Card Access Status
export const getAdmitCardAccess = async (studentId: string): Promise<boolean> => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/exams/admit-card-access`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) return false;
    
    const accessList = await response.json();
    const access = accessList.find((a: AdmitCardAccess) => a.studentId === studentId);
    return access ? access.allowed : false;
  } catch (error) {
    console.error("Error loading admit card access:", error);
    return false;
  }
};

// Set Admit Card Access for Student (API Version)
export const setAdmitCardAccess = async (studentId: string, allowed: boolean): Promise<boolean> => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/exams/access`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ studentId, allowed })
    });
    
    if (!response.ok) {
      throw new Error('Failed to update admit card access');
    }
    
    return true;
  } catch (error) {
    console.error("Error saving admit card access:", error);
    return false;
  }
};

// Allow All Students (API Version)
export const allowAllStudents = async (studentIds: string[]): Promise<boolean> => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/exams/access/all`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ studentIds })
    });
    
    if (!response.ok) {
      throw new Error('Failed to allow all students');
    }
    
    return true;
  } catch (error) {
    console.error("Error allowing all students:", error);
    return false;
  }
};

// Get All Access Status from API
export const getAllAdmitCardAccess = async (): Promise<AdmitCardAccess[]> => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/exams/access`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      return [];
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error loading all admit card access:", error);
    return [];
  }
};














