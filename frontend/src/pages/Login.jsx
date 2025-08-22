import React, { useState } from 'react';
import Button from '../components/ui/Button';
import EditText from '../components/ui/Edittext';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';  // import the axios instance

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  const handleLogin = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.post('/api/auth/login', { email, password });

      // Example: save token
      localStorage.setItem('token', response.data.token);

      // Navigate after successful login
      navigate('/home');
    } catch (err) {
      if (err.response) {
        console.log(err)
        setError(err.response.data.message || 'Login failed');
      } else {
        console.log(err)
        setError('Network error. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    console.log('Forgot password clicked');
  };

  return (
    <div className="min-h-screen bg-[#141414] flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#1e1e1e] border-b border-[#2c2c2c7c] shadow-[2px_4px_4px_#0000001e]">
        <div className="max-w-[1280px] mx-auto flex justify-between items-center px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-3">
            <img
              src="/images/img_group_39660.svg"
              alt="Levitation Logo"
              className="w-10 h-10"
            />
            <div className="flex flex-col">
              <span className="text-xl text-white font-['Canva_Sans'] lowercase">
                levitation
              </span>
              <span className="text-xs text-white font-['Canva_Sans'] lowercase">
                Infotech
              </span>
            </div>
          </div>

          {/* Right-aligned hoverable button */}
          <Button
            variant="gradient"
            onClick={() => navigate('/signup')}
            className=" border border-transparent bg-gradient-to-r from-[#282c20] to-[#ccf575] text-[#ccf575] text-sm font-medium rounded-md px-4 py-3 transition-transform duration-300 ease-in-out hover:translate-x-20"
          >
            Connecting People With Technology
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-col lg:flex-row w-full pt-[98px]">
        {/* Left Side - Image Section */}
        <section className="relative w-full lg:w-1/2 flex justify-center items-center h-[400px] sm:h-[500px] md:h-[700px] lg:h-[860px] overflow-hidden">
          <div className="absolute top-[150px] left-[160px] w-[250px] h-[280px] bg-[#ccf575] rounded-[128px] shadow-[0_4px_300px_#888888ff] hidden lg:block"></div>

          <img
            src="/images/img_frame.png"
            alt="Main Display"
            className="relative z-20 w-[95%] sm:w-[90%] md:w-[85%] max-w-[750px] rounded-[40px 40px] object-cover"
          />
        </section>

        {/* Right Side - Login Form */}
        <section className="w-full lg:w-1/2 flex justify-center px-4">
          <div className="w-full max-w-[580px] flex flex-col gap-12 py-12">
            {/* Logo Section */}
            <div className="flex items-center gap-5">
              <img
                src="/images/img_group_39660.svg"
                alt="Levitation Logo"
                className="w-14 h-14"
              />
              <div className="flex flex-col">
                <span className="text-3xl text-white font-['Canva_Sans'] lowercase">
                  levitation
                </span>
                <span className="text-base text-white font-['Canva_Sans'] lowercase">
                  Infotech
                </span>
              </div>
            </div>

            {/* Heading */}
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-white mb-4 whitespace-nowrap">
                Let the Journey Begin!
              </h1>
              <p className="text-xl text-[#a6a6a6] leading-relaxed max-w-[90%]">
                This is a basic login page which is used for levitation assignment purpose.
              </p>
            </div>

            {/* Login Form */}
            <form
              className="flex flex-col gap-8"
              onSubmit={(e) => {
                e.preventDefault();
                handleLogin();
              }}
            >
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="text-white text-lg font-semibold block mb-2"
                >
                  Email Address
                </label>
                <EditText
                  id="email"
                  placeholder="Enter Email ID"
                  value={email}
                  onChange={handleEmailChange}
                  type="email"
                  className="w-full text-base py-3"
                />
                <span className="text-sm text-[#b8b8b8] mt-1 block">
                  This email will be displayed with your inquiry
                </span>
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="text-white text-lg font-semibold block mb-2"
                >
                  Current Password
                </label>
                <EditText
                  id="password"
                  placeholder="Enter the Password"
                  value={password}
                  onChange={handlePasswordChange}
                  type="password"
                  className="w-full text-base py-3"
                />
              </div>

              {/* Error Message */}
              {error && <p className="text-red-500">{error}</p>}

              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                <Button
                  variant="gradient"
                  type="submit"
                  disabled={loading}
                  className="bg-gradient-to-r from-[#141414] to-[#303030] text-[#ccf575] text-lg font-semibold rounded-md px-8 py-4 w-full sm:w-auto"
                >
                  {loading ? 'Logging in...' : 'Login now'}
                </Button>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-base text-[#b8b8b8] hover:text-[#ccf575] transition"
                >
                  Forget password?
                </button>
              </div>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Login;
