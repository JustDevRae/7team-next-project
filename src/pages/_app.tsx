import "@mantine/core/styles.css";
import "@/src/styles/preflight.css";
import "@/src/styles/globals.css";
import "@mantine/notifications/styles.css";

import theme from "@/src/styles/mantineTheme";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import type { AppProps } from "next/app";
import Layout from "../components/layout";
import { AuthProvider } from "../contexts/AuthContext";
import { NotificationProvider } from "../contexts/NotificationContext";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <MantineProvider theme={theme}>
      <Notifications position="top-right" />
      <AuthProvider>
        <NotificationProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </NotificationProvider>
      </AuthProvider>
    </MantineProvider>
  );
}
