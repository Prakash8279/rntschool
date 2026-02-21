import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import { getFeeHistory } from "@/store/slices/feeSlice"; // Fetch fees from API
import { listStudents } from "@/store/slices/studentSlice"; // Fetch student profile
import { fetchFeeStructure } from "@/store/slices/feeStructureSlice"; // Fetch fee structure
import { fetchFeeDueByAdmissionNo } from "@/store/slices/feeDuesSlice"; // Previous dues
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DollarSign, FileText, CheckCircle2, AlertCircle, Download, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  getStudentFeeStatus,
  type FeeStructure,
  type StudentFeeStatus
} from "@/lib/feeManagement";
import jsPDF from "jspdf";
import schoolLogo from "@/assets/school-logo.png";
import { toast } from "sonner";

const SCHOOL_NAME = "R.N.T. PUBLIC SCHOOL";
const SCHOOL_TAGLINE = "Jankinagar Basantpur, Siwan (Bihar)";

const MyFees = () => {
  const dispatch = useDispatch<AppDispatch>();
  
  // Get Data from Redux Store
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const { students } = useSelector((state: RootState) => state.student);
  const { history: allPayments, loading } = useSelector((state: RootState) => state.fees);
  const { structure: feeStructureList } = useSelector((state: RootState) => state.feeStructure);

  const [feeStatus, setFeeStatus] = useState<StudentFeeStatus | null>(null);
  const [myPayments, setMyPayments] = useState<any[]>([]);
  const { dueAmount: previousDues } = useSelector((state: RootState) => state.feeDues);

  // Helper: Derive fee type(s) from the payment record's non-zero fee fields
  const getFeeTypes = (payment: any): string => {
    const types: string[] = [];
    if (Number(payment.monthly_fees) > 0) types.push("Monthly Fee");
    if (Number(payment.exam_fees) > 0) types.push("Exam Fee");
    if (Number(payment.admission_fees) > 0) types.push("Admission Fee");
    if (Number(payment.bus_fee) > 0) types.push("Bus Fee");
    if (Number(payment.dress_fee) > 0) types.push("Dress Fee");
    if (Number(payment.book_fee) > 0) types.push("Book Fee");
    if (Number(payment.other_fee) > 0) types.push("Other Fee");
    if (Number(payment.fine) > 0) types.push("Fine");
    if (Number(payment.late_fee) > 0) types.push("Late Fee");
    return types.length > 0 ? types.join(", ") : "Fee Payment";
  };

  // 1. Fetch Data on Mount
  useEffect(() => {
    dispatch(listStudents());
    dispatch(getFeeHistory());
    dispatch(fetchFeeStructure());
    // Fetch previous dues for this student
    if (userInfo?.admission_no) {
      dispatch(fetchFeeDueByAdmissionNo(userInfo.admission_no));
    }
  }, [dispatch, userInfo?.admission_no]);

  // 2. Calculate Status when Data Available
  useEffect(() => {
    if (userInfo && students.length > 0 && feeStructureList.length > 0) {
      // Find the logged-in student's profile details using email or ID
      // Note: userInfo._id from auth might match student._id if linked, 
      // but checking email is often safer if IDs differ between Auth/Student tables
      const currentStudent = students.find(s => s.email === userInfo.email) || 
                             students.find(s => s._id === userInfo._id);

      if (currentStudent) {
        // Calculate status using the helper and REAL backend payments
        const status = getStudentFeeStatus(
          currentStudent._id || "",
          currentStudent.student_name,
          currentStudent.admission_no,
          currentStudent.classname,
          currentStudent.roll_no || "N/A",
          allPayments, // Pass the full history, helper filters it
          feeStructureList, // Pass fee structure list
          currentStudent.admission_date || currentStudent.created_at, // Use admission_date, fallback to created_at
          currentStudent.usesBus || false,
          currentStudent.bus_start_date,
          currentStudent.bus_end_date
        );
        setFeeStatus(status);

        // Filter payments for just this student for the table
        // Check both admissionNo (primary) and studentId (backward compatibility)
        console.log('[MyFees] Current student admission_no:', currentStudent.admission_no);
        console.log('[MyFees] Total payments available:', allPayments.length);
        
        const studentPayments = allPayments.filter(p => {
          const matchesAdmissionNo = String(p.admissionNo) === String(currentStudent.admission_no);
          const matchesStudentId = p.studentId && (
            String(p.studentId) === String(currentStudent._id) || 
            String(p.studentId) === String(currentStudent.admission_no)
          );
          return matchesAdmissionNo || matchesStudentId;
        });
        
        console.log('[MyFees] Filtered student payments:', studentPayments.length);
        
        // Sort by date (newest first)
        setMyPayments(studentPayments.sort((a, b) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        ));
      }
    }
  }, [userInfo, students, allPayments, feeStructureList]);

  // Generate Fee Receipt PDF for a single payment (same format as admin)
  const generateReceiptPDF = async (payment: any) => {
    const pdf = new jsPDF();
    const pageWidth = 210;
    const pageHeight = 297;
    const margin = 15;
    const contentWidth = pageWidth - (margin * 2);

    const drawLine = (y: number) => {
      pdf.setDrawColor(200, 200, 200);
      pdf.setLineWidth(0.1);
      pdf.line(margin, y, pageWidth - margin, y);
    };

    let yPos = 20;

    // School Logo
    try {
      const img = new Image();
      img.src = schoolLogo;
      await new Promise<void>((resolve) => {
        img.onload = () => resolve();
        img.onerror = () => resolve();
      });
      if (img.complete && img.naturalHeight !== 0) {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0);
        const logoData = canvas.toDataURL("image/png");
        pdf.addImage(logoData, 'PNG', margin, 10, 25, 25);
      }
    } catch (e) { }

    // School Header
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(22);
    pdf.setTextColor(41, 58, 128);
    pdf.text(SCHOOL_NAME, pageWidth / 2, 20, { align: "center" });

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);
    pdf.setTextColor(100, 100, 100);
    pdf.text(SCHOOL_TAGLINE, pageWidth / 2, 26, { align: "center" });
    pdf.text("Phone: +91-7061337068 | Email: rntpublics@gmail.com", pageWidth / 2, 31, { align: "center" });

    // Title Bar
    yPos = 40;
    pdf.setFillColor(41, 58, 128);
    pdf.rect(0, yPos, pageWidth, 12, 'F');
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(14);
    pdf.setTextColor(255, 255, 255);
    pdf.text("OFFICIAL FEE RECEIPT", pageWidth / 2, yPos + 8, { align: "center" });

    // Receipt No & Date
    yPos += 20;
    pdf.setFillColor(245, 245, 245);
    pdf.setDrawColor(220, 220, 220);
    pdf.rect(margin, yPos, contentWidth, 10, 'FD');

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(10);
    pdf.setTextColor(0, 0, 0);
    const receiptNo = payment.receiptNo || `RNT-${payment._id || Date.now()}`;
    pdf.text(`Receipt No: ${receiptNo}`, margin + 5, yPos + 6.5);
    pdf.text(`Date: ${new Date(payment.date).toLocaleDateString('en-IN')}`, pageWidth - margin - 5, yPos + 6.5, { align: "right" });

    // Student Details Section
    yPos += 18;
    pdf.setFontSize(11);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(41, 58, 128);
    pdf.text("STUDENT DETAILS", margin, yPos);
    drawLine(yPos + 2);
    yPos += 8;

    const col1X = margin;
    const col2X = pageWidth / 2 + 10;

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(10);
    pdf.setTextColor(80, 80, 80);
    pdf.text("Name:", col1X, yPos);
    pdf.text("Admission No:", col2X, yPos);

    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(0, 0, 0);
    pdf.text(String(userInfo?.name || userInfo?.student_name || ""), col1X + 25, yPos);
    pdf.text(String(userInfo?.admission_no || ""), col2X + 30, yPos);

    yPos += 8;

    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(80, 80, 80);
    pdf.text("Class:", col1X, yPos);
    pdf.text("Roll No:", col2X, yPos);

    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(0, 0, 0);
    pdf.text(String(userInfo?.classname || ""), col1X + 25, yPos);
    pdf.text(String(userInfo?.roll_no || "N/A"), col2X + 30, yPos);

    // Payment Breakdown Section
    yPos += 15;
    pdf.setFontSize(11);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(41, 58, 128);
    pdf.text("PAYMENT BREAKDOWN", margin, yPos);
    yPos += 4;

    pdf.setFillColor(230, 230, 230);
    pdf.rect(margin, yPos, contentWidth, 8, 'F');

    pdf.setFontSize(9);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(0, 0, 0);
    pdf.text("Description", margin + 5, yPos + 5.5);
    pdf.text("Period", margin + 80, yPos + 5.5);
    pdf.text("Amount", pageWidth - margin - 5, yPos + 5.5, { align: "right" });
    yPos += 9;

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(9);
    pdf.setTextColor(0, 0, 0);

    let grandTotal = 0;
    const period = `${payment.month} ${payment.year}`;

    const feeLines: { label: string; amount: number; period: string }[] = [];

    const monthlyFee = Number(payment.monthly_fees || 0);
    const busFee = Number(payment.bus_fee || 0);
    const examFee = Number(payment.exam_fees || 0);
    const admissionFee = Number(payment.admission_fees || 0);
    const otherFee = Number(payment.other_fee || 0);
    const dressFee = Number(payment.dress_fee || 0);
    const bookFee = Number(payment.book_fee || 0);
    const fineFee = Number(payment.fine || 0);
    const lateFee = Number(payment.late_fee || 0);
    const discount = Number(payment.discount || 0);

    if (monthlyFee > 0 && busFee > 0) {
      feeLines.push({ label: "Monthly + Bus Fee", amount: monthlyFee + busFee, period });
    } else {
      if (monthlyFee > 0) feeLines.push({ label: "Monthly Fee", amount: monthlyFee, period });
      if (busFee > 0) feeLines.push({ label: "Bus Fee", amount: busFee, period });
    }
    if (examFee > 0) feeLines.push({ label: "Exam Fee", amount: examFee, period: "Once" });
    if (admissionFee > 0) feeLines.push({ label: "Admission Fee", amount: admissionFee, period: "Once" });
    if (dressFee > 0) feeLines.push({ label: "Dress Fee", amount: dressFee, period: "Once" });
    if (bookFee > 0) feeLines.push({ label: "Book Fee", amount: bookFee, period: "Once" });
    if (otherFee > 0) feeLines.push({ label: "Other Fee", amount: otherFee, period: "Once" });
    if (fineFee > 0) feeLines.push({ label: "Fine", amount: fineFee, period: "Once" });
    if (lateFee > 0) feeLines.push({ label: "Late Fee", amount: lateFee, period: "Once" });

    feeLines.forEach((line) => {
      pdf.text(line.label, margin + 5, yPos + 4);
      pdf.text(line.period, margin + 80, yPos + 4);
      pdf.text(`Rs. ${line.amount}`, pageWidth - margin - 5, yPos + 4, { align: "right" });
      grandTotal += line.amount;
      yPos += 7;
    });

    // Divider
    yPos += 3;
    pdf.setDrawColor(41, 58, 128);
    pdf.setLineWidth(1);
    pdf.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 7;

    // Subtotal
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(10);
    pdf.setTextColor(0, 0, 0);
    pdf.text("Subtotal:", margin + 5, yPos);
    pdf.text(`Rs. ${grandTotal.toLocaleString()}`, pageWidth - margin - 5, yPos, { align: "right" });
    yPos += 7;

    // Discount
    if (discount > 0) {
      pdf.setTextColor(200, 0, 0);
      pdf.text("Discount:", margin + 5, yPos);
      pdf.text(`- Rs. ${discount.toLocaleString()}`, pageWidth - margin - 5, yPos, { align: "right" });
      yPos += 7;
    }

    // Total
    pdf.setDrawColor(41, 58, 128);
    pdf.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 7;

    const totalPaid = Number(payment.totalAmount || (grandTotal - discount));
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(0, 0, 0);
    pdf.text("TOTAL AMOUNT PAID:", margin + 5, yPos);
    pdf.setFontSize(14);
    pdf.setTextColor(41, 58, 128);
    pdf.text(`Rs. ${totalPaid.toLocaleString()}`, pageWidth - margin - 5, yPos, { align: "right" });

    // Payment Mode
    if (payment.paymentMode) {
      yPos += 10;
      pdf.setFontSize(10);
      pdf.setTextColor(80, 80, 80);
      pdf.setFont("helvetica", "normal");
      pdf.text(`Payment Mode: ${payment.paymentMode}`, margin + 5, yPos);
    }

    // Footer - Signatures
    const footerY = pageHeight - 40;
    pdf.setDrawColor(200, 200, 200);
    pdf.setLineWidth(0.1);
    pdf.line(margin, footerY, pageWidth - margin, footerY);

    pdf.setFontSize(9);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(0, 0, 0);
    pdf.text("Accountant Signature", margin, footerY + 15);
    pdf.text("Parent/Guardian Signature", pageWidth - margin, footerY + 15, { align: "right" });

    pdf.setFontSize(8);
    pdf.setFont("helvetica", "italic");
    pdf.setTextColor(100, 100, 100);
    pdf.text("Thank you for the timely payment. This is a computer-generated receipt.", pageWidth / 2, pageHeight - 10, { align: "center" });

    pdf.save(`Fee_Receipt_${receiptNo}.pdf`);
    toast.success("Receipt downloaded!");
  };

  if (!feeStatus || loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground">Loading fee information...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // totalDue from feeManagement is the REMAINING unpaid amount for current session.
  // previousDues from fee_dues DB: positive = dues, negative = advance (overpayment/credit).
  const dbAdvance = previousDues < 0 ? Math.abs(previousDues) : 0; // Advance from DB
  const dbDues = previousDues > 0 ? previousDues : 0; // Previous dues from DB
  const calculatedAdvance = feeStatus.advanceAmount || 0; // Advance from fee calculation
  const totalAdvance = Math.max(dbAdvance, calculatedAdvance); // Use whichever is higher (avoid double-counting)

  // Balance = current session dues + previous session dues - advance credit
  const balance = Math.max(0, feeStatus.totalDue + dbDues - totalAdvance);
  const totalExpected = feeStatus.totalPaid + feeStatus.totalDue + dbDues; // Total billed (excluding advance)
  const status = totalAdvance > 0 && balance <= 0 ? "Advance" : balance <= 0 ? "Paid" : feeStatus.totalPaid === 0 ? "Pending" : "Partial";

  // Build other (non-monthly) pending fees list
  const otherDues: { label: string; amount: number }[] = [];
  if (feeStatus.examFeeDues > 0) otherDues.push({ label: "Exam Fee", amount: feeStatus.examFeeDues });
  if (feeStatus.admissionFeeDues > 0) otherDues.push({ label: "Admission Fee", amount: feeStatus.admissionFeeDues });
  if (feeStatus.dressFeeDues > 0) otherDues.push({ label: "Dress Fee", amount: feeStatus.dressFeeDues });
  if (feeStatus.bookFeeDues > 0) otherDues.push({ label: "Book Fee", amount: feeStatus.bookFeeDues });
  if (feeStatus.otherFeeDues > 0) otherDues.push({ label: "Other Fee", amount: feeStatus.otherFeeDues });
  if (feeStatus.fineDues > 0) otherDues.push({ label: "Fine", amount: feeStatus.fineDues });
  if (dbDues > 0) otherDues.push({ label: "Previous Session Dues", amount: dbDues });

  // Refresh handler for manual data reload
  const handleRefresh = () => {
    dispatch(getFeeHistory());
    dispatch(fetchFeeStructure());
    if (userInfo?.admission_no) {
      dispatch(fetchFeeDueByAdmissionNo(userInfo.admission_no));
    }
    toast.success("Refreshing fee data...");
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">My Fee Status</h1>
          <p className="text-muted-foreground mt-1">View your fee payment history and status</p>
        </div>
        <Button variant="outline" size="sm" onClick={handleRefresh} disabled={loading}>
          <Clock className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-700 flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Monthly Fee
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">₹{feeStatus.monthlyFee}</div>
            <p className="text-xs text-blue-700 mt-1">Per Month</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-700 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Total Paid
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">₹{feeStatus.totalPaid}</div>
            <p className="text-xs text-green-700 mt-1">Out of ₹{totalExpected}</p>
          </CardContent>
        </Card>

        <Card className={`bg-gradient-to-br ${balance > 0 ? 'from-red-50 to-red-100 border-red-200' : 'from-purple-50 to-purple-100 border-purple-200'}`}>
          <CardHeader className="pb-2">
            <CardTitle className={`text-sm font-medium flex items-center gap-2 ${balance > 0 ? 'text-red-700' : 'text-purple-700'}`}>
              {balance > 0 ? <AlertCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
              Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${balance > 0 ? 'text-red-900' : 'text-purple-900'}`}>
              ₹{balance}
            </div>
            <p className={`text-xs mt-1 ${balance > 0 ? 'text-red-700' : 'text-purple-700'}`}>
              {balance > 0 ? "Pending" : "All Paid"}
            </p>
          </CardContent>
        </Card>

        <Card className={`bg-gradient-to-br ${totalAdvance > 0 ? 'from-emerald-50 to-emerald-100 border-emerald-200' : 'from-orange-50 to-orange-100 border-orange-200'}`}>
          <CardHeader className="pb-2">
            <CardTitle className={`text-sm font-medium flex items-center gap-2 ${totalAdvance > 0 ? 'text-emerald-700' : 'text-orange-700'}`}>
              <FileText className="w-4 h-4" />
              {totalAdvance > 0 ? 'Advance' : 'Status'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {totalAdvance > 0 ? (
              <>
                <div className="text-2xl font-bold text-emerald-900">₹{totalAdvance}</div>
                <p className="text-xs text-emerald-700 mt-1">Advance payment credit</p>
              </>
            ) : (
              <>
                <Badge
                  variant={status === "Paid" ? "default" : status === "Partial" ? "secondary" : "destructive"}
                  className="text-lg px-4 py-2"
                >
                  {status}
                </Badge>
                <p className="text-xs text-orange-700 mt-2">
                  {feeStatus.pendingMonths.length} months pending
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Pending Months (Monthly Fee only) */}
      {feeStatus.pendingMonths.length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="text-orange-800 flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Pending Monthly Fee
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {feeStatus.pendingMonths.map((month: string, index: number) => (
                <Badge key={index} variant="outline" className="bg-white text-orange-800 border-orange-300">
                  {month}
                </Badge>
              ))}
            </div>
            <p className="text-xs text-orange-700 mt-3">
              Monthly due: ₹{feeStatus.pendingAmount}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Advance Payment Banner */}
      {totalAdvance > 0 && (
        <Card className="border-emerald-200 bg-emerald-50">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span className="text-lg font-bold text-emerald-800">ADVANCE PAYMENT</span>
              </div>
              <span className="text-2xl font-bold text-emerald-600">₹{totalAdvance.toLocaleString()}</span>
            </div>
            <p className="text-sm text-emerald-700 mt-1">Excess amount paid — will be adjusted against future fees</p>
          </CardContent>
        </Card>
      )}

      {/* Other Pending Fees (non-monthly) */}
      {otherDues.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-800 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Other Pending Fees
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {otherDues.map((due, index) => (
                <div key={index} className="flex justify-between items-center">
                  <Badge variant="outline" className="bg-white text-red-800 border-red-300">
                    {due.label}
                  </Badge>
                  <span className="font-bold text-red-800">₹{due.amount}</span>
                </div>
              ))}
              <div className="border-t border-red-200 pt-2 mt-2 flex justify-between items-center">
                <span className="text-sm font-medium text-red-800">Total Other Dues</span>
                <span className="font-bold text-red-900">₹{otherDues.reduce((sum, d) => sum + d.amount, 0)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Payment History */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Payment History
            </CardTitle>

          </div>
        </CardHeader>
        <CardContent>
          {myPayments.length === 0 ? (
            <div className="text-center py-12">
              <AlertCircle className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No payment records found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    {/* Note: Backend doesn't send receiptNo yet, relying on _id or date */}
                    <TableHead>Date</TableHead>
                    <TableHead>Fee Type</TableHead>
                    <TableHead>Month/Year</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Bus Fee</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Receipt</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {myPayments.map((payment) => (
                    <TableRow key={payment._id}>
                      <TableCell>
                        {new Date(payment.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{getFeeTypes(payment)}</Badge>
                      </TableCell>
                      <TableCell>{payment.month} {payment.year}</TableCell>
                      <TableCell className="font-bold text-green-600">₹{payment.totalAmount}</TableCell>
                      <TableCell>
                        {/* Note: Check if backend sends usesBus/bus_fee in payment record, 
                            if not available, show '-' */}
                        {payment.bus_fee ? (
                          <span className="text-blue-600 font-medium">₹{payment.bus_fee}</span>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="default">Paid</Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" onClick={() => generateReceiptPDF(payment)}>
                          <Download className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MyFees;