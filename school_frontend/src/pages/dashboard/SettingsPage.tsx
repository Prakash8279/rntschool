import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { KeyRound, Search, ShieldCheck, Loader2, Eye, EyeOff } from "lucide-react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL || "/api";

type UserEntry = { id: number | string; name: string; email: string; type: "admin" | "teacher" | "student" };

export default function SettingsPage() {
    const { userInfo } = useSelector((state: RootState) => state.auth);
    const { toast } = useToast();

    const [allUsers, setAllUsers] = useState<UserEntry[]>([]);
    const [filtered, setFiltered] = useState<UserEntry[]>([]);
    const [search, setSearch] = useState("");
    const [filterType, setFilterType] = useState<string>("all");
    const [loading, setLoading] = useState(true);

    const [selectedUser, setSelectedUser] = useState<UserEntry | null>(null);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPass, setShowPass] = useState(false);
    const [changing, setChanging] = useState(false);

    useEffect(() => {
        fetchAll();
    }, []);

    const fetchAll = async () => {
        setLoading(true);
        try {
            const headers = { Authorization: `Bearer ${userInfo?.token}` };

            const [usersRes, teachersRes, studentsRes] = await Promise.all([
                axios.get(`${API}/users`, { headers }),
                axios.get(`${API}/teachers`, { headers }),
                axios.get(`${API}/students`, { headers }),
            ]);

            const adminUsers: UserEntry[] = (usersRes.data || []).map((u: any) => ({
                id: u.id || u._id,
                name: u.name,
                email: u.email,
                type: "admin" as const,
            }));
            const teachers: UserEntry[] = (teachersRes.data || []).map((t: any) => ({
                id: t.id || t._id,
                name: t.teacher_name || t.name,
                email: t.email,
                type: "teacher" as const,
            }));
            const students: UserEntry[] = (studentsRes.data || []).map((s: any) => ({
                id: s.id || s._id,
                name: s.student_name || s.name,
                email: s.email,
                type: "student" as const,
            }));

            const combined = [...adminUsers, ...teachers, ...students];
            setAllUsers(combined);
            setFiltered(combined);
        } catch (err) {
            toast({ title: "Error", description: "Users load nahi ho sake", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let result = allUsers;
        if (filterType !== "all") result = result.filter((u) => u.type === filterType);
        if (search.trim()) {
            const q = search.toLowerCase();
            result = result.filter((u) => u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q));
        }
        setFiltered(result);
    }, [search, filterType, allUsers]);

    const handleChangePassword = async () => {
        if (!selectedUser) return toast({ title: "User select karein", variant: "destructive" });
        if (!newPassword || newPassword.length < 6)
            return toast({ title: "Password kam se kam 6 characters ka hona chahiye", variant: "destructive" });
        if (newPassword !== confirmPassword)
            return toast({ title: "Passwords match nahi kar rahe", variant: "destructive" });

        setChanging(true);
        try {
            await axios.put(
                `${API}/users/change-password`,
                { userType: selectedUser.type, userId: selectedUser.id, newPassword },
                { headers: { Authorization: `Bearer ${userInfo?.token}` } }
            );
            toast({ title: "✅ Password Change Ho Gaya!", description: `${selectedUser.name} ka password successfully update hua.` });
            setNewPassword("");
            setConfirmPassword("");
            setSelectedUser(null);
        } catch (err: any) {
            toast({ title: "Error", description: err.response?.data?.message || "Password change nahi hua", variant: "destructive" });
        } finally {
            setChanging(false);
        }
    };

    const typeBadge = (type: string) => {
        const map: Record<string, string> = {
            admin: "bg-red-100 text-red-700",
            teacher: "bg-blue-100 text-blue-700",
            student: "bg-green-100 text-green-700",
        };
        return map[type] || "bg-gray-100 text-gray-700";
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                    <ShieldCheck className="w-7 h-7 text-primary" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Settings - Password Management</h1>
                    <p className="text-sm text-muted-foreground">Admin kisi bhi user ka password bina purane password ke change kar sakta hai</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left: User List */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                            <Search className="w-4 h-4" /> User Dhundein
                        </CardTitle>
                        <CardDescription>Jis user ka password change karna hai use select karein</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <Input
                            placeholder="Naam ya email se dhundein..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            id="settings-search"
                        />
                        <Select value={filterType} onValueChange={setFilterType}>
                            <SelectTrigger id="settings-filter-type">
                                <SelectValue placeholder="User type filter" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Sabhi Users</SelectItem>
                                <SelectItem value="admin">Admin / Staff</SelectItem>
                                <SelectItem value="teacher">Teachers</SelectItem>
                                <SelectItem value="student">Students</SelectItem>
                            </SelectContent>
                        </Select>

                        {loading ? (
                            <div className="flex justify-center py-8">
                                <Loader2 className="w-6 h-6 animate-spin text-primary" />
                            </div>
                        ) : (
                            <div className="space-y-1 max-h-80 overflow-y-auto pr-1">
                                {filtered.length === 0 && (
                                    <p className="text-center text-muted-foreground text-sm py-6">Koi user nahi mila</p>
                                )}
                                {filtered.map((u) => (
                                    <button
                                        key={`${u.type}-${u.id}`}
                                        id={`user-row-${u.type}-${u.id}`}
                                        onClick={() => {
                                            setSelectedUser(u);
                                            setNewPassword("");
                                            setConfirmPassword("");
                                        }}
                                        className={`w-full text-left px-3 py-2 rounded-lg border transition-all text-sm flex items-center justify-between gap-2 ${selectedUser?.id === u.id && selectedUser?.type === u.type
                                                ? "border-primary bg-primary/5 shadow-sm"
                                                : "border-transparent hover:bg-gray-50 hover:border-gray-200"
                                            }`}
                                    >
                                        <div>
                                            <p className="font-medium text-gray-800">{u.name}</p>
                                            <p className="text-xs text-muted-foreground">{u.email}</p>
                                        </div>
                                        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold capitalize ${typeBadge(u.type)}`}>
                                            {u.type === "admin" ? "Admin/Staff" : u.type}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Right: Change Password Form */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                            <KeyRound className="w-4 h-4" /> Password Change Karein
                        </CardTitle>
                        <CardDescription>
                            {selectedUser
                                ? `Selected: ${selectedUser.name} (${selectedUser.type})`
                                : "Pehle left side se user select karein"}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {selectedUser ? (
                            <>
                                <div className="p-3 bg-primary/5 rounded-lg border border-primary/20 text-sm">
                                    <p className="font-semibold text-primary">{selectedUser.name}</p>
                                    <p className="text-muted-foreground">{selectedUser.email}</p>
                                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold capitalize mt-1 inline-block ${typeBadge(selectedUser.type)}`}>
                                        {selectedUser.type === "admin" ? "Admin/Staff" : selectedUser.type}
                                    </span>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="new-password">Naya Password</Label>
                                    <div className="relative">
                                        <Input
                                            id="new-password"
                                            type={showPass ? "text" : "password"}
                                            placeholder="Naya password dalein (min 6 chars)"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                        />
                                        <button
                                            type="button"
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                                            onClick={() => setShowPass(!showPass)}
                                        >
                                            {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="confirm-password">Password Confirm Karein</Label>
                                    <Input
                                        id="confirm-password"
                                        type={showPass ? "text" : "password"}
                                        placeholder="Wahi password dobara dalein"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                    {confirmPassword && newPassword !== confirmPassword && (
                                        <p className="text-xs text-red-500">Passwords match nahi kar rahe</p>
                                    )}
                                    {confirmPassword && newPassword === confirmPassword && confirmPassword.length >= 6 && (
                                        <p className="text-xs text-green-600">✓ Passwords match kar rahe hain</p>
                                    )}
                                </div>

                                <Button
                                    id="btn-change-password"
                                    onClick={handleChangePassword}
                                    disabled={changing}
                                    className="w-full"
                                >
                                    {changing ? (
                                        <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Password Change Ho Raha Hai...</>
                                    ) : (
                                        <><KeyRound className="w-4 h-4 mr-2" /> Password Change Karein</>
                                    )}
                                </Button>

                                <Button variant="ghost" className="w-full text-sm" onClick={() => setSelectedUser(null)}>
                                    Cancel
                                </Button>
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground space-y-3">
                                <KeyRound className="w-10 h-10 opacity-30" />
                                <p className="text-sm">Kisi user ko select karein<br />phir yahan password change karein</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
