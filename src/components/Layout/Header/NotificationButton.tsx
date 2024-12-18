import {
  Box,
  Text,
  Flex,
  CloseButton,
  ScrollArea,
  Popover,
  ThemeIcon,
} from "@mantine/core";
import axiosInstance from "@/src/apis/axios";
import formatTimeAgo from "@/src/utils/formatTimeAgo";
import Image from "next/image";
import IcoAlarm from "@/public/assets/ic_alarm.svg";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

type NotiDataType = {
  totalCount: number;
  list: {
    createdAt: string;
    content: string;
    id: number;
  }[];
};

export default function NotificationButton() {
  const queryClient = useQueryClient();

  const { data: notiData = { totalCount: 0, list: [] } } =
    useQuery<NotiDataType>({
      queryKey: ["notification"],
      queryFn: async () => {
        const res = await axiosInstance.get("notifications?pageSize=10");
        return res.data;
      },
    });

  const deleteNotiData = useMutation({
    mutationFn: async (id: number) => {
      await axiosInstance.delete(`notifications/${id}`);
    },
    onSuccess: (_, id) => {
      queryClient.setQueryData(["notification"], (prevData: NotiDataType) => {
        if (!prevData) return prevData;

        return {
          ...prevData,
          totalCount: prevData.totalCount - 1,
          list: prevData.list.filter((item) => item.id !== id),
        };
      });
    },
  });

  return (
    <Popover width={200} position="bottom" withArrow shadow="md">
      <Popover.Target>
        <Box style={{ position: "relative" }} className="cursor-pointer">
          <Image src={IcoAlarm} width={32} height={32} alt="알림" />
          <Box>
            {notiData.totalCount > 0 ? (
              <ThemeIcon
                radius="xl"
                size="xs"
                color="red"
                style={{ position: "absolute", top: 0, left: 15, fontSize: 12 }}
              >
                {notiData.totalCount}
              </ThemeIcon>
            ) : null}
          </Box>
        </Box>
      </Popover.Target>
      <Popover.Dropdown
        style={{ backgroundColor: "#CBC9CF", width: 250, height: 300 }}
      >
        <Flex justify="space-between" align="center">
          <Text>알림 {notiData.totalCount}개</Text>
        </Flex>
        <ScrollArea
          h={notiData.totalCount === 1 ? 100 : 205}
          offsetScrollbars
          scrollbars="y"
        >
          <Flex direction="column" align="center" gap="8">
            {notiData.totalCount > 0 ? (
              // 여기 부분을 useState로 만들어서 정리해보자
              notiData.list.map((list) => (
                <Box
                  key={list.id}
                  className="relative flex h-[98px] w-full flex-col items-start justify-around rounded-[5px] bg-white px-[12px] py-[16px]"
                >
                  <CloseButton
                    size="sm"
                    style={{ position: "absolute", top: 5, right: 5 }}
                    onClick={() => {
                      deleteNotiData.mutate(list.id);
                    }}
                  />
                  <Text
                    style={{
                      fontSize: "14px",
                      fontWeight: 400,
                      lineHeight: "22px",
                      color: "#1B1B1B",
                    }}
                  >
                    {list.content}
                  </Text>
                  <Text
                    style={{
                      fontSize: "12px",
                      fontWeight: 400,
                      lineHeight: "16px",
                      color: "#A4A1AA",
                    }}
                  >
                    {formatTimeAgo(list.createdAt)}
                  </Text>
                </Box>
              ))
            ) : (
              <Box className="flex h-[200px] w-full flex-col items-center justify-center">
                <Text>알림이 없습니다</Text>
              </Box>
            )}
          </Flex>
        </ScrollArea>
      </Popover.Dropdown>
    </Popover>
  );
}
