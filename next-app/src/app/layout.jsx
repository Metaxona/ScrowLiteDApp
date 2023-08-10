import FloatingFooter from "@/components/FloatingFooter";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { MobileNavigation } from "@/components/Navigation";
import "@rainbow-me/rainbowkit/styles.css";
import "./global.css";
import "./normalize.css";
import { Providers, WalletProviders } from "./provider";

export const metadata = {
    title: "ScrowLite",
    description: "Trustless ERC to ERC Escrow",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <head>
                <link rel="icon" href={`${process.env.FAVICON_BASE_PATH}/favicon.ico`} sizes="any" />
            </head>
            <body>
                <WalletProviders>
                    <Providers>
                        <Header />
                        <main>{children}</main>
                        <FloatingFooter />
                        <MobileNavigation />
                        <Footer />
                    </Providers>
                </WalletProviders>
            </body>
        </html>
    );
}
