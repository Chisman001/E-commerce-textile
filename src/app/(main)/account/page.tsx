"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Loader2, Save, CheckCircle } from "lucide-react";

const NIGERIAN_STATES = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa",
  "Benue", "Borno", "Cross River", "Delta", "Ebonyi", "Edo",
  "Ekiti", "Enugu", "FCT", "Gombe", "Imo", "Jigawa", "Kaduna",
  "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa",
  "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers",
  "Sokoto", "Taraba", "Yobe", "Zamfara",
];

interface ProfileForm {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
}

export default function AccountPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [form, setForm] = useState<ProfileForm>({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isLoaded && !user) router.push("/sign-in");
  }, [isLoaded, user, router]);

  useEffect(() => {
    if (!user) return;

    fetch("/api/profile")
      .then((r) => r.json())
      .then((data) => {
        setForm({
          fullName: data.fullName || user.fullName || "",
          phone: data.phone || "",
          address: data.address || "",
          city: data.city || "",
          state: data.state || "",
        });
      })
      .catch(() => {
        setForm((prev) => ({
          ...prev,
          fullName: user.fullName || "",
        }));
      })
      .finally(() => setIsLoading(false));
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError("");

    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Save failed");
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setError("Failed to save. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!isLoaded || isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-2xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Account Settings</h1>
      <p className="text-gray-500 mb-8">
        Manage your profile and delivery information
      </p>

      {/* Account info from Clerk */}
      <div className="bg-orange-50 rounded-xl p-6 mb-8">
        <h2 className="font-semibold text-gray-900 mb-3">Account Information</h2>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-gray-500 w-24">Email:</span>
            <span className="font-medium text-gray-900">
              {user?.primaryEmailAddress?.emailAddress}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-500 w-24">Member since:</span>
            <span className="font-medium text-gray-900">
              {user?.createdAt
                ? new Date(user.createdAt).toLocaleDateString("en-NG", {
                    month: "long",
                    year: "numeric",
                  })
                : "—"}
            </span>
          </div>
        </div>
      </div>

      <Separator className="mb-8" />

      <form onSubmit={handleSave}>
        <h2 className="text-lg font-semibold text-gray-900 mb-6">
          Delivery Profile
        </h2>

        <div className="space-y-4">
          <div>
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              placeholder="Your full name"
              className="mt-1.5"
            />
          </div>

          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="+234 801 234 5678"
              className="mt-1.5"
            />
          </div>

          <div>
            <Label htmlFor="address">Street Address</Label>
            <Input
              id="address"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              placeholder="e.g. 15 Awolowo Road, Ikoyi"
              className="mt-1.5"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                placeholder="e.g. Lagos"
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="state">State</Label>
              <select
                id="state"
                value={form.state}
                onChange={(e) => setForm({ ...form, state: e.target.value })}
                className="mt-1.5 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="">Select state</option>
                {NIGERIAN_STATES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {error && <p className="text-sm text-red-500 mt-4">{error}</p>}

        <div className="mt-6">
          <Button
            type="submit"
            className={`h-11 px-8 ${saved ? "bg-green-500 hover:bg-green-500" : "bg-orange-500 hover:bg-orange-600"} text-white`}
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : saved ? (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Saved!
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
