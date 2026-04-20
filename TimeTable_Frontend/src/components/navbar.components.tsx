import { Box, Button, Flex, Image, Drawer, Portal, CloseButton, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { FiLogIn, FiLogOut } from "react-icons/fi";
import { Turn as Hamburger } from 'hamburger-react'
import { useState } from "react";

import { useAppDispatch } from "../hooks/redux";
import type { RootState } from "../stores/store";
import { logout } from "../stores/slices/authSlices";
import { Logout } from "../services/apis/auth.service";
import Logo from "../../public/assets/30SIT.png";

export default function Navbar() {
    const navigate = useNavigate();
    const isAuthenticated = useSelector((state: RootState) => state.auth.authorized);
    const dispatch = useAppDispatch();
    const [isOpen, setOpen] = useState<boolean>(false);
    const handleLogout = async () => {
        try {
            const res = await Logout();
            if (res.status === 200) {
                dispatch(logout());
                navigate("/");
            }
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };
    return (
        <Box bg={"white"} shadow={"sm"} p={"15px 0"}>
            <Flex w={{ base: "90%", md: "85%", xl: "70%" }} margin={"0 auto"} justifyContent={"space-between"} alignItems={"center"}>
                <Image src={Logo} alt="Logo" h={"45px"} onClick={() => navigate("/")} cursor={"pointer"} />
                {isAuthenticated ? (
                    <Flex gap={"20px"}>
                        <Box display={{ base: "none", md: "flex" }}>
                            <Button variant={"plain"} p="7px 20px" _hover={{ textDecor: "underline", textUnderlineOffset: "2px" }} onClick={() => navigate("/")}>
                                หน้าหลัก
                            </Button>
                            <Button variant={"plain"} p="7px 20px" _hover={{ textDecor: "underline", textUnderlineOffset: "2px" }} onClick={() => navigate("/admin")}>
                                แดชบอร์ด
                            </Button>
                            <Button
                                variant={"outline"}
                                p="7px 20px"
                                borderRadius="50px"
                                onClick={handleLogout}
                            >
                                <FiLogOut /> ออกจากระบบ
                            </Button>
                        </Box>
                        <Box display={{ base: "flex", md: "none" }}>
                            <Drawer.Root open={isOpen} onOpenChange={(e) => setOpen(e.open)}>
                                <Drawer.Backdrop />
                                <Drawer.Trigger asChild>
                                    <Hamburger size={20} rounded toggled={isOpen} toggle={setOpen} />
                                </Drawer.Trigger>
                                <Portal>
                                    <Drawer.Backdrop />
                                    <Drawer.Positioner>
                                        <Drawer.Content>
                                            <Drawer.Body>
                                                <Box width={"100%"} pt={"30%"} display={"flex"} flexDirection={"column"} gap={"20px"} alignItems={"center"}>
                                                    <Text pb={"10px"} fontSize={"24px"} fontWeight={"700"}>เมนู</Text>
                                                    <hr style={{ width: "80%", color: "gray" }} />
                                                    <Box pt={"30px"}>
                                                        <Button variant={"plain"} p="7px 20px" fontSize={"18px"} _hover={{ textDecor: "underline", textUnderlineOffset: "2px" }} onClick={() => navigate("/")}>
                                                            หน้าหลัก
                                                        </Button>
                                                    </Box>
                                                    <Box>
                                                        <Button variant={"plain"} p="7px 20px" fontSize={"18px"} _hover={{ textDecor: "underline", textUnderlineOffset: "2px" }} onClick={() => navigate("/admin")}>
                                                            แดชบอร์ด
                                                        </Button>
                                                    </Box>
                                                    <Box>
                                                        <Button
                                                            variant={"outline"}
                                                            p="7px 20px"
                                                            borderRadius="50px"
                                                            onClick={handleLogout}
                                                        >
                                                            <FiLogOut /> ออกจากระบบ
                                                        </Button>
                                                    </Box>
                                                </Box>
                                            </Drawer.Body>
                                            <Drawer.CloseTrigger asChild>
                                                <CloseButton size="lg" />
                                            </Drawer.CloseTrigger>
                                        </Drawer.Content>
                                    </Drawer.Positioner>
                                </Portal>
                            </Drawer.Root>
                        </Box>
                    </Flex>
                ) : (
                    <Button
                        variant="outline"
                        p="7px 20px"
                        borderRadius="50px"
                        onClick={() => navigate("/login")}
                    >
                        <FiLogIn /> เข้าสู่ระบบ
                    </Button>
                )}
            </Flex>
        </Box>
    )
}