import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet';
import { BallTriangle } from 'react-loader-spinner';
import axios from 'axios';
import styles from './Brands.module.css';

const Brands = () => {
  function getBrands() {
    return axios.get("https://ecommerce.routemisr.com/api/v1/brands");
  }

  let { isLoading, data } = useQuery({
    queryKey: ['brands'],
    queryFn: getBrands,
  });

  return (
    <>
      <Helmet>
        <title>Brands | Shop</title>
      </Helmet>

      {/* Hero */}
      <div className={styles.hero}>
        <div className="container">
          <span className={styles.heroBadge}>Our Partners</span>
          <h1 className={styles.heroTitle}>Shop by Brand</h1>
          <p className={styles.heroSub}>Discover top brands trusted by millions of customers worldwide.</p>
        </div>
      </div>

      <div className={`container page-enter ${styles.pageBody}`}>
        {isLoading ? (
          <div className="py-5 d-flex justify-content-center">
            <BallTriangle height={80} width={80} radius={5} color="var(--primary)" ariaLabel="loading" visible />
          </div>
        ) : (
          <div className="row g-4">
            {data?.data?.data.map((ele) => (
              <div key={ele._id} className="col-6 col-sm-4 col-md-3 col-lg-2">
                <div className={styles.brandCard}>
                  <div className={styles.brandImgWrap}>
                    <img src={ele.image} className={styles.brandImg} alt={ele.name} />
                  </div>
                  <span className={styles.brandName}>{ele.name}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Brands;
