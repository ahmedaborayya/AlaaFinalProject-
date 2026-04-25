import React, { useState } from "react";
import styles from "./Register.module.css";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import API from "../../api/api";

const Register = () => {
  let navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function callRegister(reqBody) {
    setErrorMessage("");
    setIsLoading(true);
    try {
      let { data } = await API.post(`/auth/register`, {
        name: reqBody.name,
        email: reqBody.email,
        password: reqBody.password,
      });
      if (data.userId) {
        navigate('/login');
      }
    } catch(err) {
      setErrorMessage(err.response?.data?.message || "Something went wrong");
    } finally {
       setIsLoading(false);
    }
  }

  const validationSchema = Yup.object({
    name: Yup.string().min(3,"Name is too short").max(30,"Name is too long").required("Name is required"),
    email: Yup.string().email('Email is not valid').required("Email is required"),
    password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
    rePassword: Yup.string().oneOf([Yup.ref('password')],"Passwords must match").required("Please confirm password"),
  });

  const registerForm = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      rePassword: "",
    },
    validationSchema, 
    onSubmit: callRegister
  });

  return (
    <>
      <Helmet>
        <title>Create Account | Shop</title>
      </Helmet>

      <div className={styles.authPage}>
        <div className={styles.authCard}>
          <div className={styles.authHeader}>
            <div className={styles.authIcon}>
              <i className="fa-solid fa-user-plus"></i>
            </div>
            <h1 className={styles.authTitle}>Create Account</h1>
            <p className={styles.authSubtitle}>Join us to get the best shopping experience.</p>
          </div>

          {errorMessage && (
            <div className="alert alert-danger p-2 mb-4 text-center border-0" style={{ borderRadius: 10, fontSize: 14 }}>
              {errorMessage}
            </div>
          )}
          
          <form onSubmit={registerForm.handleSubmit}>
            <div className={styles.inputGroup}>
              <label htmlFor="name" className={styles.inputLabel}>Full Name</label>
              <input
                type="text"
                name="name"
                id="name"
                className={styles.inputField}
                placeholder="John Doe"
                value={registerForm.values.name}
                onChange={registerForm.handleChange}
                onBlur={registerForm.handleBlur}
              />
              {registerForm.errors.name && registerForm.touched.name && (
                <div className={styles.errorMsg}><i className="fa-solid fa-circle-exclamation"></i> {registerForm.errors.name}</div>
              )}
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="email" className={styles.inputLabel}>Email Address</label>
              <input
                type="email"
                name="email"
                id="email"
                className={styles.inputField}
                placeholder="name@example.com"
                value={registerForm.values.email}
                onChange={registerForm.handleChange}
                onBlur={registerForm.handleBlur}
              />
              {registerForm.errors.email && registerForm.touched.email && (
                <div className={styles.errorMsg}><i className="fa-solid fa-circle-exclamation"></i> {registerForm.errors.email}</div>
              )}
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="password" className={styles.inputLabel}>Password</label>
              <input
                type="password"
                name="password"
                id="password"
                className={styles.inputField}
                placeholder="Create a password"
                value={registerForm.values.password}
                onChange={registerForm.handleChange}
                onBlur={registerForm.handleBlur}
              />
              {registerForm.errors.password && registerForm.touched.password && (
                <div className={styles.errorMsg}><i className="fa-solid fa-circle-exclamation"></i> {registerForm.errors.password}</div>
              )}
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="rePassword" className={styles.inputLabel}>Confirm Password</label>
              <input
                type="password"
                name="rePassword"
                id="rePassword"
                className={styles.inputField}
                placeholder="Confirm your password"
                value={registerForm.values.rePassword}
                onChange={registerForm.handleChange}
                onBlur={registerForm.handleBlur}
              />
              {registerForm.errors.rePassword && registerForm.touched.rePassword && (
                <div className={styles.errorMsg}><i className="fa-solid fa-circle-exclamation"></i> {registerForm.errors.rePassword}</div>
              )}
            </div>

            <button 
              className={`btn-premium ${styles.submitBtn}`} 
              disabled={isLoading || !(registerForm.isValid && registerForm.dirty)}
            >
              {isLoading ? <i className="fa fa-spinner fa-spin"></i> : 'Create Account'}
            </button>
        
            <div className={styles.authFooter}>
              Already have an account? 
              <Link to="/login" className={styles.authLink}>Sign In</Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Register;

