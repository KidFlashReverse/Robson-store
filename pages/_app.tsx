import type { AppProps } from 'next/app'
import '../styles/global.css'
import Layout from '../components/Layout'
import AuthProvider from '../components/AuthProvider'
import { NextPage } from 'next';
import { ReactElement, ReactNode } from 'react';

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};
 
export default function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = 
    Component.getLayout ||
    (Component.getLayout = function getLayout(page) {
      return (
        <Layout>
          <Component {...pageProps} />
        </Layout>
      ) 
    });

  return getLayout(<Component {...pageProps} />);
}