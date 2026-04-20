import { Box, Flex, Text } from "@chakra-ui/react";
import { FiCalendar, FiClock, FiMapPin } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

import type { Event } from "../types/event.type";
import { formatThaiDate, formatTimeRange } from "../utils/event.format";
import { getActiveSession, getNextSession, getStatusLabel } from "../utils/event.helpers";

export default function EventCard({ event }: { event: Event }) {
    const sameMonth =
        event.startDate.getMonth() === event.endDate.getMonth() &&
        event.startDate.getFullYear() === event.endDate.getFullYear();
    const sameDay = sameMonth && event.startDate.getDate() === event.endDate.getDate();
    const statusLabel = getStatusLabel(event);
    const activeSession = getActiveSession(event);
    const nextSession = getNextSession(event);
    const displaySession = activeSession ?? nextSession;
    const navigate = useNavigate();
    return (
        <Flex
            bg={"white"}
            borderRadius={"20px"}
            p={"20px"}
            shadow={"md"}
            gap={"20px"}
            align={"flex-start"}
            cursor={"pointer"}
            transition={"transform 0.2s ease, box-shadow 0.2s ease"}
            _hover={{ transform: "scale(1.001)", shadow: "lg" }}
            onClick={() => navigate(`/event/${event.id}`)}
        >
            <Box flexShrink={0} w={{ base: "70px", md: "80px" }}>
                <Box
                    w={"100%"}
                    minH={"80px"}
                    bg="linear-gradient(135deg, #0048FF, #44B0FF)"
                    borderRadius={"12px"}
                    display={"flex"}
                    flexDir={"column"}
                    justifyContent={"center"}
                    alignItems={"center"}
                    color={"white"}
                    px={2}
                    py={3}
                    textAlign={"center"}
                >
                    {sameDay ? (
                        <>
                            <Text fontSize={"22px"} fontWeight={"700"} lineHeight={"1"}>
                                {event.startDate.getDate()}
                            </Text>
                            <Text fontSize={"12px"} mt={"4px"}>
                                {event.startDate.toLocaleDateString("th-TH", { month: "short" })}
                            </Text>
                        </>
                    ) : sameMonth ? (
                        <>
                            <Text fontSize={"18px"} fontWeight={"700"} lineHeight={"1"}>
                                {event.startDate.getDate()}-{event.endDate.getDate()}
                            </Text>
                            <Text fontSize={"12px"} mt={"4px"}>
                                {event.startDate.toLocaleDateString("th-TH", { month: "short" })}
                            </Text>
                        </>
                    ) : (
                        <>
                            <Text fontSize={"13px"} fontWeight={"700"} lineHeight={"1.2"}>
                                {event.startDate.getDate()}{" "}
                                {event.startDate.toLocaleDateString("th-TH", { month: "short" })}
                            </Text>
                            <Text fontSize={"11px"} my={"2px"}>-</Text>
                            <Text fontSize={"13px"} fontWeight={"700"} lineHeight={"1.2"}>
                                {event.endDate.getDate()}{" "}
                                {event.endDate.toLocaleDateString("th-TH", { month: "short" })}
                            </Text>
                        </>
                    )}
                </Box>
            </Box>
            <Box flex="1" minW={0}>
                <Text fontSize={{ base: "15px", md: "16px" }} fontWeight={"600"} mb={"6px"}>
                    {event.title}
                </Text>
                <Text fontSize={"14px"} color={"gray.500"} mb={"8px"}>
                    {event.description}
                </Text>
                {statusLabel && (
                    <Box borderTop={"1px solid"} borderColor={"gray.100"} pt={"8px"}>
                        <Text fontSize={"14px"} fontWeight={"600"} color={"#0C86FE"} mb={"8px"}>
                            {statusLabel}
                        </Text>
                        <Box>
                            <Flex gap={"16px"} flexWrap={"wrap"}>
                                <Flex align={"center"} gap={"5px"} color={"gray.500"} fontSize={"13px"}>
                                    <FiCalendar />
                                    <Text>
                                        {displaySession
                                            ? formatThaiDate(displaySession.startTime)
                                            : formatThaiDate(event.startDate)}
                                    </Text>
                                </Flex>
                                <Flex align={"center"} gap={"5px"} color={"gray.500"} fontSize={"13px"}>
                                    <FiClock />
                                    <Text>
                                        {displaySession
                                            ? formatTimeRange(displaySession.startTime, displaySession.endTime)
                                            : formatTimeRange(event.startDate, event.endDate)}
                                    </Text>
                                </Flex>
                                <Flex align={"center"} gap={"5px"} color={"gray.500"} fontSize={"13px"}>
                                    <FiMapPin />
                                    <Text>{event.location}</Text>
                                </Flex>

                            </Flex>
                        </Box>
                    </Box>
                )}
            </Box>
        </Flex>
    );
};