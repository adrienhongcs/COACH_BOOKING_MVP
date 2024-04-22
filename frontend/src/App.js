import { useMemo, useState } from "react";
import { useQuery } from "@apollo/client";
import { Layout, Menu, Switch, Tabs } from "antd";
import { LIST_COACHES, LIST_STUDENTS } from "./schema.ts";
import Calendar from "./components/Calendar.tsx";
import SlotTimeline from "./components/SlotTimeline.tsx";
import { getUserMenuItem } from "./helpers.ts";

const { Header, Content, Footer } = Layout;

function App() {
  const [isCoachMode, setIsCoachMode] = useState(true);
  const [userId, setUserId] = useState();

  const { data: coachesData } = useQuery(LIST_COACHES);
  const coachItems = useMemo(
    () => coachesData?.coaches.map(getUserMenuItem) ?? [],
    [coachesData]
  );
  const { data: studentsData } = useQuery(LIST_STUDENTS);
  const studentItems = useMemo(
    () => studentsData?.students.map(getUserMenuItem) ?? [],
    [studentsData]
  );

  return (
    <Layout>
      <Header
        style={{
          top: 0,
          zIndex: 1,
          width: "100%",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Switch
          checkedChildren="Coach"
          unCheckedChildren="Student"
          value={isCoachMode}
          onChange={setIsCoachMode}
        />
        <Menu
          theme="dark"
          mode="horizontal"
          items={isCoachMode ? coachItems : studentItems}
          style={{ flex: 1, minWidth: 0 }}
          onSelect={(e) => setUserId(e.key)}
        />
      </Header>
      <Content style={{ padding: 10 }}>
        {isCoachMode ? (
          <Tabs
            items={[
              {
                key: "1",
                label: "Calendar",
                children: <Calendar coachId={userId} />,
              },
              {
                key: "2",
                label: "Calls",
                children: <SlotTimeline coachId={userId} onlyWithCall />,
              },
            ]}
          />
        ) : (
          <Calendar studentId={userId} />
        )}
      </Content>
    </Layout>
  );
}

export default App;
