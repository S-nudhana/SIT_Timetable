import { useState, useRef } from "react";
import { Box, Text, Flex, Input, Button, Pagination, ButtonGroup, IconButton } from "@chakra-ui/react";
import { FiSearch, FiChevronLeft, FiChevronRight } from "react-icons/fi";

import Navbar from "../../components/navbar.components";
import Footer from "../../components/footer.components";
import EventCard from "../../components/eventCard.component";
import { ongoingEvents, upcomingEvents } from "../../data/event.mockup";

const PAGE_SIZE = 6;

export default function Home() {
    const [page, setPage] = useState(1);
    const upcomingSectionRef = useRef<HTMLDivElement>(null);

    const now = new Date();
    const allEvents = [...ongoingEvents, ...upcomingEvents];
    const currentEvents = allEvents.filter((e) => now >= e.startDate && now <= e.endDate);
    const futureEvents = allEvents.filter((e) => now < e.startDate);

    const paginatedFutureEvents = futureEvents.slice(
        (page - 1) * PAGE_SIZE,
        page * PAGE_SIZE
    );

    return (
        <Box>
            <Navbar />
            <Box w={{ base: "90%", md: "85%", xl: "70%" }} display={"flex"} flexDirection={"column"} margin={"0 auto"} mt={"10px"} mb={"50px"}>
                <Flex gap={"10px"} justify={"center"} pt={"50px"}>
                    <Text fontSize={{ base: "36px", md: "48px" }} fontWeight={"600"}>Discover</Text>
                    <Text
                        bg="linear-gradient(90deg, #0048FF, #44B0FF)"
                        bgClip="text"
                        fontSize={{ base: "36px", md: "48px" }}
                        fontWeight={"600"}
                    >
                        Events
                    </Text>
                </Flex>
                <Text textAlign={"center"} fontSize={{ base: "14px", md: "16px" }} color={"gray.500"} pb={"20px"}>
                    ค้นหาและกิจกรรม เวิร์กชอป และงานสัมมนาต่าง ๆ
                </Text>
                <Flex w={{ base: "90%", md: "80%", xl: "50%" }} margin={"20px auto"} bg={"white"} borderRadius={"20px"} p={"10px 13px 10px 20px"} shadow={"md"} align={"center"}>
                    <Box flexShrink={0}><FiSearch /></Box>
                    <Input
                        variant={"subtle"}
                        fontSize={{ base: "14px", md: "16px" }}
                        bg={"none"}
                        border={"none"}
                        placeholder={"ค้นหางานสัมมนา หรือ เวิร์กชอป"}
                        pl="20px"
                        flex="1"
                        minW={0}
                        _focus={{ outline: "none", boxShadow: "none" }}
                    />
                    <Button
                        bg={"#0C86FE"}
                        fontSize={{ base: "14px", md: "16px" }}
                        fontWeight={"700"}
                        color={"white"}
                        borderRadius={"15px"}
                        shadow={"lg"}
                        p={{ base: "10px 20px", md: "20px 20px" }}
                        _hover={{ bg: "#0074e0" }}
                        flexShrink={0}
                    >
                        ค้นหา
                    </Button>
                </Flex>
                <Flex justify={"center"} align={"center"} flexDirection={"column"}>
                    {currentEvents.length > 0 && (
                        <Box w={{ base: "90%", md: "85%", xl: "80%" }}>
                            <Flex gap={"10px"} pt={"40px"} align={"center"}>
                                <Box w={"5px"} minH={"24px"} alignSelf={"stretch"} bg="linear-gradient(180deg, #0048FF, #44B0FF)" borderRadius={"20px"} />
                                <Text fontSize={{ base: "16px", md: "18px" }} fontWeight={600}>
                                    กิจกรรมที่กำลังดำเนินอยู่
                                </Text>
                            </Flex>
                            <Flex flexDirection={"column"} w={"100%"} gap={"20px"} py={"20px"}>
                                {currentEvents.map((event) => (
                                    <EventCard key={event.id} event={event} />
                                ))}
                            </Flex>
                        </Box>
                    )}
                    {futureEvents.length > 0 && (
                        <Box w={{ base: "90%", md: "85%", xl: "80%" }}>
                            <Flex gap={"10px"} pt={"20px"} align={"center"} ref={upcomingSectionRef}>
                                <Box w={"5px"} minH={"24px"} alignSelf={"stretch"} bg="linear-gradient(180deg, #0048FF, #44B0FF)" borderRadius={"20px"} />
                                <Text fontSize={{ base: "16px", md: "18px" }} fontWeight={600}>
                                    กิจกรรมที่กำลังจะมาถึง
                                </Text>
                            </Flex>
                            <Box
                                display={"grid"}
                                gridTemplateColumns={{ base: "1fr", md: "1fr 1fr" }}
                                gap={"20px"}
                                py={"20px"}
                            >
                                {paginatedFutureEvents.map((event) => (
                                    <EventCard key={event.id} event={event} />
                                ))}
                            </Box>
                            <Pagination.Root
                                count={futureEvents.length}
                                pageSize={PAGE_SIZE}
                                page={page}
                                onPageChange={(e) => {
                                    setPage(e.page);
                                    upcomingSectionRef.current?.scrollIntoView({ behavior: "smooth" });
                                }}
                                display={"flex"}
                                justifyContent={"center"}
                                pt={"20px"}
                            >
                                <ButtonGroup variant="ghost" size={"sm"}>
                                    <Pagination.PrevTrigger asChild>
                                        <IconButton aria-label="Previous page">
                                            <FiChevronLeft />
                                        </IconButton>
                                    </Pagination.PrevTrigger>
                                    <Pagination.Items
                                        render={(item) => (
                                            <IconButton
                                                aria-label={`Page ${item.value}`}
                                                variant={item.value === page ? "outline" : "ghost"}
                                            >
                                                {item.value}
                                            </IconButton>
                                        )}
                                    />
                                    <Pagination.NextTrigger asChild>
                                        <IconButton aria-label="Next page">
                                            <FiChevronRight />
                                        </IconButton>
                                    </Pagination.NextTrigger>
                                </ButtonGroup>
                            </Pagination.Root>
                        </Box>
                    )}
                </Flex>
            </Box>
            <Footer />
        </Box>
    );
}