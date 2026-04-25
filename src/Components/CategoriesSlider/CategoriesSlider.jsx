import React from 'react';
import styles from './CategoriesSlider.module.css';
import { useQuery } from '@tanstack/react-query';
import API from '../../api/api';

export default function CategoriesSlider({ selectedCategoryId, setSelectedCategoryId }) {

  function getCategories() {
    return API.get(`/categories`);
  }
  
  const { data, isLoading } = useQuery({
    queryKey: ['allCategories'],
    queryFn: getCategories
  }); 
  
  if (isLoading || !data?.data) return null;

  return (
    <div className={`container ${styles.sliderWrap}`}>
      <div className={styles.filterContainer}>
        <button 
          className={`${styles.filterBtn} ${selectedCategoryId === null ? styles.selected : ''}`}
          onClick={() => setSelectedCategoryId && setSelectedCategoryId(null)}
        >
          All
        </button>

        {data.data.map((ele) => (
          <button 
            key={ele.id}
            className={`${styles.filterBtn} ${selectedCategoryId === ele.id ? styles.selected : ''}`}
            onClick={() => setSelectedCategoryId && setSelectedCategoryId(ele.id)}
          >
            {ele.name}
          </button>
        ))}
      </div>
    </div>
  );
}

