import { Box, Flex, Text, Button, Input, InputGroup, Table, Dialog, CloseButton, Portal } from "@chakra-ui/react"
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import Navbar from "../../components/navbar.component"
import Footer from "../../components/footer.component";
import { formatThaiDate } from "../../utils/event.format";
import { getAdminEventListApi, deleteEventApi } from "../../services/apis/event.service";

import { AiFillDelete } from "react-icons/ai";
import { FiPlus, FiSearch, FiEdit3 } from "react-icons/fi";
import type { EventItem } from "../../types/event.type";

export default function HomePage() {
    const navigate = useNavigate();
    const [eventData, setEventData] = useState<EventItem[]>([]);

    async function handleDelete(id: number) {
        try {
            const res = await deleteEventApi(id);
            if (res.status === 200) {
                setEventData((prev) => prev.filter((e) => e.id !== id));
            }
        } catch (error) {
            console.error("Error deleting event:", error);
        }
    }

    async function eventQuery() {
        try {
            const res = await getAdminEventListApi();
            if (res.status === 200) {
                setEventData(res.data.data)
            }
        } catch (error) {
            console.error("Error fetching events:", error);
        }
    }

    useEffect(() => {
        eventQuery();
    }, []);

    return (
        <Box>
            <Navbar />
            <Box w={{ base: "90%", md: "85%", xl: "70%" }} minH={"80dvh"} display={"flex"} flexDirection={"column"} margin={"0 auto"} mt={"10px"} mb={"50px"}>
                <Flex pt={"50px"} justify={"center"}>
                    <Text fontSize={{ base: "26px", lg: "32px" }} fontWeight={"600"}>
                        แดชบอร์ด
                    </Text>
                </Flex>
                <InputGroup startElement={<FiSearch />} mt={"30px"} p={"0 10px"} bg={"white"} shadow={"md"} borderRadius={"10px"} display={{ base: "flex", md: "none" }}>
                    <Input placeholder="ค้นหากิจกรรม..." bg={"none"} border={"none"} variant={"subtle"} _focus={{ outline: "none", boxShadow: "none" }} />
                </InputGroup>
                <Flex pt={{ base: "20px", md: "40px" }} justify={"space-between"} align={"center"}>
                    <Text fontSize={"18px"} fontWeight={"600"}>
                        กิจกรรมทั้งหมด
                    </Text>
                    <Flex gap={"10px"}>
                        <InputGroup startElement={<FiSearch />} p={"0 10px"} bg={"white"} border={"1px solid"} borderColor={"gray.300"} borderRadius={"10px"} display={{ base: "none", md: "flex" }}>
                            <Input placeholder="ค้นหากิจกรรม..." bg={"none"} border={"none"} variant={"subtle"} _focus={{ outline: "none", boxShadow: "none" }} />
                        </InputGroup>
                        <Button p="7px 13px" bg={"#0C86FE"} borderRadius={"10px"} _hover={{
                            backgroundColor: "#0a68c7"
                        }} onClick={() => navigate("/admin/create")}><FiPlus />เพิ่มกิจกรรม</Button>
                    </Flex>
                </Flex>
                <Table.Root size="md" variant={"outline"} mt={"20px"} borderRadius={"10px"}>
                    <Table.Header>
                        <Table.Row>
                            <Table.ColumnHeader py={"10px"} pl={"20px"}>ชื่อกิจกรรม</Table.ColumnHeader>
                            <Table.ColumnHeader py={"10px"}>ระยะเวลาจัดกิจกรรม</Table.ColumnHeader>
                            <Table.ColumnHeader py={"10px"} display={{ base: "none", md: "flex" }}>ผู้สร้างกิจกรรม</Table.ColumnHeader>
                            <Table.ColumnHeader py={"10px"}></Table.ColumnHeader>
                            <Table.ColumnHeader py={"10px"} pr={"20px"}></Table.ColumnHeader>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {eventData.length === 0 ? (
                            <Table.Row>
                                <Table.Cell colSpan={5} py={"40px"} textAlign={"center"} color={"gray.400"} fontSize={"16px"}>
                                    ไม่มีกิจกรรมในขณะนี้
                                </Table.Cell>
                            </Table.Row>
                        ) : (eventData.map((item) => (
                            <Table.Row key={item.id}>
                                <Table.Cell py={"5px"} pl={"20px"} w={{ base: "25%", md: "auto" }} pr={"9px"} verticalAlign="middle">{item.title}</Table.Cell>
                                <Table.Cell py={"5px"} w={{ base: "25%", md: "auto" }} pr={"9px"} verticalAlign="middle">{formatThaiDate(new Date(item.startDate))} - {formatThaiDate(new Date(item.endDate))}</Table.Cell>
                                <Table.Cell py={"10px"} display={{ base: "none", md: "flex" }} verticalAlign="middle"> {item.creatorName} </Table.Cell>
                                <Table.Cell py={"5px"} w={{ base: "12%", md: "auto" }} verticalAlign="middle"> <Button onClick={() => navigate(`/admin/edit/${item.id}`)} size={"sm"} px={{ base: "0px", md: "20px" }} bg={"#e6e6e6"} color={"black"} borderRadius={"10px"} _hover={{
                                    backgroundColor: "#d8d8d8"
                                }}><FiEdit3 /> <Text display={{ base: "none", md: "flex" }}>แก้ไข</Text></Button> </Table.Cell>
                                <Table.Cell py={"5px"} w={{ base: "12%", md: "auto" }} verticalAlign="middle">
                                    <Dialog.Root placement="center">
                                        <Dialog.Trigger asChild>
                                            <Button
                                                size={"sm"}
                                                px={{ base: "0px", md: "20px" }}
                                                bg="red.500"
                                                color="white"
                                                borderRadius="10px"
                                                _hover={{ backgroundColor: "red.600" }}
                                                display="flex"
                                                alignItems="center"
                                                gap="5px"
                                            >
                                                <AiFillDelete />
                                                <Text display={{ base: "none", md: "block" }}>ลบ</Text>
                                            </Button>
                                        </Dialog.Trigger>
                                        <Portal>
                                            <Dialog.Backdrop />
                                            <Dialog.Positioner>
                                                <Dialog.Content p={5} bg="white" borderRadius="10px" shadow="lg">
                                                    <Dialog.Header>
                                                        <Dialog.Title>ยืนยันการลบ</Dialog.Title>
                                                    </Dialog.Header>
                                                    <Dialog.Body pt={"10px"}>
                                                        <Text>คุณต้องการลบ "{item.title}" ใช่หรือไม่?</Text>
                                                    </Dialog.Body>
                                                    <Dialog.Footer pt={"10px"}>
                                                        <Dialog.ActionTrigger asChild>
                                                            <Button variant="outline" borderRadius={"10px"} p={"10px 15px"}>ยกเลิก</Button>
                                                        </Dialog.ActionTrigger>
                                                        <Button
                                                            bg="red.500"
                                                            color="white"
                                                            _hover={{ bg: "red.600" }}
                                                            onClick={() => handleDelete(item.id)}
                                                            p={"10px 15px"}
                                                            borderRadius={"10px"}
                                                        >
                                                            ยืนยันลบ
                                                        </Button>
                                                    </Dialog.Footer>
                                                    <Dialog.CloseTrigger asChild>
                                                        <CloseButton size="md" />
                                                    </Dialog.CloseTrigger>
                                                </Dialog.Content>
                                            </Dialog.Positioner>
                                        </Portal>
                                    </Dialog.Root></Table.Cell>
                            </Table.Row>
                        )))}
                    </Table.Body>
                </Table.Root>
            </Box>
            <Footer />
        </Box>
    )
}


