import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader, AlertDialogTitle
} from "@/components/ui/alert-dialog";
import {
    GraduationCap, ArrowRight, AlertTriangle, CheckCircle2,
    Loader2, History, Users, RefreshCw
} from "lucide-react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL || "/api";

type Student = {
    id: number;
    _id: string;
    admission_no: string;
    student_name: string;
    classname: string;
    roll_no: string;
    father_name: string;
    contact_no: string;
    previous_year_dues: number;
    next_class: string | null;
    monthlyPending: number;
    busPending: number;
    examPending: number;
    admissionPending: number;
    dressPending: number;
    bookPending: number;
    finePending: number;
    otherPending: number;
    totalPending: number;
};

type HistoryEntry = {
    id: number;
    admission_no: string;
    student_name: string;
    from_class: string;
    to_class: string;
    academic_year: string;
    dues_at_promotion: number;
    promoted_at: string;
};

const fmt = (n: number) => n > 0 ? `₹${n.toLocaleString()}` : null;

export default function ClassPromotionPage() {
    const { userInfo } = useSelector((state: RootState) => state.auth);
    const { toast } = useToast();
    const headers = { Authorization: `Bearer ${userInfo?.token}` };

    const [classes, setClasses] = useState<string[]>([]);
    const [selectedClass, setSelectedClass] = useState("");
    const [students, setStudents] = useState<Student[]>([]);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [loading, setLoading] = useState(false);
    const [classLoading, setClassLoading] = useState(true);
    const [promoting, setPromoting] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [tab, setTab] = useState<"promote" | "history">("promote");
    const [history, setHistory] = useState<HistoryEntry[]>([]);
    const [historyLoading, setHistoryLoading] = useState(false);

    useEffect(() => { fetchClasses(); }, []);

    const fetchClasses = async () => {
        setClassLoading(true);
        try {
            const res = await axios.get(`${API}/promotion/classes`, { headers });
            setClasses(res.data);
        } catch {
            toast({ title: "Classes load nahi hui", variant: "destructive" });
        } finally {
            setClassLoading(false);
        }
    };

    const fetchStudents = async (cls: string) => {
        setLoading(true);
        setSelectedIds([]);
        setStudents([]);
        try {
            const res = await axios.get(`${API}/promotion/students?classname=${encodeURIComponent(cls)}`, { headers });
            setStudents(res.data);
        } catch {
            toast({ title: "Students load nahi hue", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    const fetchHistory = async () => {
        setHistoryLoading(true);
        try {
            const res = await axios.get(`${API}/promotion/history`, { headers });
            setHistory(res.data);
        } catch {
            toast({ title: "History load nahi hui", variant: "destructive" });
        } finally {
            setHistoryLoading(false);
        }
    };

    useEffect(() => { if (tab === "history") fetchHistory(); }, [tab]);

    const handleClassChange = (cls: string) => { setSelectedClass(cls); fetchStudents(cls); };
    const toggleStudent = (id: number) => setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    const toggleAll = () => setSelectedIds(selectedIds.length === students.length ? [] : students.map(s => s.id));

    const selectedStudents = students.filter(s => selectedIds.includes(s.id));
    const studentsWithDues = selectedStudents.filter(s => s.totalPending > 0);
    const nextClass = students[0]?.next_class ?? null;
    const totalDuesCarried = studentsWithDues.reduce((sum, s) => sum + s.totalPending, 0);

    // Summary totals for selected
    const selTotal = selectedStudents.reduce((a, s) => a + s.totalPending, 0);
    const selMonthly = selectedStudents.reduce((a, s) => a + s.monthlyPending, 0);
    const selOther = selectedStudents.reduce((a, s) => a + s.otherPending + s.busPending, 0);

    const handlePromote = async () => {
        if (!selectedIds.length || !nextClass) return;
        setPromoting(true);
        setShowConfirm(false);
        try {
            const res = await axios.post(`${API}/promotion/promote`, {
                studentIds: selectedIds,
                fromClass: selectedClass,
                toClass: nextClass,
                promotedBy: userInfo?.name || "Admin",
            }, { headers });

            toast({
                title: `✅ ${res.data.promoted.length} Students Promote Ho Gaye!`,
                description: `${selectedClass} → ${nextClass}${studentsWithDues.length > 0 ? `. ₹${totalDuesCarried.toLocaleString()} dues previous year mein store.` : ""}`,
            });
            fetchStudents(selectedClass);
            fetchClasses();
            setSelectedIds([]);
        } catch (err: any) {
            toast({ title: "Promotion Error", description: err.response?.data?.message || "Error", variant: "destructive" });
        } finally {
            setPromoting(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                        <GraduationCap className="w-7 h-7 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Class Promotion</h1>
                        <p className="text-sm text-muted-foreground">Students ko promote karein. Dues automatically previous year mein store honge.</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant={tab === "promote" ? "default" : "outline"} size="sm" onClick={() => setTab("promote")}><Users className="w-4 h-4 mr-1" />Promote</Button>
                    <Button variant={tab === "history" ? "default" : "outline"} size="sm" onClick={() => setTab("history")}><History className="w-4 h-4 mr-1" />History</Button>
                </div>
            </div>

            {tab === "promote" ? (
                <>
                    {/* Class Selector */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base">Class Select Karein</CardTitle>
                            <CardDescription>Jis class ke students ko promote karna hai</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {classLoading ? (
                                <div className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="w-4 h-4 animate-spin" /> Loading...</div>
                            ) : (
                                <div className="flex flex-wrap gap-2">
                                    {classes.map(cls => (
                                        <button key={cls} id={`class-btn-${cls}`} onClick={() => handleClassChange(cls)}
                                            className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${selectedClass === cls ? "bg-primary text-white border-primary shadow" : "bg-white text-gray-700 border-gray-200 hover:border-primary hover:text-primary"}`}>
                                            {cls}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Students Table */}
                    {selectedClass && (
                        <Card>
                            <CardHeader className="pb-3">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                    <div>
                                        <CardTitle className="text-base flex items-center gap-2 flex-wrap">
                                            <span className="font-bold">{selectedClass}</span>
                                            {nextClass ? (
                                                <><ArrowRight className="w-4 h-4 text-muted-foreground" /><span className="text-primary font-bold">{nextClass}</span></>
                                            ) : (
                                                <Badge variant="outline" className="text-orange-600 border-orange-300">Last Class</Badge>
                                            )}
                                        </CardTitle>
                                        <CardDescription>{loading ? "Loading..." : `${students.length} students — ${selectedIds.length} selected`}</CardDescription>
                                    </div>
                                    <div className="flex gap-2 shrink-0">
                                        <Button variant="outline" size="sm" onClick={() => fetchStudents(selectedClass)}><RefreshCw className="w-3 h-3 mr-1" />Refresh</Button>
                                        {nextClass && students.length > 0 && (
                                            <Button id="btn-promote" size="sm" disabled={!selectedIds.length || promoting} onClick={() => setShowConfirm(true)}>
                                                {promoting ? <><Loader2 className="w-4 h-4 mr-1 animate-spin" />Ho Raha Hai...</> : <><GraduationCap className="w-4 h-4 mr-1" />Promote ({selectedIds.length})</>}
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                {loading ? (
                                    <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
                                ) : students.length === 0 ? (
                                    <p className="text-center text-muted-foreground py-8">Is class mein koi student nahi hai</p>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="border-b bg-gray-50 text-left">
                                                    <th className="pl-4 pr-2 py-3">
                                                        <Checkbox id="select-all" checked={selectedIds.length === students.length && students.length > 0} onCheckedChange={toggleAll} />
                                                    </th>
                                                    <th className="px-2 py-3 font-semibold text-gray-600">Student</th>
                                                    <th className="px-2 py-3 font-semibold text-gray-600">Contact</th>
                                                    <th className="px-2 py-3 font-semibold text-gray-600 text-right">Monthly Pending</th>
                                                    <th className="px-2 py-3 font-semibold text-gray-600">Other Dues</th>
                                                    <th className="px-2 py-3 font-semibold text-red-600 text-right">Total Pending</th>
                                                    <th className="px-4 py-3 font-semibold text-gray-600 text-center">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {students.map(s => {
                                                    const otherParts = [
                                                        s.examPending > 0 && `Exam: ₹${s.examPending.toLocaleString()}`,
                                                        s.admissionPending > 0 && `Adm: ₹${s.admissionPending.toLocaleString()}`,
                                                        s.dressPending > 0 && `Dress: ₹${s.dressPending.toLocaleString()}`,
                                                        s.bookPending > 0 && `Book: ₹${s.bookPending.toLocaleString()}`,
                                                        s.busPending > 0 && `Bus: ₹${s.busPending.toLocaleString()}`,
                                                        s.finePending > 0 && `Fine: ₹${s.finePending.toLocaleString()}`,
                                                        s.previous_year_dues > 0 && `Prev: ₹${s.previous_year_dues.toLocaleString()}`,
                                                    ].filter(Boolean) as string[];

                                                    const isSelected = selectedIds.includes(s.id);
                                                    return (
                                                        <tr key={s._id} className={`border-b transition-colors ${isSelected ? "bg-primary/5" : "hover:bg-gray-50"}`}>
                                                            <td className="pl-4 pr-2 py-3">
                                                                <Checkbox id={`s-${s.id}`} checked={isSelected} onCheckedChange={() => toggleStudent(s.id)} />
                                                            </td>
                                                            <td className="px-2 py-3">
                                                                <p className="font-semibold text-gray-800">{s.student_name}</p>
                                                                <p className="text-xs text-muted-foreground">Adm: {s.admission_no} | Roll: {s.roll_no || "—"}</p>
                                                                {s.previous_year_dues > 0 && (
                                                                    <p className="text-xs text-orange-500 font-medium mt-0.5">Prev Year: ₹{s.previous_year_dues.toLocaleString()}</p>
                                                                )}
                                                            </td>
                                                            <td className="px-2 py-3 text-muted-foreground text-xs">{s.contact_no || s.father_name || "—"}</td>
                                                            <td className="px-2 py-3 text-right">
                                                                {s.monthlyPending > 0 ? (
                                                                    <span className="font-semibold text-red-600">₹{s.monthlyPending.toLocaleString()}</span>
                                                                ) : (
                                                                    <span className="text-green-600 text-xs">Clear</span>
                                                                )}
                                                            </td>
                                                            <td className="px-2 py-3 text-xs text-gray-600 max-w-xs">
                                                                {otherParts.length > 0 ? otherParts.join(", ") : <span className="text-green-600">Clear</span>}
                                                            </td>
                                                            <td className="px-2 py-3 text-right">
                                                                {s.totalPending > 0 ? (
                                                                    <span className="font-bold text-red-600 text-base">₹{s.totalPending.toLocaleString()}</span>
                                                                ) : (
                                                                    <span className="text-green-600 font-semibold">₹0</span>
                                                                )}
                                                            </td>
                                                            <td className="px-4 py-3 text-center">
                                                                {s.totalPending > 0 ? (
                                                                    <Badge variant="destructive" className="text-xs"><AlertTriangle className="w-3 h-3 mr-1" />Dues</Badge>
                                                                ) : (
                                                                    <Badge className="bg-green-100 text-green-700 border-0 text-xs"><CheckCircle2 className="w-3 h-3 mr-1" />Clear</Badge>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>

                                            {/* Summary Footer */}
                                            {selectedIds.length > 0 && (
                                                <tfoot>
                                                    <tr className="bg-primary/5 border-t-2 border-primary/20 font-semibold">
                                                        <td colSpan={2} className="pl-4 py-3 text-sm text-primary">{selectedIds.length} Selected</td>
                                                        <td className="px-2 py-3 text-xs text-muted-foreground">Total</td>
                                                        <td className="px-2 py-3 text-right text-red-600">
                                                            {selMonthly > 0 ? `₹${selMonthly.toLocaleString()}` : "—"}
                                                        </td>
                                                        <td className="px-2 py-3 text-xs text-gray-600">
                                                            Other: {selOther > 0 ? `₹${selOther.toLocaleString()}` : "—"}
                                                        </td>
                                                        <td className="px-2 py-3 text-right text-red-700 text-base">
                                                            ₹{selTotal.toLocaleString()}
                                                        </td>
                                                        <td className="px-4 py-3"></td>
                                                    </tr>
                                                </tfoot>
                                            )}
                                        </table>
                                    </div>
                                )}

                                {!nextClass && students.length > 0 && (
                                    <p className="text-center text-sm text-amber-600 m-4 p-3 bg-amber-50 rounded-lg">
                                        ⚠️ Yeh last class hai — aage promote nahi ho sakta
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </>
            ) : (
                /* History */
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-base flex items-center gap-2"><History className="w-4 h-4" />Promotion History</CardTitle>
                            <Button variant="outline" size="sm" onClick={fetchHistory}><RefreshCw className="w-3 h-3 mr-1" />Refresh</Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {historyLoading ? (
                            <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
                        ) : history.length === 0 ? (
                            <p className="text-center text-muted-foreground py-8">Abhi tak koi promotion nahi hua</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b text-left text-muted-foreground">
                                            <th className="pb-2 pr-3">Student</th>
                                            <th className="pb-2 pr-3">Adm No</th>
                                            <th className="pb-2 pr-3">From</th>
                                            <th className="pb-2 pr-3">To</th>
                                            <th className="pb-2 pr-3">Session</th>
                                            <th className="pb-2 pr-3 text-right">Dues Carried</th>
                                            <th className="pb-2">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {history.map(h => (
                                            <tr key={h.id} className="border-b hover:bg-gray-50">
                                                <td className="py-2 pr-3 font-medium">{h.student_name}</td>
                                                <td className="py-2 pr-3 text-xs text-muted-foreground">{h.admission_no}</td>
                                                <td className="py-2 pr-3"><Badge variant="outline" className="text-xs">{h.from_class}</Badge></td>
                                                <td className="py-2 pr-3"><Badge className="text-xs bg-green-100 text-green-700 border-0">{h.to_class}</Badge></td>
                                                <td className="py-2 pr-3 text-xs text-muted-foreground">{h.academic_year}</td>
                                                <td className="py-2 pr-3 text-right">
                                                    {Number(h.dues_at_promotion) > 0
                                                        ? <span className="text-red-600 font-semibold">₹{Number(h.dues_at_promotion).toLocaleString()}</span>
                                                        : <span className="text-green-600">Clear</span>}
                                                </td>
                                                <td className="py-2 text-xs text-muted-foreground">{new Date(h.promoted_at).toLocaleDateString('en-IN')}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Confirm Dialog */}
            <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Class Promotion Confirm Karein</AlertDialogTitle>
                        <AlertDialogDescription asChild>
                            <div className="space-y-3 text-sm">
                                <p><strong>{selectedIds.length} students</strong> ko <strong>{selectedClass}</strong> se <strong className="text-primary">{nextClass}</strong> mein promote kiya jayega.</p>

                                {/* Summary Table */}
                                <div className="rounded-lg border overflow-hidden text-sm">
                                    <div className="bg-gray-50 px-3 py-2 font-semibold text-gray-700 text-xs uppercase tracking-wide">Dues Summary</div>
                                    <div className="divide-y">
                                        <div className="flex justify-between px-3 py-2">
                                            <span className="text-muted-foreground">Monthly Pending</span>
                                            <span className={selMonthly > 0 ? "text-red-600 font-medium" : "text-green-600"}>
                                                {selMonthly > 0 ? `₹${selMonthly.toLocaleString()}` : "Clear"}
                                            </span>
                                        </div>
                                        <div className="flex justify-between px-3 py-2">
                                            <span className="text-muted-foreground">Other Dues (Exam, Adm etc.)</span>
                                            <span className={selOther > 0 ? "text-red-600 font-medium" : "text-green-600"}>
                                                {selOther > 0 ? `₹${selOther.toLocaleString()}` : "Clear"}
                                            </span>
                                        </div>
                                        <div className="flex justify-between px-3 py-2 bg-red-50">
                                            <span className="font-bold text-gray-800">Total Pending</span>
                                            <span className={`font-bold text-lg ${selTotal > 0 ? "text-red-600" : "text-green-600"}`}>
                                                ₹{selTotal.toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {selTotal > 0 && (
                                    <div className="flex items-start gap-2 p-3 bg-orange-50 border border-orange-200 rounded-lg text-orange-700">
                                        <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                                        <p className="text-sm">Yeh <strong>₹{selTotal.toLocaleString()}</strong> dues automatically <strong>Previous Year Dues</strong> mein store ho jayenge.</p>
                                    </div>
                                )}

                                <p className="text-xs text-muted-foreground">Kya aap confirm karte hain?</p>
                            </div>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handlePromote}>Haan, Promote Karein</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
