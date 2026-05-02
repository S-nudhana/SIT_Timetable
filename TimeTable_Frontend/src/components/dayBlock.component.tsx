import { Box, Text, Flex, Input, Button, Timeline, Accordion } from "@chakra-ui/react";
import { FiPlus, FiX, FiMapPin, FiClock } from "react-icons/fi";
import type { DraftSession } from "../types/event.type";
import { makeSession } from "../utils/event.helpers";
import SessionCard from "../components/sessionCard.component";
import type { DayBlockProps } from "../types/event.type";

export default function DayBlock({ day, index, errors, onUpdate, onRemove }: DayBlockProps) {
    const addSession = () =>
        onUpdate({ ...day, sessions: [...day.sessions, makeSession()] });

    const updateSession = (updated: DraftSession) =>
        onUpdate({ ...day, sessions: day.sessions.map((s) => s._key === updated._key ? updated : s) });

    const removeSession = (key: string) =>
        onUpdate({ ...day, sessions: day.sessions.filter((s) => s._key !== key) });

    const dayStartTime = day.sessions.length
        ? day.sessions.reduce((min, s) => s.startTime < min ? s.startTime : min, day.sessions[0].startTime)
        : "09:00";
    const dayEndTime = day.sessions.length
        ? day.sessions.reduce((max, s) => s.endTime > max ? s.endTime : max, day.sessions[0].endTime)
        : "16:00";

    const dayNum = day.date ? new Date(day.date).getDate() : "—";
    const monthStr = day.date
        ? new Date(day.date).toLocaleDateString("th-TH", { month: "short" })
        : "ม.ค.";
    const triggerLabel = day.date
        ? new Date(day.date).toLocaleDateString("th-TH", { day: "numeric", month: "long", year: "numeric" })
        : `วันที่ ${index + 1}`;

    const hasError = !!(errors?.date || errors?.location || errors?.sessions);

    return (
        <Timeline.Item>
            <Timeline.Connector>
                <Timeline.Separator />
                <Timeline.Indicator bg={hasError ? "red.400" : "#0C86FE"} color="white" />
            </Timeline.Connector>

            <Timeline.Content w="100%" pb="8">
                <Timeline.Title>
                    <Flex align="baseline" gap="4px">
                        <Text fontSize="20px" fontWeight="700" color="gray.700" lineHeight="1">{dayNum}</Text>
                        <Text fontSize="13px" color="gray.500">{monthStr}</Text>
                    </Flex>
                </Timeline.Title>

                <Accordion.Root collapsible defaultValue={[day._key]} mt="4">
                    <Accordion.Item value={day._key} border="none">
                        <Accordion.ItemTrigger
                            borderBottom="1px solid"
                            borderColor={hasError ? "red.200" : "gray.200"}
                            py="3"
                            _hover={{ color: "#0C86FE" }}
                        >
                            <Text fontSize="15px" fontWeight="700" flex="1" textAlign="left" color="gray.800">
                                {triggerLabel}
                            </Text>
                            <Accordion.ItemIndicator />
                        </Accordion.ItemTrigger>

                        <Accordion.ItemContent>
                            <Accordion.ItemBody pt="14px">
                                {/* Location */}
                                <Flex gap="10px" mb="4px" align="center">
                                    <FiMapPin size={13} color="gray" />
                                    <Input
                                        placeholder="สถานที่"
                                        value={day.location}
                                        onChange={(e) => onUpdate({ ...day, location: e.target.value })}
                                        fontSize="13px"
                                        size="sm"
                                        border="none"
                                        bg="transparent"
                                        p="0"
                                        _focus={{ outline: "none", boxShadow: "none" }}
                                    />
                                </Flex>
                                {errors?.location && (
                                    <Text fontSize="11px" color="red.400" mb="8px" pl="23px">{errors.location}</Text>
                                )}

                                <Flex gap="8px" mb="4px" align="center" flexWrap="wrap">
                                    <FiClock size={13} color="gray" />
                                    <Input
                                        type="date"
                                        value={day.date}
                                        onChange={(e) => onUpdate({ ...day, date: e.target.value })}
                                        fontSize="13px"
                                        size="sm"
                                        w="140px"
                                        p={2}
                                        borderRadius="8px"
                                        borderColor={errors?.date ? "red.300" : undefined}
                                    />
                                    <Text fontSize="13px" color="gray.500" fontWeight="500">
                                        {dayStartTime} - {dayEndTime}
                                    </Text>
                                </Flex>
                                {errors?.date && (
                                    <Text fontSize="11px" color="red.400" mb="8px" pl="23px">{errors.date}</Text>
                                )}
                                {errors?.sessions && (
                                    <Text fontSize="11px" color="red.400" mb="8px">{errors.sessions}</Text>
                                )}
                                <Box mt="16px">
                                    {day.sessions.map((session) => (
                                        <SessionCard
                                            key={session._key}
                                            session={session}
                                            errors={errors?.sessionErrors?.[session._key]}
                                            onUpdate={updateSession}
                                            onRemove={() => removeSession(session._key)}
                                        />
                                    ))}
                                </Box>

                                <Button variant="plain" size="sm" color="#0C86FE" _hover={{color: "#0168cf"}} onClick={addSession} mt="4px">
                                    <FiPlus /> เพิ่มกิจกรรม
                                </Button>
                            </Accordion.ItemBody>
                        </Accordion.ItemContent>
                    </Accordion.Item>
                </Accordion.Root>
                <Flex justify="flex-end" mt="4px">
                    <Button variant="plain" size="xs" color="red.400" _hover={{ color: "red.600" }} onClick={onRemove}>
                        <FiX /> ลบวันนี้
                    </Button>
                </Flex>
            </Timeline.Content>
        </Timeline.Item>
    );
}