"use client";

import { apiFetch } from '@/lib/api-client';

import { useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/shadcn-ui/button";
import { Input } from "@/components/shadcn-ui/input";
import { Label } from "@/components/shadcn-ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/shadcn-ui/card";
import { User, Mail, Bell, Shield } from "lucide-react";

export function ProfileLayout() {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSave = async () => {
    if (!name.trim()) {
      setMessage({ type: "error", text: "TÃªn khÃ´ng Ä‘Æ°á»£c Ä‘á»ƒ trá»‘ng" });
      return;
    }

    setIsSaving(true);
    setMessage(null);

    try {
      const response = await apiFetch("/api/auth/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        updateUser({ name: data.data.name });
        setMessage({ type: "success", text: "Cáº­p nháº­t thÃ´ng tin thÃ nh cÃ´ng" });
        setIsEditing(false);
      } else {
        setMessage({ type: "error", text: data.error || "Cáº­p nháº­t tháº¥t báº¡i" });
      }
    } catch {
      setMessage({ type: "error", text: "ÄÃ£ xáº£y ra lá»—i. Vui lÃ²ng thá»­ láº¡i." });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setName(user?.name || "");
    setEmail(user?.email || "");
    setIsEditing(false);
    setMessage(null);
  };

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="flex items-center gap-4">
        <div className="w-20 h-20 rounded-full bg-[#827BF2] flex items-center justify-center">
          {user?.avatar ? (
            <img src={user.avatar} alt={user.name} className="w-full h-full object-cover rounded-full" />
          ) : (
            <User className="w-10 h-10 text-white" />
          )}
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-[#1A1D2E]">{user?.name || "NgÆ°á»i dÃ¹ng"}</h2>
          <p className="text-sm text-[#9EA3B8]">{user?.email || "email@example.com"}</p>
        </div>
      </div>

      {/* Profile Info Card */}
      <Card className="border-[#E0E3EC]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <User className="w-5 h-5 text-[#827BF2]" />
            ThÃ´ng tin cÃ¡ nhÃ¢n
          </CardTitle>
          <CardDescription>Quáº£n lÃ½ thÃ´ng tin há»“ sÆ¡ cá»§a báº¡n</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {message && (
            <div
              className={`p-3 rounded-lg text-sm ${
                message.type === "success"
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}
            >
              {message.text}
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-[#5A607F]">
                Há» vÃ  tÃªn
              </Label>
              {isEditing ? (
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="border-[#E0E3EC] focus:border-[#827BF2] focus:ring-[#827BF2]"
                />
              ) : (
                <div className="flex items-center h-10 px-3 rounded-lg bg-[#F2F4F8] text-[#1A1D2E]">
                  {name || "ChÆ°a cáº­p nháº­t"}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-[#5A607F]">
                Email
              </Label>
              <div className="flex items-center h-10 px-3 rounded-lg bg-[#F2F4F8] text-[#1A1D2E]">
                <Mail className="w-4 h-4 mr-2 text-[#9EA3B8]" />
                {email || "ChÆ°a cáº­p nháº­t"}
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            {isEditing ? (
              <>
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  className="border-[#E0E3EC] text-[#5A607F] hover:bg-[#F2F4F8]"
                  disabled={isSaving}
                >
                  Há»§y
                </Button>
                <Button
                  onClick={handleSave}
                  className="bg-[#827BF2] hover:bg-[#6B5DD3] text-white"
                  disabled={isSaving}
                >
                  {isSaving ? "Äang lÆ°u..." : "LÆ°u thay Ä‘á»•i"}
                </Button>
              </>
            ) : (
              <Button
                onClick={() => setIsEditing(true)}
                className="bg-[#827BF2] hover:bg-[#6B5DD3] text-white"
              >
                Chá»‰nh sá»­a
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Account Security Card */}
      <Card className="border-[#E0E3EC]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Shield className="w-5 h-5 text-[#827BF2]" />
            Báº£o máº­t tÃ i khoáº£n
          </CardTitle>
          <CardDescription>Quáº£n lÃ½ máº­t kháº©u vÃ  báº£o máº­t</CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            variant="outline"
            className="border-[#E0E3EC] text-[#5A607F] hover:bg-[#F2F4F8]"
          >
            Äá»•i máº­t kháº©u
          </Button>
        </CardContent>
      </Card>

      {/* Notification Preferences Card */}
      <Card className="border-[#E0E3EC]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Bell className="w-5 h-5 text-[#827BF2]" />
            ThÃ´ng bÃ¡o
          </CardTitle>
          <CardDescription>Quáº£n lÃ½ cÃ¡ch báº¡n nháº­n thÃ´ng bÃ¡o</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#1A1D2E]">Email thÃ´ng bÃ¡o</p>
                <p className="text-xs text-[#9EA3B8]">Nháº­n thÃ´ng bÃ¡o qua email</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#827BF2] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#827BF2]"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#1A1D2E]">Nháº¯c nhá»Ÿ chi tiÃªu</p>
                <p className="text-xs text-[#9EA3B8]">ThÃ´ng bÃ¡o khi chi tiÃªu vÆ°á»£t ngÃ¢n sÃ¡ch</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#827BF2] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#827BF2]"></div>
              </label>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
