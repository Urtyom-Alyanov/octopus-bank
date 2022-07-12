import NextApp from 'next/app';
import '@/client/styles/index.scss';
import '@/client/fonts/vk-sans/stylesheets.css';
import '@/client/fonts/icomoon/style.css';
import '@/client/fonts/sfui/stylesheet.css';
import Head from 'next/head';
import { Hydrate, QueryClient, QueryClientProvider } from 'react-query';

class PbmApiFrontendApp extends NextApp {
  componentDidMount(): void {
    const appElement = document.querySelector('#__next');
    appElement.classList.add('h-full');
  }

  state: Readonly<{ queryClient: QueryClient }> = {
    queryClient: new QueryClient(),
  };

  render(): JSX.Element {
    const Component = this.props.Component;
    const pageProps = this.props.pageProps;
    return (
      <>
        <Head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin=""
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap"
            rel="stylesheet"
          ></link>
          <meta charSet="utf-8" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <meta
            name="viewport"
            content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no"
          />
          <meta name="description" content="Банк Мемного Мира" />
          <meta name="theme-color" content="#ff2a3c" />
          <title>Народный Банк Мемов</title>
          <link rel="manifest" href="/manifest.json" />
        </Head>
        <QueryClientProvider client={this.state.queryClient}>
          <Hydrate state={pageProps.dehydratedState}>
            <Component {...pageProps} />
          </Hydrate>
        </QueryClientProvider>
      </>
    );
  }
}

export default PbmApiFrontendApp;
