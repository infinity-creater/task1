import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { User, Building, Mail, Lock, LogIn, UserPlus, ArrowLeft, Wrench, ShieldAlert, Users, Laptop, Shield, Headphones } from 'lucide-react';

export default function LoginView() {
  const { login, register } = useContext(AppContext);
  const [isRegistering, setIsRegistering] = useState(false);

  // Sign In fields
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register fields
  const [regName, setRegName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regDept, setRegDept] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');

  // Error/Success state
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSignIn = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!loginUsername || !loginPassword) {
      setError('Please fill in all fields');
      return;
    }

    const res = login(loginUsername, loginPassword);
    res.then(result => {
      if (!result.success) {
        setError(result.message);
      }
    });
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!regName || !regUsername || !regPassword || !regConfirmPassword || !regDept) {
      setError('All fields are required except Email');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setError('Passwords do not match');
      return;
    }

    const res = register(regUsername, regPassword, regName, regDept, regEmail);
    res.then(result => {
      if (result.success) {
        setSuccess('Account created successfully! You can now sign in.');
        setIsRegistering(false);
        setLoginUsername(regUsername);
        setLoginPassword('');
        setRegName('');
        setRegUsername('');
        setRegEmail('');
        setRegDept('');
        setRegPassword('');
        setRegConfirmPassword('');
      } else {
        setError(result.message);
      }
    });
  };

  const triggerQuickLogin = (username, password) => {
    setError('');
    setSuccess('');
    login(username, password);
  };

  const getRoleTitle = () => 'Login';

  return (
    <div className="login-wrapper">
      <div className="login-bg-glow"></div>
      <div className="login-bg-glow-2"></div>

      <div className="login-card">
        <div className="login-header" style={{ marginTop: '16px' }}>
          <h2>{getRoleTitle()}</h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '6px', fontSize: '0.9rem' }}>
            {isRegistering ? 'Create your account' : 'Enter your credentials to connect'}
          </p>
        </div>

          {error && (
            <div className="alert-box alert-error">
              {error}
            </div>
          )}

          {success && (
            <div className="alert-box alert-success">
              {success}
            </div>
          )}

          {!isRegistering ? (
            /* Sign In Form */
            <form onSubmit={handleSignIn}>
              <div className="form-group">
                <label className="form-label">Username</label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder={`e.g. jdoe`}
                    value={loginUsername}
                    onChange={(e) => setLoginUsername(e.target.value)}
                    style={{ paddingLeft: '40px' }}
                  />
                  <User size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type="password" 
                    className="form-control" 
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    style={{ paddingLeft: '40px' }}
                  />
                  <Lock size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                </div>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px', height: '46px' }}>
                <LogIn size={18} />
                <span>Sign In</span>
              </button>

              <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>New here? </span>
                <button 
                  type="button" 
                  onClick={() => { setIsRegistering(true); setError(''); }}
                  style={{ background: 'transparent', border: 'none', color: 'var(--primary)', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-primary)' }}
                >
                  Register Here
                </button>
              </div>
            </form>
          ) : (
            /* Registration Form */
            <form onSubmit={handleRegister}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="John Doe"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    style={{ paddingLeft: '40px' }}
                  />
                  <User size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Username</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="username"
                    value={regUsername}
                    onChange={(e) => setRegUsername(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Department</label>
                  <div style={{ position: 'relative' }}>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="Marketing, HR, etc."
                      value={regDept}
                      onChange={(e) => setRegDept(e.target.value)}
                      style={{ paddingLeft: '40px' }}
                    />
                    <Building size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Email (Optional)</label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type="email" 
                    className="form-control" 
                    placeholder="john.doe@company.com"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    style={{ paddingLeft: '40px' }}
                  />
                  <Mail size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Password</label>
                  <input 
                    type="password" 
                    className="form-control" 
                    placeholder="••••••••"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Confirm Password</label>
                  <input 
                    type="password" 
                    className="form-control" 
                    placeholder="••••••••"
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px', height: '46px' }}>
                <UserPlus size={18} />
                <span>Create Account</span>
              </button>

              <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Already have an account? </span>
                <button 
                  type="button" 
                  onClick={() => { setIsRegistering(false); setError(''); }}
                  style={{ background: 'transparent', border: 'none', color: 'var(--primary)', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-primary)' }}
                >
                  Sign In
                </button>
              </div>
            </form>
          )}


        </div>
      )}

      {/* Styled tags for role landing layouts */}
      <style>{`
        .role-selection-card {
          width: 100%;
          max-width: 950px;
          background-color: rgba(19, 26, 43, 0.75);
          border: 1px solid var(--border-color);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-radius: 24px;
          padding: 50px 40px;
          box-shadow: var(--shadow-lg), 0 0 40px rgba(0, 0, 0, 0.4);
          z-index: 2;
          transition: var(--transition);
        }
        body.light .role-selection-card {
          background-color: rgba(255, 255, 255, 0.85);
          box-shadow: var(--shadow-lg), 0 10px 30px rgba(15, 23, 42, 0.05);
        }
        .portal-title {
          font-size: 2.25rem;
          font-weight: 800;
          background: linear-gradient(135deg, #6366f1 30%, #a855f7 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          text-align: center;
        }
        .portal-subtitle {
          color: var(--text-secondary);
          margin-top: 10px;
          font-size: 1.05rem;
          text-align: center;
        }
        .role-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          margin-top: 40px;
        }
        @media (max-width: 768px) {
          .role-grid {
            grid-template-columns: 1fr;
          }
          .role-selection-card {
            padding: 30px 20px;
          }
        }
        .role-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 20px;
          padding: 40px 24px;
          border-radius: 20px;
          background-color: var(--bg-secondary);
          border: 1px solid var(--border-color);
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .role-card:hover {
          border-color: var(--primary);
          box-shadow: var(--shadow-glow);
          transform: translateY(-6px);
        }
        .role-icon-bg {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: all 0.3s ease;
        }
        .role-icon-bg.employee-icon {
          background: rgba(99, 102, 241, 0.15);
          color: #6366f1;
        }
        .role-card:hover .employee-icon {
          background: #6366f1;
          color: #ffffff;
          box-shadow: 0 0 20px rgba(99, 102, 241, 0.4);
        }
        .role-icon-bg.support-icon {
          background: rgba(6, 182, 212, 0.15);
          color: #06b6d4;
        }
        .role-card:hover .support-icon {
          background: #06b6d4;
          color: #ffffff;
          box-shadow: 0 0 20px rgba(6, 182, 212, 0.4);
        }
        .role-icon-bg.admin-icon {
          background: rgba(217, 70, 239, 0.15);
          color: #d946ef;
        }
        .role-card:hover .admin-icon {
          background: #d946ef;
          color: #ffffff;
          box-shadow: 0 0 20px rgba(217, 70, 239, 0.4);
        }
        .role-info h3 {
          font-size: 1.25rem;
          font-weight: 700;
          margin-bottom: 8px;
        }
        .role-info p {
          font-size: 0.875rem;
          color: var(--text-secondary);
          line-height: 1.5;
        }
        .back-link-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-family: var(--font-primary);
          font-size: 0.85rem;
          font-weight: 500;
          background: transparent;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
          transition: var(--transition);
        }
        .back-link-btn:hover {
          color: var(--primary);
        }
        .alert-box {
          padding: 12px 16px; 
          border-radius: var(--input-radius); 
          margin-bottom: 20px; 
          font-size: 0.85rem;
          border: 1px solid;
        }
        .alert-error {
          background-color: rgba(239, 68, 68, 0.1); 
          color: var(--danger); 
          border-color: rgba(239, 68, 68, 0.2);
        }
        .alert-success {
          background-color: rgba(16, 185, 129, 0.1); 
          color: var(--success); 
          border-color: rgba(16, 185, 129, 0.2);
        }
      `}</style>
    </div>
  );
}
