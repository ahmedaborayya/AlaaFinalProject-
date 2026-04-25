import React from 'react';
import { BallTriangle } from 'react-loader-spinner';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet';
import API from '../../api/api';
import styles from './Categories.module.css';

const Categories = () => {
  function getCategories() {
    return API.get("/categories");
  }

  let { isLoading, data } = useQuery({ 
    queryKey: ['categories'],
    queryFn: getCategories 
  });

  return (
    <>
      <Helmet>
        <title>Categories</title>
      </Helmet>
      <div className="container py-5">
        <h2 className={styles.sectionTitle}>Shop by Category</h2>
        
        {isLoading ? (
          <div className="py-5 text-center d-flex justify-content-center">
            <BallTriangle
              height={80}
              width={80}
              radius={5}
              color="var(--primary)"
              ariaLabel="loading"
              visible={true}
            />
          </div>
        ) : (
          <div className="row g-4 mt-2">
            {data?.data?.map((ele) => (
              <div key={ele.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
                <div className={styles.categoryCard}>
                  <div className={styles.iconWrap}>
                    <i className="fa-solid fa-tags"></i>
                  </div>
                  <h3 className={styles.categoryName}>{ele.name}</h3>
                  <p className={styles.categorySlug}>{ele.slug}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default Categories;

