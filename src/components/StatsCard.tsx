import {
  createStyles,
  ThemeIcon,
  Progress,
  Text,
  Group,
  Paper,
  rem,
  Title,
  Space,
  Badge,
} from "@mantine/core";
import { IconWorld } from "@tabler/icons-react";

const sections: { value: number; color: string }[] | undefined = [];
for (let value = 0; value <= 100; value += 5) {
  const redValue = 255 - Math.round((value / 100) * 255);
  const greenValue = Math.round((value / 100) * 255);
  const color = `rgb(${redValue}, ${greenValue}, 0)`;

  sections.push({ value, color });
}

const ICON_SIZE = rem(60);

interface StatsCardProps {
  continents: string;
  correctChoices: number;
  wrongChoices: number;
  totalChoices: number;
  score: number;
}

const useStyles = createStyles((theme) => ({
  card: {
    position: "relative",
    overflow: "visible",
    padding: theme.spacing.xl,
    paddingTop: `calc(${theme.spacing.xl} * 1.5 + ${ICON_SIZE} / 3)`,
  },

  icon: {
    position: "absolute",
    top: `calc(-${ICON_SIZE} / 3)`,
    left: `calc(50% - ${ICON_SIZE} / 2)`,
  },

  title: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    lineHeight: 1,
  },
}));

const StatsCard: React.FC<StatsCardProps> = ({
  continents,
  correctChoices,
  wrongChoices,
  totalChoices,
  score,
}) => {
  const { classes } = useStyles();

  return (
    <>
      <Group position="center">
        <Title variant="gradient" gradient={{ from: "green", to: "blue" }}>
          Game over
        </Title>
      </Group>
      <Space h={"md"} />
      <Paper
        radius="md"
        withBorder
        className={classes.card}
        mt={`calc(${ICON_SIZE} / 3)`}
      >
        <ThemeIcon className={classes.icon} size={ICON_SIZE} radius={ICON_SIZE}>
          <IconWorld size="2rem" stroke={1.5} />
        </ThemeIcon>
        <Text ta="center" fw={700} className={classes.title}>
          Statistics
        </Text>
        <Text c="dimmed" ta="center" fz="sm">
          {continents}
        </Text>

        <Progress
          value={(correctChoices / totalChoices) * 100}
          color={"darkGreen"}
          mt={5}
          animate
        />
        <Group position="apart" mt="md">
          <Text fw={500} fz="sm">
            Correct answers: {correctChoices}/{totalChoices} (
            {Math.round((correctChoices / totalChoices) * 100)}%)
          </Text>
          <Badge>{score} points</Badge>
        </Group>
      </Paper>
    </>
  );
};

export default StatsCard;
