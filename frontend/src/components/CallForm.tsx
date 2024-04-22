import React, { useMemo } from "react";
import { Form, Input, Button } from "antd";
import { useQuery, useMutation } from "@apollo/client";
import { CREATE_CALL, GET_CALL } from "../schema.ts";
import { cache } from "../index.js";

function CallForm({ slotId, callId }) {
  const { data } = useQuery(GET_CALL, {
    variables: { id: callId },
    skip: !callId,
  });
  const call = useMemo(() => data?.call, [data]);
  console.log(call)
  const [createCall] = useMutation(CREATE_CALL, {onCompleted: () => cache.reset()});
  
  return (<>{call ? (
    <>
      <p>Satisfaction score: {call.satisfactionScore}</p>
      <p>Notes: {call.notes}</p>
    </>
  ) : (
    <Form
      onFinish={(values) => {
        createCall({
          variables: {
            notes: values.notes,
            satisfactionScore: parseInt(values.satisfactionScore),
            slotId,
          },
        });
      }}
    >
      <Form.Item label="Satisfaction score" name="satisfactionScore">
        <Input type="number" min={1} max={5} disabled={callId} />
      </Form.Item>
      <Form.Item label="Notes" name="notes">
        <Input.TextArea disabled={callId} />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  )}</>)
}

export default CallForm;
