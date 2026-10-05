import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { KeyRound, Eye, EyeOff, Loader2, ShieldCheck, CheckCircle2 } from "lucide-react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL || "/api";

export default function ChangePasswordPage() {
    const { userInfo } = useSelector((state: RootState) => state.auth);
    const { toast } = useToast();

    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showOld, setShowOld] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const passwordStrength = (pwd: string) => {
        if (!pwd) return { label: "", color: "" };
        if (pwd.length < 6) return { label: "Bahut Chota", color: "text-red-500" };
        if (pwd.length < 8) return { label: "Thoda Kamzor", color: "text-orange-500" };
        if (/[A-Z]/.test(pwd) && /[0-9]/.test(pwd)) return { label: "Mazboot", color: "text-green-600" };
        return { label: "Theek Hai", color: "text-yellow-600" };
    };

    const strength = passwordStrength(newPassword);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!oldPassword) return toast({ title: "Purana password daalna zaroori hai", variant: "destructive" });
        if (!newPassword || newPassword.length < 6)
            return toast({ title: "Naya password kam se kam 6 characters ka hona chahiye", variant: "destructive" });
        if (newPassword !== confirmPassword)
            return toast({ title: "Naya password aur confirm password match nahi kar rahe", variant: "destructive" });
        if (oldPassword === newPassword)
            return toast({ title: "Naya password purane se alag hona chahiye", variant: "destructive" });

        setLoading(true);
        try {
            await axios.put(
                `${API}/auth/change-password`,
                { oldPassword, newPassword },
                { headers: { Authorization: `Bearer ${userInfo?.token}` } }
            );
            setSuccess(true);
            setOldPassword("");
            setNewPassword("");
            setConfirmPassword("");
            toast({ title: "✅ Password Change Ho Gaya!", description: "Aapka password successfully update ho gaya." });
        } catch (err: any) {
            const msg = err.response?.data?.message || "Password change nahi hua";
            toast({ title: "❌ Error", description: msg, variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-lg mx-auto space-y-6 py-4">
            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                    <KeyRound className="w-7 h-7 text-primary" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Password Change Karein</h1>
                    <p className="text-sm text-muted-foreground">
                        Welcome, <span className="font-semibold text-primary">{userInfo?.name}</span> — apna password update karein
                    </p>
                </div>
            </div>

            {success && (
                <div className="flex items-center gap-3 p-4 rounded-lg bg-green-50 border border-green-200 text-green-700">
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                    <div>
                        <p className="font-semibold">Password Change Ho Gaya!</p>
                        <p className="text-sm">Agli baar naye password se login karein.</p>
                    </div>
                </div>
            )}

            <Card>
                <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-primary" />
                        Password Update Form
                    </CardTitle>
                    <CardDescription>
                        Pehle apna purana password dalein, phir naya password set karein
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Old Password */}
                        <div className="space-y-2">
                            <Label htmlFor="old-password">Purana Password (Current Password)</Label>
                            <div className="relative">
                                <Input
                                    id="old-password"
                                    type={showOld ? "text" : "password"}
                                    placeholder="Apna purana password dalein"
                                    value={oldPassword}
                                    onChange={(e) => setOldPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-gray-700"
                                    onClick={() => setShowOld(!showOld)}
                                >
                                    {showOld ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                💡 Agar pehle kabhi password nahi badla to default password <span className="font-mono font-bold">123456</span> hai
                            </p>
                        </div>

                        {/* Divider */}
                        <div className="border-t" />

                        {/* New Password */}
                        <div className="space-y-2">
                            <Label htmlFor="new-password">Naya Password</Label>
                            <div className="relative">
                                <Input
                                    id="new-password"
                                    type={showNew ? "text" : "password"}
                                    placeholder="Naya password dalein (min 6 characters)"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-gray-700"
                                    onClick={() => setShowNew(!showNew)}
                                >
                                    {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            {newPassword && (
                                <p className={`text-xs font-semibold ${strength.color}`}>
                                    Password Strength: {strength.label}
                                </p>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div className="space-y-2">
                            <Label htmlFor="confirm-new-password">Naya Password Confirm Karein</Label>
                            <Input
                                id="confirm-new-password"
                                type={showNew ? "text" : "password"}
                                placeholder="Wahi naya password dobara dalein"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                            {confirmPassword && newPassword !== confirmPassword && (
                                <p className="text-xs text-red-500">❌ Passwords match nahi kar rahe</p>
                            )}
                            {confirmPassword && newPassword === confirmPassword && confirmPassword.length >= 6 && (
                                <p className="text-xs text-green-600">✅ Passwords match kar rahe hain</p>
                            )}
                        </div>

                        <Button
                            id="btn-submit-change-password"
                            type="submit"
                            className="w-full"
                            disabled={loading}
                        >
                            {loading ? (
                                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Password Update Ho Raha Hai...</>
                            ) : (
                                <><KeyRound className="w-4 h-4 mr-2" /> Password Change Karein</>
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {/* Tips */}
            <Card className="bg-blue-50 border-blue-200">
                <CardContent className="pt-4 pb-4">
                    <p className="text-sm font-semibold text-blue-700 mb-2">🔒 Password Tips:</p>
                    <ul className="text-xs text-blue-600 space-y-1 list-disc pl-4">
                        <li>Kam se kam 8 characters ka password rakhein</li>
                        <li>Numbers aur capital letters use karein (jaise: School@2025)</li>
                        <li>Apna naam ya date of birth password mein use na karein</li>
                        <li>Password kisi ke saath share na karein</li>
                    </ul>
                </CardContent>
            </Card>
        </div>
    );
}
