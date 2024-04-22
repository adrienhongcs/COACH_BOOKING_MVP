## Demos

<details open>
  <summary>Booking</summary>

  1. Toggle to switch user flows between _Coaches_ and _Students_.
  2. Coach _Bill Belichick_ adds an available time on slot on Monday, April 22nd from 9 to 11.
  3. Coach _Jose Mourinho_ adds an available time on slot on Tuesday, April 23rd from 11 to 13.
  4. Students _Tom Brady_ and _Lionel Messi_ can see both available time slots.
  5. _Tom Brady_ books a slot with coach _Bill Belichick_ and can now see his phone number.
  
  https://github.com/adrienhongcs/COACH_BOOKING_MVP/assets/64567338/c2387e5a-b833-40ef-a694-78f0d30771d0
  
</details>

<details>
  <summary>Post-Booking</summary>

  1. Coach _Bill Belichick_ can see the booked slot with student _Tom Brady_ and see his phone number.
  2. Coach _Bill Belichick_ can record a satisfaction score as well as some free notes about the call.
  3. Both coaches can switch to the _Calls_ tab and view booked slots as well as any previous scores and notes.
  
  https://github.com/adrienhongcs/COACH_BOOKING_MVP/assets/64567338/e5ba7546-5e87-429a-9c95-d0014a089f27
  
</details>

## Technical Overview

The goal of this project was to build an MVP **quickly** - as such, the tech stack chosen was largely driven by whatever technology I'm most familiar with at the time of writing:
  - Django backend (using the default SQLite setup) + Graphene to build GraphQL endpoints.
  - Apollo Client + React + Ant Design (UI library).

<details>
  <summary>Database</summary>

  <img width="373" alt="Screenshot 2024-04-21 at 9 53 17 PM" src="https://github.com/adrienhongcs/COACH_BOOKING_MVP/assets/64567338/68996867-6bea-4666-bedb-2560c40151eb">

  - Very minimal schema.
  - Would be good to look at constraints and validation at the database level.
  - Potentially look at transaction (lock on a row) while booking a slot to handle concurrency.

</details>

<details>
  <summary>Backend</summary>

  #### GraphQL Queries
  - `slot(id: ID): SlotType`
  - `slots(startTime: String, endTime: String, coachId: ID, studentId: ID, withCall: Boolean): [SlotType]`
  - `slotCounts(year: Int, month: Int, coachId: ID, studentId: ID): JSONString`
  - `call(id: ID): CallType`
  - `calls: [CallType]`
  - `coach(id: ID): CoachType`
  - `coaches: [CoachType]`
  - `student(id: ID): StudentType`
  - `students: [StudentType]`
  
  #### GraphQL Mutations
  - `createSlot(coachId: ID, startTime: String): CreateSlotMutation`
  - `bookSlot(id: ID, studentId: ID): BookSlotMutation`
  - `createCall(notes: String, satisfactionScore: Int, slotId: ID): CreateCallMutation`

</details>

<details>
  <summary>Frontend</summary>

  - Minimal styling.
  - Caching policy: reset on any change.
    - Works in this simplified MVP where all data is related - would need to revisit to only invalidate and evict stale data.
  - Components:
    - `<Calendar />`
    - `<DayModal />`
    - `<CallForm />`
    - `<SlotTimeline />`
    - `<Slot />`
  
</details>

## Next Steps

- [ ] Handle timezones.
- [ ] Error handling on the UI (_currently a non-user friendly components pops out when attempting to add an overlapping slot for example_).
- [ ] More granular caching strategy.
- [ ] Validation logic (ex: Adding a slot in the past, etc.).
- [ ] Better UX informing end user that a slot is 2 hours long.
- [ ] Scheduling concurrency (_two students try to book the same slot at the same time_). 
- [ ] ...
- [ ] Non-MVP code quality (tests, better abstractions, types...)
