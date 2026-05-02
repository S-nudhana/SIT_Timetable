import { useState, useEffect } from "react";
import { Box, Text, Flex, Input, Textarea, Button, Timeline, Alert, Spinner } from "@chakra-ui/react";
import { FiPlus } from "react-icons/fi";

import Navbar from "../../components/navbar.component";
import Footer from "../../components/footer.component";
import DayBlock from "../../components/dayBlock.component";
import { makeDay } from "../../utils/event.helpers";
import type { DraftDay } from "../../types/event.type";
import { createEventSchema, type FormErrors } from "../../schema/event.schema";
import { useNavigate, useParams } from "react-router-dom";
import BackButton from "../../components/backButton.component";

import { getEventDetailApi, updateEventApi } from "../../services/apis/event.service";

export default function EditEventPage() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [days, setDays] = useState<DraftDay[]>([makeDay()]);
    const [errors, setErrors] = useState<FormErrors>({});
    const [alertStatus, setAlertStatus] = useState<"success" | "error" | "loading" | null>(null);
    const [fetchStatus, setFetchStatus] = useState<"loading" | "error" | "done">("loading");

    const fetchEvent = async () => {
        try {
            const res = await getEventDetailApi(Number(id));
            console.log(res)
            if (res.status === 200 && res.data) {
                const { event, timelines } = res.data.data;

                setTitle(event.title ?? "");
                setDescription(event.description ?? "");

                // Convert UTC ISO string to local "HH:MM" — e.g. "2026-05-13T02:00:00" (UTC) → "09:00" (UTC+7)
                const toLocalTimeStr = (iso: string): string => {
                    if (!iso) return "";
                    const date = new Date(iso + "Z"); // append Z to treat as UTC
                    const hh = String(date.getHours()).padStart(2, "0");
                    const mm = String(date.getMinutes()).padStart(2, "0");
                    return `${hh}:${mm}`;
                };

                // Convert UTC ISO string to local "YYYY-MM-DD" for the date input
                const toLocalDateStr = (iso: string): string => {
                    if (!iso) return "";
                    const date = new Date(iso + "Z"); // treat as UTC
                    const yyyy = date.getFullYear();
                    const mm = String(date.getMonth() + 1).padStart(2, "0");
                    const dd = String(date.getDate()).padStart(2, "0");
                    return `${yyyy}-${mm}-${dd}`;
                };

                setDays(
                    timelines?.length
                        ? timelines.map((t: any) => ({
                            _key: crypto.randomUUID(),
                            date: toLocalDateStr(t.startTime),
                            location: t.place ?? "",
                            sessions: [
                                {
                                    _key: crypto.randomUUID(),
                                    title: t.title ?? "",
                                    description: t.description ?? "",
                                    startTime: toLocalTimeStr(t.startTime),
                                    endTime: toLocalTimeStr(t.endTime),
                                },
                            ],
                        }))
                        : [makeDay()]
                );

                setFetchStatus("done");
            } else {
                setFetchStatus("error");
            }
        } catch (error) {
            console.error("Failed to fetch event:", error);
            setFetchStatus("error");
        }
    };

    useEffect(() => {
        if (!id) return;
        fetchEvent();
    }, [id]);

    const addDay = () => setDays((prev) => [...prev, makeDay()]);
    const updateDay = (updated: DraftDay) =>
        setDays((prev) => prev.map((d) => d._key === updated._key ? updated : d));
    const removeDay = (key: string) =>
        setDays((prev) => prev.filter((d) => d._key !== key));

    const handleSubmit = async () => {
        setAlertStatus("loading");
        const result = createEventSchema.safeParse({ title, description, days });

        if (!result.success) {
            const newErrors: FormErrors = {};
            setAlertStatus("error");
            result.error.issues.forEach((err) => {
                const [field, dayIndex, subField, sessionIndex, sessionField] = err.path;

                if (field === "title") newErrors.title = err.message;
                else if (field === "description") newErrors.description = err.message;
                else if (field === "days" && typeof dayIndex === "number") {
                    const dayKey = days[dayIndex]._key;
                    if (!newErrors.days) newErrors.days = {};
                    if (!newErrors.days[dayKey]) newErrors.days[dayKey] = {};

                    if (subField === "date") newErrors.days[dayKey].date = err.message;
                    else if (subField === "location") newErrors.days[dayKey].location = err.message;
                    else if (subField === "sessions" && typeof sessionIndex === "number" && sessionField) {
                        const sessionKey = days[dayIndex].sessions[sessionIndex]._key;
                        if (!newErrors.days[dayKey].sessionErrors) newErrors.days[dayKey].sessionErrors = {};
                        newErrors.days[dayKey].sessionErrors![sessionKey] = {
                            ...newErrors.days[dayKey].sessionErrors![sessionKey],
                            [sessionField as string]: err.message,
                        };
                    } else if (subField === "sessions") {
                        newErrors.days[dayKey].sessions = err.message;
                    }
                }
            });

            setErrors(newErrors);
            return;
        }

        setErrors({});
        try {
            const res = await updateEventApi(Number(id), title, description, days);
            if (res.status === 200) {
                setAlertStatus("success");
                setTimeout(() => navigate("/admin/"), 1500);
            } else {
                setAlertStatus("error");
            }
        } catch (error) {
            console.error("Failed to update event:", error);
            setAlertStatus("error");
        }
    };

    // Loading state
    if (fetchStatus === "loading") {
        return (
            <Box>
                <Navbar />
                <Flex justify="center" align="center" minH="60vh">
                    <Spinner size="xl" color="#0C86FE" />
                </Flex>
                <Footer />
            </Box>
        );
    }

    // Fetch error state
    if (fetchStatus === "error") {
        return (
            <Box>
                <Navbar />
                <Flex justify="center" align="center" minH="60vh" direction="column" gap="16px">
                    <Alert.Root status="error" borderRadius="12px" p="15px" maxW="400px">
                        <Alert.Indicator />
                        <Alert.Title>ไม่สามารถโหลดข้อมูลกิจกรรมได้ โปรดลองอีกครั้ง</Alert.Title>
                    </Alert.Root>
                    <Button onClick={() => navigate("/admin/")} p={"10px"} variant="outline">
                        กลับหน้าหลัก
                    </Button>
                </Flex>
                <Footer />
            </Box>
        );
    }

    return (
        <Box>
            <Navbar />

            {/* Editable hero */}
            <Box
                w="100%"
                bg="linear-gradient(90deg, #0048FF, #44B0FF)"
                py={{ base: "40px", md: "60px" }}
                px={{ base: "20px", md: "0" }}
                textAlign="center"
                color="white"
            >
                <Input
                    value={title}
                    onChange={(e) => { setTitle(e.target.value); setErrors((p) => ({ ...p, title: undefined })); }}
                    placeholder="ชื่อกิจกรรม"
                    textAlign="center"
                    fontSize={{ base: "22px", md: "30px" }}
                    fontWeight="700"
                    color="white"
                    border="none"
                    borderBottom={errors.title ? "2px solid #FC8181" : "2px solid rgba(255,255,255,0.4)"}
                    borderRadius="0"
                    bg="transparent"
                    mb="4px"
                    maxW="600px"
                    mx="auto"
                    display="block"
                    _placeholder={{ color: "whiteAlpha.700" }}
                    _focus={{ outline: "none", boxShadow: "none", borderBottomColor: "white" }}
                />
                {errors.title && (
                    <Text fontSize="12px" color="red.200" mb="12px">{errors.title}</Text>
                )}
                <Textarea
                    value={description}
                    onChange={(e) => { setDescription(e.target.value); setErrors((p) => ({ ...p, description: undefined })); }}
                    placeholder="รายละเอียดกิจกรรม..."
                    textAlign="center"
                    fontSize="14px"
                    color="white"
                    border="none"
                    bg="transparent"
                    resize="none"
                    rows={3}
                    maxW="480px"
                    mx="auto"
                    display="block"
                    _placeholder={{ color: "whiteAlpha.600" }}
                    _focus={{ outline: "none", boxShadow: "none" }}
                />
                {errors.description && (
                    <Text fontSize="12px" color="red.200" mt="4px">{errors.description}</Text>
                )}
            </Box>

            {/* Builder */}
            <Box w={{ base: "90%", md: "700px" }} mx="auto" pt="20px" pb={"25"}>
                <BackButton />
                <Text
                    fontSize={{ base: "20px", md: "24px" }}
                    fontWeight="700"
                    textAlign="center"
                    mb="40px"
                    color="gray.800"
                >
                    ตารางเวลา
                </Text>

                <Timeline.Root>
                    {days.map((day, index) => (
                        <DayBlock
                            key={day._key}
                            day={day}
                            index={index}
                            errors={errors.days?.[day._key]}
                            onUpdate={updateDay}
                            onRemove={() => removeDay(day._key)}
                        />
                    ))}
                </Timeline.Root>

                {/* Add day */}
                <Box
                    border="1px dashed"
                    borderColor="gray.300"
                    borderRadius="12px"
                    p="16px"
                    textAlign="center"
                    cursor="pointer"
                    _hover={{ borderColor: "#0C86FE", color: "#0C86FE" }}
                    transition="all 0.15s"
                    onClick={addDay}
                    mt="10px"
                    color="gray.500"
                    mb="30px"
                >
                    <Flex align="center" justify="center" gap="8px">
                        <FiPlus />
                        <Text fontWeight="600" fontSize="14px">เพิ่มวัน</Text>
                    </Flex>
                </Box>

                {alertStatus === "success" && (
                    <Alert.Root status="success" variant="subtle" mb="20px" borderRadius="12px" p={"15px"}>
                        <Alert.Indicator />
                        <Alert.Title>อัพเดทกิจกรรมเสร็จสิ้น</Alert.Title>
                    </Alert.Root>
                )}
                {alertStatus === "error" && (
                    <Alert.Root status="error" mb="20px" borderRadius="12px" p="15px">
                        <Alert.Indicator />
                        <Alert.Title>ไม่สามารถอัพเดทกิจกรรมได้ โปรดกรอกข้อมูลใหม่แล้วลองอีกครั้ง</Alert.Title>
                    </Alert.Root>
                )}

                <Button
                    loading={alertStatus === "loading"}
                    disabled={alertStatus === "success"}
                    loadingText="กำลังบันทึก"
                    w="100%"
                    bg="#0C86FE"
                    color="white"
                    fontWeight="700"
                    borderRadius="12px"
                    p="24px"
                    _hover={{ bg: "#0074e0" }}
                    onClick={handleSubmit}
                    mb="60px"
                >
                    อัพเดทกิจกรรม
                </Button>
            </Box>

            <Footer />
        </Box>
    );
}