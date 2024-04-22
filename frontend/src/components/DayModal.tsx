import React, { useCallback } from "react";
import { Modal, Form, TimePicker } from "antd";
import { useMutation } from "@apollo/client";
import { CREATE_SLOT } from "../schema.ts";
import SlotTimeline from "./SlotTimeline.tsx";
import { cache } from "../index.js";
import { formatDatetime } from "../helpers.ts";

function DayModal({ coachId, studentId, dayjs, open, onCancel, onOk }) {
  const [form] = Form.useForm();
  const [createSlot] = useMutation(CREATE_SLOT, {
    onCompleted: () => {
      cache.reset();
    },
  });
  const handleOk = useCallback(() => {
    form.validateFields().then((values) => {
      const startTime = formatDatetime(
        dayjs.hour(values.startTime.hour()).minute(values.startTime.minute())
      );
      createSlot({ variables: { startTime, coachId } });
      onOk();
    });
  }, [onOk]);
  const disabledHours = () =>
    [...Array(24).keys()].filter((hour) => hour < 9 || 15 < hour);
  return (
    <Modal
      title={dayjs?.format("ddd, DD MMM YYYY").toString()}
      open={open}
      onOk={handleOk}
      onCancel={onCancel}
      okText="Add slot"
      footer={coachId ? undefined : null}
    >
      <SlotTimeline
        currentDay={dayjs}
        coachId={coachId}
        studentId={studentId}
      />
      {coachId && (
        <Form form={form}>
          <Form.Item label="Start time" name="startTime" required>
            <TimePicker
              format={"HH:mm"}
              minuteStep={30}
              disabledTime={() => ({ disabledHours: disabledHours })}
            />
          </Form.Item>
        </Form>
      )}
    </Modal>
  );
}

export default DayModal;
