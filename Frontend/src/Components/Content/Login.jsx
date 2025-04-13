import React, { useState } from 'react';
import 'boxicons/css/boxicons.min.css';
import { FaWhatsapp } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import bgImage from '../../assets/bg.jpg'; 

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State for toggling password visibility

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('https://adp-backend-bzdrfdhvbhbngbgu.southindia-01.azurewebsites.net/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store the JWT token and user info in local storage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user)); // Storing user information

        setTimeout(() => {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          console.log('Token and user data have been removed from local storage after 1 hour.');
          alert('Your session has expired.');
          navigate('/inventory'); // Redirect user to the inventory or login page after expiry
        }, 3600000);

        // Navigate based on the user's access level
        if (data.user.access === 'user') {
          navigate('/inventoryuser');
        } else if (data.user.access === 'bosslevel') {
          navigate('/inventoryadp');
        } else {
          alert('Unknown access level');
        }
      } else {
        alert(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('An error occurred during login.');
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
        <form onSubmit={handleSubmit}>
          <h1>Login</h1>
          <div className="input-box">
            <input
              type="email" // Changed type to 'email' for better validation
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required // Added required attribute for form validation
            />
            <i className='bx bxs-envelope'></i> {/* Updated icon to an envelope for email */}
          </div>
          <div className="input-box">
            <input
              type={showPassword ? "text" : "password"} // Toggle between text and password
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required // Added required attribute for form validation
            />
            {/* Removed the lock icon */}
            <i 
              className={`bx ${showPassword ? 'bx-show' : 'bx-hide'} eye-icon`} // Toggle eye icon
              onClick={togglePasswordVisibility} // Toggle password visibility
              title={showPassword ? "Hide Password" : "Show Password"} // Tooltip for accessibility
            ></i>
          </div>
          <div style={{fontSize:12}} className="remember-forget" >
            <label>
              <input type="checkbox" />
              Remember me
            </label>
            <a href="/forgpass">Forget Password?</a>
          </div>
          <button type="submit" style={{marginTop: '24px'}}className="btn">Login</button>
          <div className="register-link">
            <p>Don't have an account? <a href="/register">Register</a></p>
          </div>
          <p style={{fontSize:12, color:'silver'}}>Login is available exclusively to coordinators of the respective clubs or departments using respective BITS OR OASIS email ID </p>
          <div className="tech-support">
            <p>Tech Support <a href="http://wasap.my/919937020000"><FaWhatsapp className="icon-glow text-silver-700 hover:text-silver-500" /></a></p>
          </div>
        </form>
      </div>

      {/* CSS for Login page */}
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
          outline: none; /* Remove default outline */
          transition: border-color 0.3s;
        }

        .input-box input:focus {
          border-color: #fff; /* Highlight border on focus */
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
          color: #fff;
        }

        .eye-icon {
          position: absolute;
          right: 15px; /* Adjusted to replace the lock icon's position */
          top: 50%;
          transform: translateY(-50%);
          font-size: 1.25rem;
          cursor: pointer;
          color: #fff; /* Ensure the eye icon is visible */
        }

        .wrapper .remember-forget {
          display: flex;
          justify-content: space-between;
          font-size: 0.9rem;
          margin: 10px 0;
          flex-wrap: wrap;
        }

        .remember-forget label input {
          accent-color: #fff;
          margin-right: 3px;
        }

        .remember-forget a {
          color: #fff;
          text-decoration: none;
        }

        .remember-forget a:hover {
          text-decoration: underline;
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
          background: rgba(255, 255, 255, 0.5);
          color: #fff;
        }

        .wrapper .register-link {
          font-size: 0.9rem;
          text-align: center;
          margin: 20px 0;
        }

        .register-link p a {
          color: #fff;
          text-decoration: none;
          font-weight: 600;
        }

        .register-link p a:hover {
          text-decoration: underline;
        }

        .wrapper .tech-support {
          font-size: 1rem;
          text-align: center;
          margin: 20px 0;
          color: grey;
        }

        .tech-support p a {
          color: #fff;
          text-decoration: none;
          font-weight: 600;
          padding-left: 8px;
        }  @media (max-width: 768px) {
          .wrapper {
            padding: 20px;
            margin: 20px;
          }

          .wrapper h1 {
            font-size: 1.75rem;
          }

          .input-box input {
            font-size: 0.875rem;
            padding: 0 15px;
          }

          .input-box i {
            font-size: 1rem;
          }

          .remember-forget {
            font-size: 0.8rem;
          }

          .wrapper .register-link {
            font-size: 0.8rem;
          }

          .wrapper .tech-support {
            font-size: 0.875rem;
          }
        }

        @media (max-width: 480px) {
          .wrapper {
            padding: 15px;
            margin: 10px;
          }

          .wrapper h1 {
            font-size: 1.5rem;
          }

          .input-box input {
            font-size: 0.75rem;
            padding: 0 10px;
          }

          .input-box i {
            font-size: 0.875rem;
          }

          .remember-forget {
            font-size: 0.7rem;
            flex-direction: column;
            align-items: flex-start;
          }

          .remember-forget a {
            margin-top: 10px;
          }

          .wrapper .register-link {
            font-size: 0.7rem;
          }

          .wrapper .tech-support {
            font-size: 0.75rem;
          }
        }
      `}</style>
    </div>
  );
}

export default Login;
