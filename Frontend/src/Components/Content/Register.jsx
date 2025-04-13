import React, { useState } from 'react';
import 'boxicons/css/boxicons.min.css';
import { useNavigate } from 'react-router-dom';
import bgImage from '../../assets/bg.jpg'; 

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    cordName: '',
    clubName: '',
    mobile: '',
    email: '',
    password: '',
    verificationCode: '',
  });
  const [otpSent, setOtpSent] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  const handleChange = (e) => {
    // Prevent changing email if OTP has been sent
    if (e.target.name === 'email' && otpSent) return;
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!formData.email) {
      alert('Please enter your email address.');
      return;
    }
    try {
      const response = await fetch('https://adp-backend-bzdrfdhvbhbngbgu.southindia-01.azurewebsites.net/api/users/request-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email }),
      });
      const result = await response.json();
      if (response.ok) {
        setOtpSent(true);
        alert('OTP sent to your email.');
      } else {
        alert(result.error || 'Failed to send OTP.');
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      alert('An error occurred while sending OTP.');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsRegistering(true);
    try {
      const response = await fetch('https://adp-backend-bzdrfdhvbhbngbgu.southindia-01.azurewebsites.net/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      if (response.ok) {
        alert('Registration successful!');
        navigate('/inventory');
      } else {
        alert(result.error || 'Registration failed.');
      }
    } catch (error) {
      console.error('Error registering user:', error);
      alert('An error occurred during registration.');
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <>
      <style>
        {`
          /* Your existing CSS styles */
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Poppins', sans-serif;
          }

          .register-page {
            position: relative;
            overflow: hidden;
          }

          #register {
            padding: 100px 0;
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
          }

          .wrapper {
            width: 100%;
            max-width: 420px;
            border: 2px solid rgba(255, 255, 255, 0.2);
            backdrop-filter: blur(15px);
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
            color: #fff;
            border-radius: 10px;
            padding: 40px;
            background-color: rgba(0, 0, 0, 0.5);
            box-sizing: border-box;
            margin: 0 auto;
          }

          .wrapper h1 {
            font-size: 28px;
            margin-bottom: 30px;
          }

          .input-box {
            position: relative;
            width: 100%;
            height: 50px;
            margin: 20px 0;
          }

          .input-box input {
            width: 100%;
            height: 100%;
            background: transparent;
            border: none;
            outline: none;
            border: 2px solid rgba(255, 255, 255, 0.2);
            border-radius: 40px;
            font-size: 16px;
            color: #fff;
            padding: 0 20px;
            box-sizing: border-box;
          }

          .input-box input::placeholder {
            color: grey;
          }

          .input-box i {
            position: absolute;
            right: 20px;
            top: 50%;
            transform: translateY(-50%);
            font-size: 20px;
            color: #fff;
          }

          .wrapper .btn {
            width: calc(100% - 20px);
            height: 45px;
            background: #fff;
            border: none;
            border-radius: 40px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            cursor: pointer;
            font-size: 16px;
            color: #333;
            font-weight: 600;
            transition: background 0.3s, color 0.3s;
            margin: 10px 0;
            padding: 0 10px;
          }

          .wrapper .btn:hover {
            background: rgba(255, 255, 255, 0.5);
            color: #fff;
          }

          /* Responsive Styles */
          @media (max-width: 768px) {
            .wrapper {
                padding: 30px;
            }

            .wrapper h1 {
                font-size: 24px;
            }

            .input-box input {
                font-size: 14px;
                padding: 0 15px;
            }

            .input-box i {
                font-size: 18px;
            }
          }

          @media (max-width: 480px) {
            .wrapper {
                padding: 20px;
            }

            .wrapper h1 {
                font-size: 20px;
            }

            .input-box input {
                font-size: 14px;
                padding: 0 15px;
            }

            .input-box i {
                font-size: 16px;
            }
          }

          /* Additional styles for verification message */
          .verification-message {
            color: #ffcc00;
            font-size: 14px;
            margin-top: 10px;
            text-align: center;
          }
        `}
      </style>
      <div className="register-page">
        <div
          id="register"
          style={{
            backgroundImage: `url(${bgImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        >
          <div className="wrapper">
            <form onSubmit={otpSent ? handleRegister : handleSendOtp}>
              <h1>Register</h1>
              <div className="input-box">
                <input
                  type="email"
                  name="email"
                  placeholder="Email ID"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={otpSent} // Disable email input if OTP is sent
                />
                <i className='bx bxs-envelope'></i>
              </div>
              <div className="input-box">
                <input
                  type="text"
                  name="cordName"
                  placeholder="Co-ordinator Name"
                  value={formData.cordName}
                  onChange={handleChange}
                  required
                />
                <i className='bx bxs-user'></i>
              </div>
              <div className="input-box">
                <input
                  type="text"
                  name="clubName"
                  placeholder="Club Name"
                  value={formData.clubName}
                  onChange={handleChange}
                  required
                />
                <i className='bx bxs-building'></i>
              </div>
              <div className="input-box">
                <input
                  type="text"
                  name="mobile"
                  placeholder="Phone Number"
                  value={formData.mobile}
                  onChange={handleChange}
                  required
                />
                <i className='bx bxs-phone'></i>
              </div>
              <div className="input-box">
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <i className='bx bxs-lock-alt'></i>
              </div>
              {otpSent && (
                <>
                  <div className="input-box">
                    <input
                      type="text"
                      name="verificationCode"
                      placeholder="Verification Code"
                      value={formData.verificationCode}
                      onChange={handleChange}
                      required
                    />
                    <i className='bx bxs-lock-alt'></i>
                  </div>
                  <p className="verification-message">
                    Please check your spam folder if you don't see the OTP in your inbox.
                  </p>
                </>
              )}
              
              {/* Button to send OTP */}
              {!otpSent && (
                <button type="button" className="btn" onClick={handleSendOtp}>
                  Get OTP At Email
                </button>
              )}

              {/* Button to resend OTP if already sent */}
              {otpSent && (
                <button type="button" className="btn" onClick={handleSendOtp}>
                  Resend OTP
                </button>
              )}

              {/* Register button only appears after OTP is sent */}
              {otpSent && (
                <button
                  type="button"
                  className="btn"
                  onClick={handleRegister}
                  disabled={isRegistering}
                >
                  {isRegistering ? 'Registering...' : 'Register'}
                </button>
              )}
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Register;
