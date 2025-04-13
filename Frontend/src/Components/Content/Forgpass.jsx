import React, { useState, useEffect } from 'react';
import 'boxicons/css/boxicons.min.css';
import { FaWhatsapp } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import bgImage from '../../assets/bg.jpg'; 

function Forgpass() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [verificationCode, setOtp] = useState('');
  const [newPassword, setPassword] = useState('');
  const [showOtpAndPassword, setShowOtpAndPassword] = useState(false);
  const [resendEnabled, setResendEnabled] = useState(false);
  const [timer, setTimer] = useState(30);

  useEffect(() => {
    let interval;
    if (!resendEnabled && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }

    if (timer === 0) {
      setResendEnabled(true);
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [timer, resendEnabled]);

  const handleGenerateOtp = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://adp-backend-bzdrfdhvbhbngbgu.southindia-01.azurewebsites.net/api/users/request-code-pass-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        console.log("OTP generated and sent to:", email);
        setShowOtpAndPassword(true);
        setResendEnabled(false);
        setTimer(30);
      } else {
        console.error("Failed to generate OTP");
        // Handle failure (e.g., display an error message to the user)
      }
    } catch (error) {
      console.error("Error generating OTP:", error);
      // Handle error (e.g., network error)
    }
  };

  const handleResendOtp = async () => {
    try {
      const response = await fetch('https://adp-backend-bzdrfdhvbhbngbgu.southindia-01.azurewebsites.net/api/users/request-code-pass-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        console.log("OTP generated and sent to:", email);
        setShowOtpAndPassword(true);
        setResendEnabled(false);
        setTimer(30);
      } else {
        console.error("Failed to generate OTP");
        // Handle failure (e.g., display an error message to the user)
      }
    } catch (error) {
      console.error("Error generating OTP:", error);
      // Handle error (e.g., network error)
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const response = await fetch('https://adp-backend-bzdrfdhvbhbngbgu.southindia-01.azurewebsites.net/api/users/reset-password', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email,
                newPassword,
                verificationCode
            }),
        });

        // Log the raw response text for better debugging
        const responseText = await response.text(); // Get the response as text

        console.log("Response status:", response.status);  // Log response status
        console.log("Response body:", responseText); // Log the raw response body

        if (response.ok) {
            const responseData = JSON.parse(responseText); // Parse JSON response
            console.log("Password reset successful for:", email);
            console.log("Server response:", responseData); // Log the server response
            navigate('/inventory'); // Redirect to the login page
        } else {
            console.error("Failed to reset password:", responseText); // Log error details
        }
    } catch (error) {
        console.error("Error resetting password:", error); // Handle any fetch errors
    }
};
  

  return (
    <div className='wrapper-pro' style={{
      backgroundImage: `url(${bgImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
    }}>
      <div className="wrapper">
        <form onSubmit={showOtpAndPassword ? handleSubmit : handleGenerateOtp}>
          <h1>Reset Password</h1>
          <div className="input-box">
            <input
              type="text"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={showOtpAndPassword} 
            />
            <i className='bx bxs-user'></i>
          </div>
          {showOtpAndPassword && (
            <>
              <div className="input-box">
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={verificationCode}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
                <i className='bx bxs-lock-alt'></i>
              </div>
              <div className="input-box">
                <input
                  type="password"
                  placeholder="Create New Password"
                  value={newPassword}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <i className='bx bxs-lock-alt'></i>
              </div>
            </>
          )}
          <button type="submit" className="btn">{showOtpAndPassword ? "Submit" : "Generate OTP"}</button>
          {showOtpAndPassword && (
            <div className="tech-support">
              <button
                type="button"
                className="btn resend-btn"
                onClick={handleResendOtp}
                disabled={!resendEnabled}
              >
                Resend OTP
              </button>
              { !resendEnabled && <span style={{ marginLeft: '10px' }}>{` (${timer}s)`}</span> }
            </div>
          )}
        </form>
      </div>

      {/* CSS for Reset Password page */}
      <style jsx='true'>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: 'Poppins', sans-serif;
        }

        .wrapper-pro {
          position: relative;
          overflow: hidden;
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background-size: cover;
        }

        .wrapper {
          width: 90%;
          max-width: 420px;
          background: rgba(0, 0, 0, 0.5);
          border: 2px solid rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(15px);
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
          color: #fff;
          border-radius: 10px;
          padding: 20px;
          margin: 20px auto;
          text-align: center;
        }

        .wrapper h1 {
          font-size: 2rem;
          margin-bottom: 1.5rem;
        }

        .input-box {
          position: relative;
          width: 100%;
          height: 50px;
          margin: 15px 0;
        }

        .input-box input {
          width: 100%;
          height: 100%;
          background: transparent;
          border: 2px solid rgba(255, 255, 255, 0.2);
          border-radius: 40px;
          font-size: 1rem;
          color: #fff;
          padding: 0 20px;
        }

        .input-box input::placeholder {
          color: grey;
        }

        .input-box i {
          position: absolute;
          right: 15px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 1.25rem;
        }

        .wrapper .btn {
          width: 100%;
          height: 45px;
          background: #fff;
          border: none;
          border-radius: 40px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          cursor: pointer;
          font-size: 1rem;
          color: #333;
          font-weight: 600;
          transition: background 0.3s, color 0.3s;
        }

        .wrapper .btn:hover {
          background: purple;
          color: #fff;
        }

        .tech-support {
          width: 100%;
          height: 45px;
          background: #fff;
          border: none;
          border-radius: 40px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          cursor: pointer;
          font-size: 1rem;
          color: #333;
          font-weight: 600;
          transition: background 0.3s, color 0.3s;
          margin-top:20px
        }

        .tech-support .resend-btn {
         background: rgba(255, 255, 255, 0.5);
         color: #333; 
}

            .tech-support .resend-btn:hover {
            background: purple;
            color: #ffffff;
            }

        .tech-support .resend-btn:disabled {
          background: grey;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}

export default Forgpass;
