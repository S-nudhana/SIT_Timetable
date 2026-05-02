import { Box, Text, Flex, Timeline, Accordion, Button } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { FiMapPin, FiClock } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

import Navbar from "../../components/navbar.component";
import Footer from "../../components/footer.component";
import BackButton from "../../components/backButton.component";
import { ongoingEvents, upcomingEvents } from "../../data/event.mockup";
import { formatThaiTime, formatTimeRange } from "../../utils/event.format";

export default function EventDetail() {
  const { id } = useParams<{ id: string }>();
  const allEvents = [...ongoingEvents, ...upcomingEvents];
  const event = allEvents.find((e) => e.id === Number(id));

  const navigate = useNavigate();
  const isPast = (date: Date): boolean => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const dayDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    return dayDate < today;
  };


  if (!event) {
    return (
      <Box>
        <Navbar />
        <Box textAlign="center" py="100px" minH={"85dvh"}>
          <Text fontSize="20px" color="gray.500" pb={"20px"}>ไม่พบกิจกรรมนี้</Text>
          <Button onClick={() => navigate("/")} px={"20px"} bg={"#0C86FE"} color={"white"} fontWeight={"700"}>
            กลับไปหน้าหลัก
          </Button>
        </Box>
        <Footer />
      </Box>
    );
  }

  return (
    <Box>
      <Navbar />
      <Box minH={"85dvh"}>
        <Box
          w="100%"
          bg="linear-gradient(90deg, #0048FF, #44B0FF)"
          py={{ base: "50px", md: "70px" }}
          px={{ base: "20px", md: "0" }}
          textAlign="center"
          color="white"
        >
          <Text fontSize={{ base: "24px", md: "32px" }} fontWeight="700" mb="16px" mt={"16px"}>
            {event.title}
          </Text>
          <Text
            fontSize={"14px"}
            color="white"
            maxW="480px"
            mx="auto"
            lineHeight="1.7"
          >
            {event.description}
          </Text>
        </Box>
        <Box w={{ base: "90%", md: "85%", xl: "50%" }} mx="auto" mb="50px">
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

          {event.timetable.length === 0 ? (
            <Text textAlign="center" color="gray.400">ยังไม่มีตารางเวลา</Text>
          ) : (
            <Timeline.Root>
              {event.timetable.map((day, index) => {
                const dayNum = day.date.getDate();
                const monthStr = day.date.toLocaleDateString("th-TH", { month: "short" });
                const firstActiveIndex = event.timetable.findIndex((day) => !isPast(day.date));
                return (
                  <Timeline.Item key={day.id}>
                    <Timeline.Connector>
                      <Timeline.Separator />
                      <Timeline.Indicator bg={isPast(day.date) ? "gray.300" : "#0C86FE"} color="white" />
                    </Timeline.Connector>

                    <Timeline.Content w="100%" pb="8">
                      <Timeline.Title>
                        <Text fontSize="20px" fontWeight="700" color="gray.800">
                          {dayNum}
                        </Text>
                        <Text fontSize="18px" color="gray.500">
                          {monthStr}
                        </Text>
                      </Timeline.Title>
                      <Accordion.Root
                        collapsible
                        defaultValue={index === firstActiveIndex ? [String(day.id)] : []}
                        mt="4"
                        bg={"white"}
                        p={5}
                        borderRadius={"10px"}
                      >
                        <Accordion.Item value={String(day.id)} border="none">
                          <Accordion.ItemTrigger
                            borderBottom="1px solid"
                            borderColor="gray.200"
                            py="3"
                            _hover={{ color: "#0C86FE" }}
                            cursor={"pointer"}
                          >
                            <Text fontSize="16px" fontWeight="700" flex="1" textAlign="left">
                              {day.sessions[0]?.title ?? "กิจกรรม"}
                            </Text>
                            <Accordion.ItemIndicator />
                          </Accordion.ItemTrigger>
                          <Flex flexDir="column" gap="4px" pt="10px" pb="2px">
                            <Flex align="center" gap="8px" color="gray.500" fontSize="13px">
                              <FiMapPin size={13} />
                              <Text>{day.location}</Text>
                            </Flex>
                            <Flex align="center" gap="8px" color="gray.500" fontSize="13px">
                              <FiClock size={13} />
                              <Text>{formatTimeRange(day.startTime, day.endTime)}</Text>
                            </Flex>
                          </Flex>

                          <Accordion.ItemContent>
                            <Accordion.ItemBody>
                              <Flex flexDir="column" gap="20px" pt="12px">
                                {day.sessions.map((session) => (
                                  <Flex key={session.id} gap="20px">
                                    <Text
                                      fontSize="13px"
                                      fontWeight="600"
                                      color="gray.600"
                                      minW="110px"
                                      flexShrink={0}
                                      pt="1px"
                                    >
                                      {formatThaiTime(session.startTime)} - {formatThaiTime(session.endTime)}
                                    </Text>
                                    <Box>
                                      <Text fontSize="14px" fontWeight="700" color="gray.800" mb="6px">
                                        {session.title}
                                      </Text>
                                      <Text fontSize="13px" color="gray.500" lineHeight="1.7">
                                        {session.description}
                                      </Text>
                                    </Box>
                                  </Flex>
                                ))}
                              </Flex>
                            </Accordion.ItemBody>
                          </Accordion.ItemContent>
                        </Accordion.Item>
                      </Accordion.Root>
                    </Timeline.Content>
                  </Timeline.Item>
                );
              })}
            </Timeline.Root>
          )}
        </Box>
      </Box>

      <Footer />
    </Box>
  );
}