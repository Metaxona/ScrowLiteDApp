import { Box, ChakraProvider, Flex, Heading, Hide } from "@chakra-ui/react";
import { Route, Routes } from "react-router-dom";
import { useAccount } from "wagmi";
import "./App.css";
import FloatingFooter from "./components/FloatingFooter";
import Footer from "./components/Footer";
import Header from "./components/Header";
import { MobileNavigation } from "./components/Navigation";
import ScrollToTop from "./components/ScrollToTop";
import Create from "./pages/Create";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import TradesPage from "./pages/Trades";
import PleaseConnect from "./components/PleaseConnect";

function App() {
    const { address, isConnected } = useAccount();

    return (
        <ChakraProvider>
            <Box minH={"100dvh"} minW={"320px"}>
                <ScrollToTop />
                <Header />
                <Box minH={"100dvh"} minW={"320px"} maxW={"100dvw"} mt={"1rem"} mb={"6rem"} p={"1rem"}>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route
                            path="/create"
                            element={
                                isConnected ? (
                                    <Create />
                                ) : (
                                    <Flex textAlign={"center"} alignItems={"center"} gap={"2rem"} flexDirection={"column"}>
                                        <Heading>Please Connect Your Wallet</Heading>
                                        <PleaseConnect />
                                    </Flex>
                                )
                            }
                        />
                        <Route
                            path="/trades"
                            element={
                                isConnected ? (
                                    <TradesPage />
                                ) : (
                                    <Flex textAlign={"center"} alignItems={"center"} gap={"2rem"} flexDirection={"column"}>
                                        <Heading>Please Connect Your Wallet</Heading>
                                        <PleaseConnect />
                                    </Flex>
                                )
                            }
                        />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </Box>
                <Hide above="lg">
                    {" "}
                    <FloatingFooter />{" "}
                </Hide>
                <MobileNavigation />
                <Hide below="lg">
                    {" "}
                    <Footer />{" "}
                </Hide>
            </Box>
        </ChakraProvider>
    );
}

export default App;
