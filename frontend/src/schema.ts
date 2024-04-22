import { gql } from "@apollo/client";

const COACH_FRAGMENT = gql`
  fragment Coach on CoachType {
    id
    phoneNumber
    firstName
    lastName
  }
`;

const STUDENT_FRAGMENT = gql`
  fragment Student on StudentType {
    id
    phoneNumber
    firstName
    lastName
  }
`;

const SLOT_FRAGMENT = gql`
  fragment Slot on SlotType {
    id
    startTime
    endTime
    coach {
      ...Coach
    }
    student {
      ...Student
    }
    call {
      id
    }
  }
  ${COACH_FRAGMENT}
  ${STUDENT_FRAGMENT}
`;

const CALL_FRAGMENT = gql`
  fragment Call on CallType {
    id
    slot {
      startTime
      endTime
    }
    coach {
      id
      firstName
      lastName
    }
    student {
      id
      firstName
      lastName
    }
    satisfactionScore
    notes
  }
`;

export const LIST_COACHES = gql`
  query ListCoaches {
    coaches {
      ...Coach
    }
  }
  ${COACH_FRAGMENT}
`;

export const LIST_STUDENTS = gql`
  query ListStudent {
    students {
      ...Student
    }
  }
  ${STUDENT_FRAGMENT}
`;

export const GET_SLOT = gql`
  query GetSlot($id: ID) {
    slot(id: $id) {
      ...Slot
    }
  }
  ${SLOT_FRAGMENT}
`;

export const GET_SLOT_COUNTS = gql`
  query GetSlotCounts($year: Int!, $month: Int, $coachId: ID, $studentId: ID) {
    slotCounts(
      year: $year
      month: $month
      coachId: $coachId
      studentId: $studentId
    )
  }
`;

export const LIST_SLOTS = gql`
  query ListSlots(
    $startTime: String
    $endTime: String
    $coachId: ID
    $studentId: ID
    $withCall: Boolean
  ) {
    slots(
      startTime: $startTime
      endTime: $endTime
      coachId: $coachId
      studentId: $studentId
      withCall: $withCall
    ) {
      ...Slot
    }
  }
  ${SLOT_FRAGMENT}
`;

export const CREATE_SLOT = gql`
  mutation CreateSlot($startTime: String!, $coachId: ID!) {
    createSlot(startTime: $startTime, coachId: $coachId) {
      slot {
        ...Slot
      }
    }
  }
  ${SLOT_FRAGMENT}
`;

export const BOOK_SLOT = gql`
  mutation BookSlot($id: ID!, $studentId: ID!) {
    bookSlot(id: $id, studentId: $studentId) {
      slot {
        ...Slot
      }
    }
  }
  ${SLOT_FRAGMENT}
`;

export const GET_CALL = gql`
  query GetCall($id: ID!) {
    call(id: $id) {
      ...Call
    }
  }
  ${CALL_FRAGMENT}
`;

export const CREATE_CALL = gql`
  mutation CreateCall($slotId: ID!, $satisfactionScore: Int!, $notes: String) {
    createCall(
      slotId: $slotId
      satisfactionScore: $satisfactionScore
      notes: $notes
    ) {
      call {
        ...Call
      }
    }
  }
  ${CALL_FRAGMENT}
`;
