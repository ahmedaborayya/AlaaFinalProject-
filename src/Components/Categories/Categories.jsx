import React, { useState } from 'react';
import { BallTriangle } from 'react-loader-spinner';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import API, { getImageUrl } from '../../api/api';
import styles from './Categories.module.css';

// Category icons mapped by slug keyword
const CATEGORY_ICONS = {
  cpus:               'fa-microchip',
  motherboards:       'fa-server',
  ram:                'fa-memory',
  storage:            'fa-hard-drive',
  gpus:               'fa-display',
  cooling:            'fa-snowflake',
  'computer-cases':   'fa-box',
  laptops:            'fa-laptop',
  accessories:        'fa-headphones',
  monitors:           'fa-desktop',
  'prebuilt-computers': 'fa-computer',
  uncategorized:      'fa-tags',
};

function getCategoryIcon(slug) {
  for (const [key, icon] of Object.entries(CATEGORY_ICONS)) {
    if (slug?.toLowerCase().includes(key)) return icon;
  }
  return 'fa-tags';
}

/** Convert any YouTube URL to an embed URL */
function toEmbedUrl(url) {
  if (!url) return null;
  // Already an embed
  if (url.includes('youtube.com/embed/')) return url;
  // youtu.be short link
  const shortMatch = url.match(/youtu\.be\/([^?&]+)/);
  if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}`;
  // Standard watch URL
  const watchMatch = url.match(/[?&]v=([^?&]+)/);
  if (watchMatch) return `https://www.youtube.com/embed/${watchMatch[1]}`;
  // Direct video file or other embed
  return url;
}

function ProductMiniCard({ product }) {
  const img = product.images?.[0]?.imageUrl
    ? getImageUrl(product.images[0].imageUrl)
    : getImageUrl(product.imageUrl);

  return (
    <Link to={`/details/${product.id}`} className={styles.miniCardLink}>
      <div className={styles.miniCard}>
        <div className={styles.miniImgWrap}>
          <img
            src={img || 'https://placehold.co/120x120?text=No+Image'}
            alt={product.name}
            className={styles.miniImg}
            onError={e => { e.target.src = 'https://placehold.co/120x120?text=No+Image'; }}
          />
        </div>
        <div className={styles.miniInfo}>
          <div className={styles.miniName}>{product.name}</div>
          <div className={styles.miniPrice}>{Number(product.price).toLocaleString()} EGP</div>
        </div>
      </div>
    </Link>
  );
}

function CategoryProducts({ categoryId }) {
  const { isLoading, data } = useQuery({
    queryKey: ['categoryProducts', categoryId],
    queryFn: () => API.get(`/products?categoryId=${categoryId}`),
    staleTime: 60000,
  });

  if (isLoading) {
    return (
      <div className={styles.productsLoading}>
        <BallTriangle height={50} width={50} radius={5} color="var(--primary)" ariaLabel="loading" visible />
      </div>
    );
  }

  const products = data?.data || [];

  if (products.length === 0) {
    return (
      <div className={styles.noProducts}>
        <i className="fa-solid fa-box-open"></i>
        <p>No products in this category yet.</p>
      </div>
    );
  }

  return (
    <div className={styles.miniGrid}>
      {products.map(p => <ProductMiniCard key={p.id} product={p} />)}
    </div>
  );
}

const Categories = () => {
  const [selected, setSelected] = useState(null); // selected category object

  const { isLoading, data } = useQuery({
    queryKey: ['categories'],
    queryFn: () => API.get('/categories'),
  });

  const categories = data?.data || [];

  function handleSelect(cat) {
    setSelected(prev => prev?.id === cat.id ? null : cat);
  }

  const embedUrl = toEmbedUrl(selected?.videoUrl);

  return (
    <>
      <Helmet>
        <title>Categories | Tech Engine</title>
      </Helmet>

      <div className={styles.pageWrap}>
        {/* ── Hero Header ── */}
        <div className={styles.pageHero}>
          <div className="container">
            <h1 className={styles.heroTitle}>
              <i className="fa-solid fa-layer-group"></i> Shop by Category
            </h1>
            <p className={styles.heroSub}>
              Browse our full range of tech products across {categories.length} categories
            </p>
          </div>
        </div>

        <div className="container">
          {isLoading ? (
            <div className="py-5 text-center d-flex justify-content-center">
              <BallTriangle height={80} width={80} radius={5} color="var(--primary)" ariaLabel="loading" visible />
            </div>
          ) : (
            <>
              {/* ── Category Grid ── */}
              <div className={styles.categoryGrid}>
                {categories.map(cat => {
                  const isActive = selected?.id === cat.id;
                  return (
                    <button
                      key={cat.id}
                      className={`${styles.categoryCard} ${isActive ? styles.cardActive : ''}`}
                      onClick={() => handleSelect(cat)}
                      aria-expanded={isActive}
                    >
                      <div className={styles.cardIconWrap}>
                        <i className={`fa-solid ${getCategoryIcon(cat.slug)}`}></i>
                      </div>
                      <div className={styles.cardBody}>
                        <h3 className={styles.cardName}>{cat.name}</h3>
                        <span className={styles.cardCount}>
                          {cat._count?.products ?? 0} products
                        </span>
                      </div>
                      {cat.videoUrl && (
                        <span className={styles.videoBadge} title="Video available">
                          <i className="fa-solid fa-circle-play"></i>
                        </span>
                      )}
                      <i className={`fa-solid ${isActive ? 'fa-chevron-up' : 'fa-chevron-down'} ${styles.cardChevron}`}></i>
                    </button>
                  );
                })}
              </div>

              {/* ── Expanded Panel ── */}
              {selected && (
                <div className={styles.expandPanel} key={selected.id}>
                  {/* Panel header */}
                  <div className={styles.panelHeader}>
                    <div className={styles.panelTitle}>
                      <i className={`fa-solid ${getCategoryIcon(selected.slug)}`}></i>
                      <span>{selected.name}</span>
                      <span className={styles.panelCount}>{selected._count?.products ?? 0} products</span>
                    </div>
                    <button className={styles.panelClose} onClick={() => setSelected(null)}>
                      <i className="fa-solid fa-xmark"></i> Close
                    </button>
                  </div>

                  <div className={styles.panelBody}>
                    {/* Video embed */}
                    {embedUrl && (
                      <div className={styles.videoSection}>
                        <div className={styles.videoHeader}>
                          <i className="fa-brands fa-youtube"></i>
                          <span>Category Video</span>
                        </div>
                        <div className={styles.videoWrapper}>
                          <iframe
                            src={embedUrl}
                            title={`${selected.name} video`}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className={styles.videoFrame}
                          ></iframe>
                        </div>
                      </div>
                    )}

                    {/* Product mini-grid */}
                    <div className={styles.productsSection}>
                      <div className={styles.productsSectionHeader}>
                        <h4 className={styles.productsSectionTitle}>Products in {selected.name}</h4>
                        <Link
                          to={`/Products`}
                          className={styles.viewAllBtn}
                          onClick={() => {/* navigate to products filtered */}}
                        >
                          View All <i className="fa-solid fa-arrow-right"></i>
                        </Link>
                      </div>
                      <CategoryProducts categoryId={selected.id} />
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Categories;
