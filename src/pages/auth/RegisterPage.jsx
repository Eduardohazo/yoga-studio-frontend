import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register as registerApi } from '../../api/authApi';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import toast from 'react-hot-toast';

const RegisterPage = () => {
  const [form, setForm]     = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const e = {};
    if (!form.name || form.name.trim().length < 2) e.name            = 'Name must be at least 2 characters';
    if (!form.email)                               e.email           = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email))    e.email           = 'Enter a valid email address';
    if (!form.password)                            e.password        = 'Password is required';
    else if (form.password.length < 6)             e.password        = 'Password must be at least 6 characters';
    if (form.password !== form.confirmPassword)    e.confirmPassword = 'Passwords do not match';
    return e;
  };

  const handle = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
  };

  const getStrength = () => {
    const p = form.password;
    if (!p || p.length < 6)  return { label: 'Too short', color: 'bg-red-400',    w: 'w-1/4' };
    if (p.length < 8)         return { label: 'Weak',      color: 'bg-orange-400', w: 'w-2/4' };
    if (p.length < 12)        return { label: 'Good',      color: 'bg-yellow-400', w: 'w-3/4' };
    return                           { label: 'Strong',    color: 'bg-green-500',  w: 'w-full' };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) return setErrors(errs);
    setLoading(true);
    try {
      const { name, email, password } = form;
      const res = await registerApi({ name, email, password });
      const { user, accessToken } = res.data.data;
      loginUser(accessToken, user);
      toast.success('Account created! Welcome to the studio');
      navigate('/dashboard', { replace: true });
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(msg);
      if (err.response?.status === 409) setErrors({ email: 'An account with this email already exists' });
    } finally { setLoading(false); }
  };

  const strength = form.password ? getStrength() : null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl font-bold text-gray-800">Join the Studio</h1>
          <p className="text-gray-500 mt-2">Create your free account</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-4" noValidate>
          <Input label="Full Name" name="name" value={form.name} onChange={handle}
            placeholder="Ana Garcia" error={errors.name} autoComplete="name" />
          <Input label="Email address" type="email" name="email" value={form.email} onChange={handle}
            placeholder="you@email.com" error={errors.email} autoComplete="email" />
          <div>
            <Input label="Password" type="password" name="password" value={form.password} onChange={handle}
              placeholder="Min 6 characters" error={errors.password} autoComplete="new-password" />
            {strength && (
              <div className="mt-2">
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className={'h-full rounded-full transition-all duration-300 ' + strength.color + ' ' + strength.w} />
                </div>
                <p className="text-xs text-gray-400 mt-1">Password: {strength.label}</p>
              </div>
            )}
          </div>
          <Input label="Confirm Password" type="password" name="confirmPassword" value={form.confirmPassword}
            onChange={handle} placeholder="Repeat your password" error={errors.confirmPassword} autoComplete="new-password" />
          <Button type="submit" loading={loading} className="w-full">
            {loading ? 'Creating account...' : 'Create Account'}
          </Button>
          <p className="text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-medium hover:underline">Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
