import React, { useCallback, useMemo } from "react";
import { BOOK_SLOT, GET_SLOT } from "../schema.ts";
import { useQuery, useMutation } from "@apollo/client";
import dayjs from "dayjs";
import { Button, Collapse } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";
import { cache } from "../index.js";
import CallForm from "./CallForm.tsx";

function Slot({ slotId, coachId, studentId, showDate = false}) {
  const { data } = useQuery(GET_SLOT, {
    variables: { id: slotId },
    skip: !slotId,
  });

  const [bookSlot] = useMutation(BOOK_SLOT, {variables: {id: slotId, studentId}, onCompleted: () => {cache.reset()}})

  const slot = useMemo(() => {
    return data?.slot;
  }, [data]);

  const formatTimeRange = () => {
    return `${dayjs(slot?.startTime).format(showDate ? "ddd, DD MMM YYYY - HH:mm" :"HH:mm")} to ${dayjs(
      slot?.endTime
    ).format("HH:mm")}`;
  };
  
  const formatName = () => {
    if (studentId && slot?.coach) {
      return `with ${slot.coach.firstName} ${slot.coach.lastName} | ${slot.student ? slot.coach.phoneNumber : ''}`;
    } else if (slot?.student) {
        return `with ${slot.student.firstName} ${slot.student.lastName} | ${slot.student.phoneNumber}`
    }
  };

  return studentId || !slot?.student ? (
    <>
      {formatTimeRange()} {formatName()}
      {studentId && (
        <Button
          icon={slot?.student && <CheckCircleOutlined color="green" />}
          size="small"
          disabled={slot?.student}
          onClick={() => bookSlot()}
        >
          {slot?.student ? "booked" : "book"}
        </Button>
      )}
    </>
  ) : (
    <Collapse
      size="small"
      items={[
        {
          key: slot?.id,
          label: `${formatTimeRange()} ${formatName()}`,
          children: <CallForm slotId={slot?.id} callId={slot?.call?.id}/>,
        },
      ]}
    />
  );
}

export default Slot;
