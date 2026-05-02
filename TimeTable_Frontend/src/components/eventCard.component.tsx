import { Box, Text, Flex } from "@chakra-ui/react";
import { FiCalendar, FiClock, FiMapPin } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import type { Event } from "../types/event.type";
import { formatThaiDate, formatTimeRange } from "../utils/event.format";
import { getStatusLabel } from "../utils/event.helpers";

interface EventCardProps {
    event: Event;
}

export default function EventCard({ event }: EventCardProps) {
    const navigate = useNavigate();
    const statusLabel = getStatusLabel(event);

    const sameMonth =
        event.startDate.getMonth() === event.endDate.getMonth() &&
        event.startDate.getFullYear() === event.endDate.getFullYear();
    const sameDay = sameMonth && event.startDate.getDate() === event.endDate.getDate();

    return (
        <Flex
            bg="white"
            borderRadius="20px"
            p="20px"
            shadow="md"
            gap="16px"
            align="flex-start"
            cursor="pointer"
            transition="transform 0.2s ease, box-shadow 0.2s ease"
            _hover={{ transform: "scale(1.01)", shadow: "lg" }}
            onClick={() => navigate(`/event/${event.id}`)}
            overflow="hidden"  // ← prevents card from stretching
            w="100%"
        >
            <Box flexShrink={0} w={{ base: "64px", md: "72px" }}>
                <Box
                    w="100%"
                    minH="72px"
                    bg="linear-gradient(135deg, #0048FF, #44B0FF)"
                    borderRadius="12px"
                    display="flex"
                    flexDir="column"
                    justifyContent="center"
                    alignItems="center"
                    color="white"
                    px={1}
                    py={2}
                    textAlign="center"
                >
                    {sameDay ? (
                        <>
                            <Text fontSize="22px" fontWeight="700" lineHeight="1">
                                {event.startDate.getDate()}
                            </Text>
                            <Text fontSize="11px" mt="3px">
                                {event.startDate.toLocaleDateString("th-TH", { month: "short" })}
                            </Text>
                        </>
                    ) : sameMonth ? (
                        <>
                            <Text fontSize="16px" fontWeight="700" lineHeight="1">
                                {event.startDate.getDate()}-{event.endDate.getDate()}
                            </Text>
                            <Text fontSize="11px" mt="3px">
                                {event.startDate.toLocaleDateString("th-TH", { month: "short" })}
                            </Text>
                        </>
                    ) : (
                        <>
                            <Text fontSize="12px" fontWeight="700" lineHeight="1.3">
                                {event.startDate.getDate()}{" "}
                                {event.startDate.toLocaleDateString("th-TH", { month: "short" })}
                            </Text>
                            <Text fontSize="11px" my="1px">-</Text>
                            <Text fontSize="12px" fontWeight="700" lineHeight="1.3">
                                {event.endDate.getDate()}{" "}
                                {event.endDate.toLocaleDateString("th-TH", { month: "short" })}
                            </Text>
                        </>
                    )}
                </Box>
            </Box>

            {/* Content — takes remaining space, clips overflow */}
            <Box flex="1" minW="0" overflow="hidden">
                <Text
                    fontSize={{ base: "14px", md: "15px" }}
                    fontWeight="600"
                    mb="4px"
                    overflow="hidden"
                    textOverflow="ellipsis"
                    whiteSpace="nowrap"
                >
                    {event.title}
                </Text>

                <Text
                    fontSize="13px"
                    color="gray.500"
                    mb="6px"
                    overflow="hidden"
                    textOverflow="ellipsis"
                    css={{
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                    }}
                >
                    {event.description}
                </Text>

                {statusLabel && (
                    <Text
                        fontSize="13px"
                        fontWeight="600"
                        color="#0C86FE"
                        mb="6px"
                        overflow="hidden"
                        textOverflow="ellipsis"
                        whiteSpace="nowrap"
                    >
                        {statusLabel}
                    </Text>
                )}

                <Box borderTop="1px solid" borderColor="gray.100" pt="6px">
                    <Flex gap="10px" flexWrap="wrap">
                        <Flex align="center" gap="4px" color="gray.500" fontSize="12px" flexShrink={0}>
                            <FiCalendar size={11} />
                            <Text whiteSpace="nowrap">
                                {formatThaiDate(event.startDate)}
                                {!sameDay && ` - ${formatThaiDate(event.endDate)}`}
                            </Text>
                        </Flex>
                        <Flex align="center" gap="4px" color="gray.500" fontSize="12px" flexShrink={0}>
                            <FiClock size={11} />
                            <Text whiteSpace="nowrap">
                                {formatTimeRange(event.startDate, event.endDate)}
                            </Text>
                        </Flex>
                        <Flex align="center" gap="4px" color="gray.500" fontSize="12px">
                            <FiMapPin size={11} />
                            <Text
                                overflow="hidden"
                                textOverflow="ellipsis"
                                whiteSpace="nowrap"
                            >
                                {event.location}
                            </Text>
                        </Flex>
                    </Flex>
                </Box>
            </Box>
        </Flex>
    );
}