import React, { useContext, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { BallTriangle } from "react-loader-spinner";
import { CartContent } from "../../Context/cartContent";
import toast from "react-hot-toast";
import { Helmet } from "react-helmet";
import API from "../../api/api";
import styles from "./Details.module.css";

function Details() {
  const [details, setDetails] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  let { addToCart } = useContext(CartContent);

  let params = useParams();

  async function getProductDetails() {
    try {
      let { data } = await API.get(`/products/${params.id}`);
      setDetails(data);
    } catch (err) {
      console.error("Error fetching product:", err);
    } finally {
      setIsLoading(false);
    }
  }

  function addCart() {
    addToCart(details);
    toast.success(`${details.name} added to cart!`);
  }

  useEffect(() => {
    getProductDetails();
  }, []);

  return (
    <>
      <div className="container">
        {isLoading ? (
          <div className="py-5 d-flex justify-content-center">
            <BallTriangle
              height={100}
              width={100}
              radius={5}
              color="var(--primary)"
              ariaLabel="loading"
              visible={true}
            />
          </div>
        ) : (
          <div className={styles.detailsWrap}>
            <Helmet>
              <title>{details.name} | Shop</title>
            </Helmet>
            <div className="row g-0">
              {/* Image Section */}
              <div className="col-md-6">
                <div className={styles.imageSection}>
                  <img
                    src={details.imageUrl || 'https://via.placeholder.com/500'}
                    className={styles.mainImage}
                    alt={details.name}
                  />
                </div>
              </div>

              {/* Info Section */}
              <div className="col-md-6">
                <div className={styles.infoSection}>
                  {details.category?.name && (
                    <span className={styles.categoryLabel}>{details.category.name}</span>
                  )}
                  
                  <h1 className={styles.title}>{details.name}</h1>
                  
                  <div className={styles.priceWrap}>
                    <span className={styles.price}>{Number(details.price).toFixed(2)} EGP</span>
                  </div>

                  <p className={styles.description}>{details.description}</p>

                  <div className={styles.metaWrap}>
                    <div className={styles.metaItem}>
                      <div className={styles.metaIcon}><i className="fa-solid fa-boxes-stacked"></i></div>
                      <div className={styles.metaText}>
                        <span className={styles.metaLabel}>Availability</span>
                        <span className={styles.metaValue} style={{ color: details.stock > 0 ? 'var(--secondary)' : '#ef4444' }}>
                          {details.stock > 0 ? `${details.stock} in stock` : 'Out of stock'}
                        </span>
                      </div>
                    </div>
                    <div className={styles.metaItem}>
                      <div className={styles.metaIcon}><i className="fa-solid fa-truck-fast"></i></div>
                      <div className={styles.metaText}>
                        <span className={styles.metaLabel}>Shipping</span>
                        <span className={styles.metaValue}>Free Delivery</span>
                      </div>
                    </div>
                  </div>

                  <div className={styles.actionArea}>
                    <button 
                      onClick={addCart} 
                      className={`btn-premium ${styles.btnLarge}`}
                      disabled={details.stock === 0}
                    >
                      <i className="fa-solid fa-cart-plus"></i>
                      {details.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Details;



