import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import styles from './NotFound.module.css';

const NotFound = () => {
  return (
    <>
      <Helmet>
        <title>404 – Page Not Found</title>
      </Helmet>
      <div className={styles.wrapper}>
        <div className={styles.code}>404</div>
        <div className={styles.icon}>
          <i className="fa-solid fa-face-dizzy"></i>
        </div>
        <h1 className={styles.title}>Oops! Page Not Found</h1>
        <p className={styles.sub}>
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/home" className={`btn-premium ${styles.homeBtn}`}>
          <i className="fa-solid fa-house"></i> Back to Home
        </Link>
      </div>
    </>
  );
};

export default NotFound;
