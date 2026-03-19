import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { login as loginApi } from '../../api/authApi';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const [form, setForm]       = useState({ email: '', password: '' });
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();

  // After login, redirect to where they came from (or dashboard)
  const from = location.state?.from?.pathname || null;

  const validate = () => {
    const e = {};
    if (!form.email)                            e.email    = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email address';
    if (!form.password)                         e.password = 'Password is required';
    return e;
  };

  const handle = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) return setErrors(errs);
    setLoading(true);
    try {
      const res = await loginApi(form);
      const { user, accessToken } = res.data.data;
      loginUser(accessToken, user);
      toast.success('Welcome back, ' + user.name.split(' ')[0] + '!');

      // Smart redirect:
      // 1. If they came from a specific page (e.g. /pricing, /schedule) → go back there
      // 2. If they are admin/teacher → go to their panel
      // 3. Otherwise → dashboard
      if (from && from !== '/login' && from !== '/register') {
        navigate(from, { replace: true });
      } else if (user.role === 'admin') {
        navigate('/admin', { replace: true });
      } else if (user.role === 'teacher') {
        navigate('/teacher', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please try again.';
      toast.error(msg);
      if (err.response?.status === 401) setErrors({ password: 'Incorrect email or password' });
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl font-bold text-gray-800">Welcome Back</h1>
          <p className="text-gray-500 mt-2">Sign in to your account</p>
          {from && from !== '/login' && (
            <p className="text-sm text-primary mt-2">
              Sign in to continue to {from.replace('/', '')}
            </p>
          )}
        </div>
        <form onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-4" noValidate>
          <Input label="Email address" type="email" name="email" value={form.email}
            onChange={handle} placeholder="you@email.com" error={errors.email} autoComplete="email" />
          <Input label="Password" type="password" name="password" value={form.password}
            onChange={handle} placeholder="Your password" error={errors.password} autoComplete="current-password" />
          <Button type="submit" loading={loading} className="w-full">
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
          <p className="text-center text-sm text-gray-500">
            No account?{' '}
            <Link to="/register" className="text-primary font-medium hover:underline">
              Create one free
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
