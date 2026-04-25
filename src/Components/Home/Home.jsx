import React, { useState } from "react";
import styles from "./Home.module.css";
import MainSlider from "../MainSlider/MainSlider";
import FeatureProducts from "../FeatureProducts/FeatureProducts";
import { Helmet } from "react-helmet";

const Home = () => {
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  return (
    <>
      <Helmet>
        <title>Home | Shop</title>
      </Helmet>
      <MainSlider/>
      <FeatureProducts 
        selectedCategoryId={selectedCategoryId}
        setSelectedCategoryId={setSelectedCategoryId}
      />
    </>
  );
};

export default Home;