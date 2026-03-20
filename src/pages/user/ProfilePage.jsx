import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { updateProfile } from "../../api/usersApi";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Avatar from "../../components/common/Avatar";
import PageWrapper from "../../components/layout/PageWrapper";
import toast from "react-hot-toast";

const ProfilePage = () => {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    avatar: user?.avatar || "",
  });
  const [loading, setLoading] = useState(false);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await updateProfile(form);
      setUser(res.data.data);
      toast.success("Profile updated!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper>
      <h1 className="font-serif text-3xl font-bold text-gray-800 mb-6">
        My Profile
      </h1>

      <div className="flex flex-col md:flex-row md:gap-8 w-full max-w-3xl mx-auto">
        {/* Profile Info Card */}
        <div className="card mb-6 md:mb-0 flex items-center gap-4 w-full md:w-1/3">
          <Avatar src={form.avatar} name={form.name} size="lg" />
          <div className="flex-1">
            <p className="font-semibold text-gray-800">{user?.name}</p>
            <p className="text-sm text-gray-500">{user?.email}</p>
            <span className="inline-block mt-1 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full capitalize">
              {user?.role}
            </span>
          </div>
        </div>

        {/* Editable Form */}
        <form onSubmit={handleSubmit} className="card flex-1 space-y-4 w-full">
          <Input
            label="Full Name"
            name="name"
            value={form.name}
            onChange={handle}
          />
          <Input
            label="Phone"
            name="phone"
            value={form.phone}
            onChange={handle}
            placeholder="+52 33..."
          />
          <Input
            label="Avatar URL"
            name="avatar"
            value={form.avatar}
            onChange={handle}
            placeholder="https://..."
          />
          <Button type="submit" loading={loading} className="w-full">
            Save Changes
          </Button>
        </form>
      </div>
    </PageWrapper>
  );
};

export default ProfilePage;