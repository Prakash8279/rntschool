import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AppDispatch, RootState } from "@/store";
import { listStudents } from "@/store/slices/studentSlice";
import { listTeachers } from "@/store/slices/teacherSlice";
import { getFeeHistory } from "@/store/slices/feeSlice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  GraduationCap, Users, DollarSign, UserCog, TrendingUp, 
  CreditCard, Banknote, ArrowRight, CalendarDays, Receipt,
  IndianRupee
} from "lucide-react";

const AdminDashboardHome = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  
  // Select data from Redux
  const { students } = useSelector((state: RootState) => state.student);
  const { teachers } = useSelector((state: RootState) => state.teacher);
  const { history: feeHistory } = useSelector((state: RootState) => state.fees);

  // Load data on mount so stats are accurate
  useEffect(() => {
    dispatch(listStudents());
    dispatch(listTeachers());
    dispatch(getFeeHistory());
  }, [dispatch]);

  // Calculate Stats
  const totalStudents = students.length;
  const totalTeachers = teachers.length;
  const totalRevenue = feeHistory.reduce((acc, curr) => acc + (curr.totalAmount || 0), 0);
  
  // Today's collection
  const today = new Date().toISOString().split('T')[0];
  const todayCollection = feeHistory
    .filter(tx => tx.date && new Date(tx.date).toISOString().split('T')[0] === today)
    .reduce((acc, curr) => acc + (curr.totalAmount || 0), 0);
  
  // Recent 10 transactions (sorted by date descending)
  const recentTransactions = [...feeHistory]
    .sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime())
    .slice(0, 10);

  // Helper: derive fee type labels from a transaction
  const getFeeLabels = (tx: any): string[] => {
    const labels: string[] = [];
    if (Number(tx.monthly_fees) > 0) labels.push("Monthly");
    if (Number(tx.bus_fee) > 0) labels.push("Bus");
    if (Number(tx.exam_fees) > 0) labels.push("Exam");
    if (Number(tx.admission_fees) > 0) labels.push("Admission");
    if (Number(tx.dress_fee) > 0) labels.push("Dress");
    if (Number(tx.book_fee) > 0) labels.push("Book");
    if (Number(tx.other_fee) > 0) labels.push("Other");
    if (Number(tx.fine) > 0) labels.push("Fine");
    return labels.length > 0 ? labels : ["Fee"];
  };

  // Helper: payment mode icon
  const PaymentModeIcon = ({ mode }: { mode: string }) => {
    const m = (mode || "").toLowerCase();
    if (m.includes("online") || m.includes("upi")) return <CreditCard className="w-3 h-3" />;
    return <Banknote className="w-3 h-3" />;
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Dashboard Overview</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Total Students */}
        <Card className="border-l-4 border-l-blue-500 shadow-sm cursor-pointer hover:shadow-md transition-all" onClick={() => navigate("/dashboard/students")}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Students
            </CardTitle>
            <GraduationCap className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStudents}</div>
            <p className="text-xs text-muted-foreground">Enrolled Students</p>
          </CardContent>
        </Card>

        {/* Total Teachers */}
        <Card className="border-l-4 border-l-green-500 shadow-sm cursor-pointer hover:shadow-md transition-all" onClick={() => navigate("/dashboard/teachers")}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Teachers
            </CardTitle>
            <Users className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTeachers}</div>
            <p className="text-xs text-muted-foreground">Active Faculty</p>
          </CardContent>
        </Card>

        {/* Total Revenue */}
        <Card className="border-l-4 border-l-yellow-500 shadow-sm cursor-pointer hover:shadow-md transition-all" onClick={() => navigate("/dashboard/fees")}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Fees Collected
            </CardTitle>
            <DollarSign className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Current Academic Year</p>
          </CardContent>
        </Card>

        {/* Today's Collection */}
        <Card className="border-l-4 border-l-purple-500 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Today's Collection
            </CardTitle>
            <CalendarDays className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{todayCollection.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Fee Collections — takes 2 columns */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Recent Fee Collections
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard/fees")} className="text-primary">
                View All <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {recentTransactions.length === 0 ? (
              <p className="text-muted-foreground text-sm text-center py-8">No recent transactions.</p>
            ) : (
              <div className="space-y-3">
                {recentTransactions.map((tx, idx) => (
                  <div key={idx} className="flex justify-between items-start p-3 rounded-lg border bg-white hover:bg-gray-50 transition-colors">
                    <div className="flex gap-3 items-start min-w-0">
                      {/* Student Avatar */}
                      <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-bold text-blue-600">
                          {(tx.studentName || "?")[0].toUpperCase()}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-sm text-gray-800 truncate">{tx.studentName}</p>
                        <p className="text-xs text-muted-foreground">
                          {tx.classname} • Roll {tx.roll_no} • {tx.admissionNo}
                        </p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {getFeeLabels(tx).map((label, i) => (
                            <Badge key={i} variant="outline" className="text-[10px] px-1.5 py-0 h-4">
                              {label}
                            </Badge>
                          ))}
                          {tx.month && tx.month !== "Miscellaneous" && (
                            <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4">
                              {tx.month} {tx.year}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 ml-2">
                      <p className="font-bold text-green-600 flex items-center justify-end gap-0.5">
                        <IndianRupee className="w-3.5 h-3.5" />
                        {(tx.totalAmount || 0).toLocaleString()}
                      </p>
                      <div className="flex items-center justify-end gap-1 mt-0.5">
                        <PaymentModeIcon mode={tx.paymentMode} />
                        <span className="text-[10px] text-muted-foreground capitalize">{tx.paymentMode || "Cash"}</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-0.5 flex items-center justify-end gap-0.5">
                        <Receipt className="w-2.5 h-2.5" />
                        {new Date(tx.date || Date.now()).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions Card */}
        <Card className="h-fit bg-primary/5 border-primary/10">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3">
             <div 
               className="bg-white p-4 rounded-lg shadow-sm text-center cursor-pointer hover:shadow-md transition-all"
               onClick={() => navigate("/dashboard/student-register")}
             >
                <GraduationCap className="w-8 h-8 mx-auto text-blue-500 mb-2" />
                <span className="text-xs font-semibold">Add Student</span>
             </div>
             <div 
               className="bg-white p-4 rounded-lg shadow-sm text-center cursor-pointer hover:shadow-md transition-all"
               onClick={() => navigate("/dashboard/fees")}
             >
                <DollarSign className="w-8 h-8 mx-auto text-yellow-500 mb-2" />
                <span className="text-xs font-semibold">Collect Fees</span>
             </div>
             <div 
               className="bg-white p-4 rounded-lg shadow-sm text-center cursor-pointer hover:shadow-md transition-all"
               onClick={() => navigate("/dashboard/teacher-register")}
             >
                <Users className="w-8 h-8 mx-auto text-green-500 mb-2" />
                <span className="text-xs font-semibold">Add Teacher</span>
             </div>
             <div 
               className="bg-white p-4 rounded-lg shadow-sm text-center cursor-pointer hover:shadow-md transition-all"
               onClick={() => navigate("/dashboard/staff")}
             >
                <UserCog className="w-8 h-8 mx-auto text-purple-500 mb-2" />
                <span className="text-xs font-semibold">Manage Staff</span>
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboardHome;