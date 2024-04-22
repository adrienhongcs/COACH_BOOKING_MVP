import React, { useMemo } from "react";
import { Timeline } from "antd";
import { LIST_SLOTS } from "../schema.ts";
import { useQuery } from "@apollo/client";
import Slot from "./Slot.tsx";
import { formatDatetime } from "../helpers.ts";


function SlotTimeline({ coachId, studentId, currentDay, withCall = undefined}) {
  const startTime = useMemo(() => {
    return currentDay?.hour(0);
  }, [currentDay]);
  const endTime = useMemo(() => {
    return startTime?.date(startTime.date() + 1);
  }, [startTime]);

  const { data } = useQuery(LIST_SLOTS, {
    variables: {
      startTime: formatDatetime(startTime),
      endTime: formatDatetime(endTime),
      coachId,
      studentId,
      withCall,
    },
  });

  const slots = useMemo(() => {
    return data?.slots || [];
  }, [data]);

  return (
    <Timeline
      items={slots.map((slot) => {
        return {children: <Slot slotId={slot?.id} coachId={coachId} studentId={studentId} showDate={!currentDay}/>};
      })}
    />
  );
}

export default SlotTimeline;
