import { Box, Flex, Input, Textarea, IconButton, Text } from "@chakra-ui/react";
import { FiX } from "react-icons/fi";

import type { SessionCardProps } from "../types/event.type";

export default function SessionCard({ session, errors, onUpdate, onRemove }: SessionCardProps) {
    return (
        <Box border="1px solid" borderColor={errors ? "red.300" : "gray.200"} borderRadius="10px" p="16px" mb="12px" bg="gray.50">
            <Flex justify="space-between" align="center" mb="4px">
                <Input
                    placeholder="ชื่อกิจกรรม"
                    value={session.title}
                    onChange={(e) => onUpdate({ ...session, title: e.target.value })}
                    fontWeight="700"
                    fontSize="14px"
                    border="none"
                    bg="transparent"
                    p="0"
                    flex="1"
                    _focus={{ outline: "none", boxShadow: "none" }}
                />
                <IconButton
                    aria-label="Remove session"
                    variant="ghost"
                    size="sm"
                    color="gray.400"
                    _hover={{ color: "red.400" }}
                    onClick={onRemove}
                >
                    <FiX />
                </IconButton>
            </Flex>
            {errors?.title && <Text fontSize="11px" color="red.400" mb="8px">{errors.title}</Text>}
            <Flex gap="8px" align="center" mb="4px" flexWrap="wrap">
                <Input
                    type="time"
                    value={session.startTime}
                    onChange={(e) => onUpdate({ ...session, startTime: e.target.value })}
                    size="sm"
                    w="120px"
                    p={2}
                    borderRadius="8px"
                    borderColor={errors?.endTime ? "red.300" : undefined}
                />
                <Text fontSize="13px" color="gray.400">-</Text>
                <Input
                    type="time"
                    value={session.endTime}
                    onChange={(e) => onUpdate({ ...session, endTime: e.target.value })}
                    size="sm"
                    w="120px"
                    p={2}
                    borderRadius="8px"
                    borderColor={errors?.endTime ? "red.300" : undefined}
                />
            </Flex>
            {errors?.endTime && <Text fontSize="11px" color="red.400" mb="8px">{errors.endTime}</Text>}
            <Textarea
                placeholder="รายละเอียดกิจกรรม..."
                value={session.description}
                onChange={(e) => onUpdate({ ...session, description: e.target.value })}
                fontSize="13px"
                rows={3}
                p={2}
                resize="none"
                borderRadius="8px"
                borderColor={errors?.description ? "red.300" : undefined}
                _focus={{ borderColor: "#0C86FE", boxShadow: "none" }}
            />
            {errors?.description && <Text fontSize="11px" color="red.400" mt="4px">{errors.description}</Text>}
        </Box>
    );
}