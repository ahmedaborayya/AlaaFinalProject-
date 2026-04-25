import React, { useContext, useState } from 'react';
import styles from './Login.module.css';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { TockenContext } from '../../Context/Token';
import API from '../../api/api';

const Login = () => {
  let navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  let { setToken } = useContext(TockenContext);

  async function callLogin(reqBody) {
    setErrorMessage("");
    setIsLoading(true);
    
    try {
      let { data } = await API.post(`/auth/login`, reqBody);
      if (data.token) {
        localStorage.setItem("userToken", data.token);
        setToken(data.token);
        navigate('/home');
      }
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  }

  const validationSchema = Yup.object({
    email: Yup.string().email('Email is not valid').required("Email is required"),
    password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
  });

  const loginForm = useFormik({
    initialValues: {
      email: "",
      password: ""
    },
    validationSchema, 
    onSubmit: callLogin
  });

  return (
    <>
      <Helmet>
        <title>Login | Shop</title>
      </Helmet>
      
      <div className={styles.authPage}>
        <div className={styles.authCard}>
          <div className={styles.authHeader}>
            <div className={styles.authIcon}>
              <i className="fa-solid fa-user"></i>
            </div>
            <h1 className={styles.authTitle}>Welcome Back</h1>
            <p className={styles.authSubtitle}>Please enter your details to sign in.</p>
          </div>

          {errorMessage && (
            <div className="alert alert-danger p-2 mb-4 text-center border-0" style={{ borderRadius: 10, fontSize: 14 }}>
              {errorMessage}
            </div>
          )}

          <form onSubmit={loginForm.handleSubmit}>
            <div className={styles.inputGroup}>
              <label htmlFor="email" className={styles.inputLabel}>Email Address</label>
              <input
                type="email"
                name="email"
                id="email"
                className={styles.inputField}
                placeholder="name@example.com"
                value={loginForm.values.email}
                onChange={loginForm.handleChange}
                onBlur={loginForm.handleBlur}
              />
              {loginForm.errors.email && loginForm.touched.email && (
                <div className={styles.errorMsg}><i className="fa-solid fa-circle-exclamation"></i> {loginForm.errors.email}</div>
              )}
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="password" className={styles.inputLabel}>Password</label>
              <input
                type="password"
                name="password"
                id="password"
                className={styles.inputField}
                placeholder="Enter your password"
                value={loginForm.values.password}
                onChange={loginForm.handleChange}
                onBlur={loginForm.handleBlur}
              />
              {loginForm.errors.password && loginForm.touched.password && (
                <div className={styles.errorMsg}><i className="fa-solid fa-circle-exclamation"></i> {loginForm.errors.password}</div>
              )}
            </div>

            <button
              disabled={isLoading || !(loginForm.isValid && loginForm.dirty)}
              type="submit"
              className={`btn-premium ${styles.submitBtn}`}
            >
              {isLoading ? <i className="fa fa-spinner fa-spin"></i> : 'Sign In'}
            </button>

            <div className={styles.authFooter}>
              Don't have an account? 
              <Link to="/register" className={styles.authLink}>Sign Up</Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Login;
