import { Input, Button, Flex, Box, Image, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

import Logo from "../../../public/assets/30SIT.png";

import { Login } from "../../services/apis/auth.service";
import { loginSchema } from "../../schema/auth.schema";

import type { LoginForm, LoginErrors } from "../../types/auth.type";

export default function LoginPage() {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [errors, setErrors] = useState<LoginErrors>({});
    const [serverError, setServerError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();

    const handleLogin = async () => {
        setServerError("");
        const result = loginSchema.safeParse({ username, password });
        if (!result.success) {
            const fieldErrors: LoginErrors = {};
            result.error.issues.forEach((err) => {
                const field = err.path[0] as keyof LoginForm;
                fieldErrors[field] = err.message;
            });
            setErrors(fieldErrors);
            return;
        }

        setErrors({});
        setLoading(true);

        try {
            const res = await Login(username, password);
            if (res.status === 200) {
                navigate("/admin/");
                return;
            }
            setServerError("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
        } catch (error) {
            console.error("Login failed:", error);
            setServerError("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box w="100%" h="100dvh" display="flex" justifyContent="center" alignItems="center">
            <Flex
                flexDir="column"
                justify="center"
                align="center"
                p="30px"
                boxShadow="lg"
                borderRadius="md"
                w={{ base: "80%", md: "30%" }}
                gap="4px"
            >
                <Box mb="20px">
                    <Image src={Logo} alt="Logo" h="50px" />
                </Box>
                <Text fontSize="24px" fontWeight="600" mb="20px">
                    ลงชื่อเข้าใช้งาน
                </Text>
                <Box w="100%" mb="10px">
                    <Input
                        p={"10px"}
                        borderRadius={"10px"}
                        placeholder="example@gmail.com"
                        value={username}
                        type="email"
                        onChange={(e) => {
                            setUsername(e.target.value);
                            setErrors((prev) => ({ ...prev, username: undefined }));
                        }}
                        borderColor={errors.username ? "red.400" : undefined}
                        _focus={{ borderColor: errors.username ? "red.400" : "#0C86FE", boxShadow: "none" }}
                    />
                    {errors.username && (
                        <Text fontSize="12px" color="red.400" mt="4px" pl="2px">
                            {errors.username}
                        </Text>
                    )}
                </Box>
                <Box w="100%" mb="16px">
                    <Input
                        p={"10px"}
                        borderRadius={"10px"}
                        placeholder="รหัสผ่าน"
                        type="password"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            setErrors((prev) => ({ ...prev, password: undefined }));
                        }}
                        borderColor={errors.password ? "red.400" : undefined}
                        _focus={{ borderColor: errors.password ? "red.400" : "#0C86FE", boxShadow: "none" }}
                    />
                    {errors.password && (
                        <Text fontSize="12px" color="red.400" mt="4px" pl="2px">
                            {errors.password}
                        </Text>
                    )}
                </Box>

                {/* Server error */}
                {serverError && (
                    <Text fontSize="13px" color="red.500" mb="8px" textAlign="center">
                        {serverError}
                    </Text>
                )}

                <Button
                    bgColor="#0C86FE"
                    borderRadius={"10px"}
                    color="white"
                    w="100%"
                    _hover={{ bgColor: "#0074e0" }}
                    onClick={handleLogin}
                    loading={loading}
                    loadingText="กำลังเข้าสู่ระบบ..."
                >
                    Login
                </Button>
            </Flex>
        </Box>
    );
}