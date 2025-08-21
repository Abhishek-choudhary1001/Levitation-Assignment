import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import EditText from '../components/ui/Edittext';
import api from '../api/axios';  // Import axios instance

const Registration = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState(null);

  const handleInputChange = (field) => (e) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;

    setLoading(true);
    setServerError(null);

    try {
      const response = await api.post('/api/auth/signup', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      console.log('Registration successful:', response.data);
      alert('Registration successful!');

      // Optionally save token or user data if returned, e.g.:
      // localStorage.setItem('token', response.data.token);

      navigate('/'); // Redirect to login page
    } catch (error) {
      console.error('Registration failed:', error);
      if (error.response && error.response.data && error.response.data.message) {
        setServerError(error.response.data.message);
      } else {
        setServerError('Registration failed, please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = () => {
    navigate('/');
  };

  return (
    <div className="w-full min-h-screen bg-global-1 flex flex-col">
      {/* Header */}
      <header className="w-full sticky top-0 z-0 bg-global-2 border-b border-solid border-[#2c2c2c7c] shadow-[2px_4px_4px_#0000001e]">
        <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-2">
            {/* Logo Section */}
            <div className="flex items-center gap-[10px]">
              <img src="/images/img_group_39660.svg" alt="Levitation Logo" className="w-[38px] h-[38px]" />
              <div className="flex flex-col">
                <span className="text-[20px] font-normal leading-[28px] text-global-3 font-['Canva_Sans'] lowercase">levitation</span>
                <span className="text-[10px] font-normal leading-[14px] text-global-3 font-['Canva_Sans'] lowercase">Infotech</span>
              </div>
            </div>
            <Button
              variant="gradient"
              size="medium"
              onClick={handleLogin}
              className="rounded-[6px] px-4 py-3 text-sm font-medium font-pretendard transform transition-all duration-300 hover:-translate-x-[20px]"
            >
              Login
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full">
        <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row justify-between items-start gap-8 lg:gap-0 py-8 lg:py-[70px]">
            {/* Left Side - Form Section */}
            <div className="w-full lg:w-[38%] relative">
              <div className="relative z-10 ml-0 lg:ml-[64px] space-y-[26px]">
                <div className="space-y-[2px]">
                  <h1 className="text-[32px] sm:text-[40px] lg:text-[52px] font-semibold leading-[1.2] text-global-3 font-pretendard">
                    Sign up to begin journey
                  </h1>

                  <p className="text-[16px] sm:text-[18px] lg:text-[20px] font-normal leading-[1.5] text-global-1 font-['Mukta'] w-full">
                    This is basic signup page which is used for levitation assignment purpose.
                  </p>
                </div>

                <div className="space-y-[22px]">
                  {/* Name Field */}
                  <div className="space-y-[2px]">
                    <label className="block text-[16px] font-medium leading-[24px] text-global-3 font-poppins">Enter your name</label>
                    <EditText placeholder="Enter Name" value={formData.name} onChange={handleInputChange('name')} className="w-full" />
                    {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                    <p className="text-[14px] font-normal leading-[21px] text-global-2 font-poppins">This name will be displayed with your inquiry</p>
                  </div>

                  {/* Email Field */}
                  <div className="space-y-[4px]">
                    <label className="block text-[16px] font-medium leading-[24px] text-global-3 font-poppins">Email Address</label>
                    <EditText placeholder="Enter Email ID" type="email" value={formData.email} onChange={handleInputChange('email')} className="w-full" />
                    {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                    <p className="text-[14px] font-normal leading-[21px] text-global-2 font-poppins">This email will be displayed with your inquiry</p>
                  </div>

                  {/* Password Field */}
                  <div className="space-y-[4px]">
                    <label className="block text-[16px] font-medium leading-[24px] text-global-3 font-poppins">Password</label>
                    <EditText placeholder="Enter the Password" type="password" value={formData.password} onChange={handleInputChange('password')} className="w-full" />
                    {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                    <p className="text-[14px] font-normal leading-[21px] text-global-2 font-poppins">Any further updates will be forwarded on this Email ID</p>
                  </div>
                </div>

                {/* Server Error */}
                {serverError && (
                  <p className="text-red-600 text-sm font-semibold mt-2">
                    {serverError}
                  </p>
                )}

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8">
                  <Button
                    variant="secondary"
                    size="medium"
                    onClick={handleRegister}
                    className="rounded-[6px] px-[18px] py-3 bg-gradient-to-r from-global-1 to-[#303030] text-button-2"
                    disabled={loading}
                  >
                    {loading ? 'Registering...' : 'Register'}
                  </Button>
                  <button
                    onClick={handleLogin}
                    className="text-[14px] font-normal leading-[21px] text-global-2 font-poppins hover:text-yellow-300 transition-colors"
                    disabled={loading}
                  >
                    Already have account ?
                  </button>
                </div>
              </div>
            </div>

            {/* Right Side - Image Section */}
            <div className="w-full lg:w-[56%] relative">
              <div className="relative w-full h-[400px] sm:h-[500px] lg:h-[786px]">
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[220px] h-[256px] bg-global-4 rounded-[128px] shadow-[0px_4px_300px_#888888ff] opacity-60"></div>

                <img
                  src="/images/img_frame_1707478310.png"
                  alt="Connecting People with Technology"
                  className="absolute top-[40px] left-1/2 transform -translate-x-1/2 w-[100%] sm:w-[100%] lg:w-[1000px] h-auto max-h-[900px] object-cover rounded-[60px_0px_60px_0px] z-20"
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Registration;
