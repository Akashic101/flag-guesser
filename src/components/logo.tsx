import { Group, Title } from "@mantine/core";
import logo from "../images/logo192.png";

export default function Logo(): React.JSX.Element {
  return (
    <Group sx={{ height: "100%" }}>
      <img src={logo} alt="Logo" height={"80%"} />
      <Title order={3}>Flag Guesser</Title>
    </Group>
  );
}
