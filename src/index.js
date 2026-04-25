import React from 'react';
import ReactDOM from 'react-dom/client';

import 'bootstrap/dist/css/bootstrap.min.css'
import '@fortawesome/fontawesome-free/css/all.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";


import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import CounterContextProvider from './Context/Counter';
import TockenContextProvider from './Context/Token';

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import CartContentProvider from './Context/cartContent';



const root = ReactDOM.createRoot(document.getElementById('root'));
const query = new QueryClient();

root.render(
  <CartContentProvider>
  <QueryClientProvider client={query}>
    <TockenContextProvider>
      <CounterContextProvider>
        <App/>
      </CounterContextProvider>
    </TockenContextProvider>
     <ReactQueryDevtools initialIsOpen={false}/> 
  </QueryClientProvider>
  </CartContentProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
