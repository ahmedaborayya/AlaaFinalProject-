import React from 'react';
import FeatureProducts from '../FeatureProducts/FeatureProducts';
import { Helmet } from 'react-helmet';

const Products = () => {
  return (
    <>
      <Helmet>
        <title>Products Page</title>
      </Helmet>
      <FeatureProducts />
    </>
  );
}

export default Products;
