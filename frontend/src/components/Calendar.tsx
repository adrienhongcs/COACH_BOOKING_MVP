import React, { useMemo, useState } from "react";
import { Calendar as AntdCalendar, CalendarProps, Modal } from "antd";
import DayModal from "./DayModal.tsx";
import type { Dayjs } from "dayjs";
import { useQuery } from "@apollo/client";
import { GET_SLOT_COUNTS } from "../schema.ts";
import dayjs from "dayjs";

function Calendar({ coachId, studentId }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const today = dayjs().second(0).millisecond(0);
  const [currentDayjs, setCurrentDayjs] = useState(today);
  const { data: slotCountsData } = useQuery(GET_SLOT_COUNTS, {
    variables: {
      year: currentDayjs.year(),
      month: currentDayjs.month() + 1,
      coachId,
      studentId,
    },
    skip: !(coachId || studentId),
  });

  const slotCounts = useMemo(
    () => (slotCountsData ? JSON.parse(slotCountsData.slotCounts) : {}),
    [slotCountsData]
  );

  const cellRender: CalendarProps<Dayjs>["cellRender"] = (current, info) => {
    if (info.type === "date" && slotCounts[current.date()]) {
      const { booked, available } = slotCounts[current.date()];
      return (
        <>
          <p>{booked} booked</p>
          <p>{available} available</p>
        </>
      );
    }
  };

  return (
    <>
      <DayModal
        coachId={coachId}
        studentId={studentId}
        dayjs={currentDayjs}
        open={isModalOpen}
        onOk={() => setIsModalOpen(false)}
        onCancel={() => setIsModalOpen(false)}
      />
      <AntdCalendar
        value={currentDayjs}
        onSelect={(selectedDayjs) => {
            setCurrentDayjs(selectedDayjs);
            if (selectedDayjs.isSame(currentDayjs, 'month')) {
              setIsModalOpen(true)
            }
        }}
        cellRender={cellRender}
      />
    </>
  );
}

export default Calendar;
