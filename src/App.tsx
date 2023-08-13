import CountryList from "./data/countryList.js";
import {
  MantineProvider,
  ColorSchemeProvider,
  ColorScheme,
  AppShell,
  Header,
  Group,
  Button,
  Stack,
  Text,
  Center,
  Space,
  MultiSelect,
  Modal,
  Title,
} from "@mantine/core";
import { useColorScheme, useDisclosure, useLocalStorage } from "@mantine/hooks";
import { SegmentedToggle } from "./components/segmentedToggle";
import ReactCountryFlag from "react-country-flag";
import { useEffect, useState } from "react";
import Logo from "./components/logo";
import { ModalsProvider } from "@mantine/modals";

interface Country {
  countryFullName: string;
  countryISOCode: string;
  continent: string;
}

interface ContinentFilters {
  [continent: string]: boolean;
}

const continents = [
  "Africa",
  "Asia",
  "Europe",
  "NorthAmerica",
  "Oceania",
  "SouthAmerica",
];

const initialContinentFilters: ContinentFilters = {
  Africa: true,
  Asia: true,
  Europe: true,
  NorthAmerica: true,
  Oceania: true,
  SouthAmerica: true,
};

export default function App() {
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: "mantine-color-scheme",
    defaultValue: useColorScheme(),
    getInitialValueInEffect: true,
  });

  const [opened, { open, close }] = useDisclosure(false);

  const [correctChoices, setCorrectChoices] = useState(0);
  const [wrongChoices, setWrongChoices] = useState(0);
  const [correctCountryInfo, setCorrectCountryInfo] = useState("");
  const [continentFilters, setContinentFilters] = useState<ContinentFilters>(
    initialContinentFilters
  );

  const [timeLeft, setTimeLeft] = useState<number>(60); // 60 seconds
  const [gameStarted, setGameStarted] = useState<boolean>(false); // Track if the game has started

  const [selectedCountries, setSelectedCountries] = useState<Country[]>([]);
  const [randomCountry, setRandomCountry] = useState<Country>();

  const toggleColorScheme = (value?: ColorScheme): void =>
    setColorScheme(value ?? (colorScheme === "dark" ? "light" : "dark"));

  const filteredCountries = CountryList.filter(
    (country) => continentFilters[country.continent]
  );

  const getRandomCountries = () => {
    const shuffledCountries = filteredCountries.sort(() => 0.5 - Math.random());
    const selected = shuffledCountries.slice(0, 4);
    setSelectedCountries(selected);

    const randomIndex = Math.floor(Math.random() * selected.length);
    setRandomCountry(selected[randomIndex]);
    setCorrectCountryInfo("");
  };

  const compareCountry = (selectedCountry: Country) => {
    if (selectedCountry === randomCountry) {
      setCorrectChoices(correctChoices + 1);
      getRandomCountries();
      setCorrectCountryInfo("That was the correct answer");
    } else {
      setWrongChoices(wrongChoices + 1);
      getRandomCountries();
      setCorrectCountryInfo(
        `The correct country was: ` + randomCountry?.countryFullName
      );
    }
  };

  const resetCounters = () => {
    setCorrectChoices(0);
    setWrongChoices(0);
    getRandomCountries();
  };

  const handleMultiSelectChange = (values: string[]) => {
    if (values.length === 0) {
      return;
    }
    setContinentFilters(
      continents.reduce((filters, continent) => {
        filters[continent] = values.includes(continent);
        return filters;
      }, {} as Record<string, boolean>)
    );
    getRandomCountries();
  };

  useEffect(() => {
    getRandomCountries();
  }, []);

  useEffect(() => {
    if (gameStarted && timeLeft === 0) {
      open();
      setGameStarted(false);
    }

    if (gameStarted) {
      const interval = setInterval(() => {
        setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [timeLeft, correctChoices, gameStarted]);

  return (
    <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={toggleColorScheme}
    >
      <MantineProvider
        theme={{ colorScheme: colorScheme }}
        withGlobalStyles
        withNormalizeCSS
      >
        <ModalsProvider>
          <AppShell
            padding="md"
            header={
              <Header height={60}>
                {
                  <Group sx={{ height: "100%" }} px={10} position="apart">
                    <Logo />
                    <SegmentedToggle />
                  </Group>
                }
              </Header>
            }
          >
            <MultiSelect
              data={continents.map((continent) => ({
                value: continent,
                label: continent,
              }))}
              value={Object.keys(continentFilters).filter(
                (continent) => continentFilters[continent]
              )}
              onChange={handleMultiSelectChange}
              size="xl"
              placeholder="Select continents"
              multiple
            />
            <Space h={"md"} />
            <Stack align="end">
              {!gameStarted && (
                <Button
                  variant="gradient"
                  gradient={{ from: "orange", to: "red" }}
                  onClick={resetCounters}
                >
                  Reset Counters
                </Button>
              )}

              {!gameStarted && (
                <Button
                  color="blue"
                  onClick={() => {
                    setTimeLeft(60);
                    setCorrectChoices(0);
                    setWrongChoices(0);
                    setGameStarted(true); // Start the game when the button is clicked
                    getRandomCountries();
                  }}
                >
                  Start 1 Minute game
                </Button>
              )}
              {gameStarted && (
                <Text fw={700}>Time left: {timeLeft} seconds</Text>
              )}
            </Stack>
            <Center maw={100} h={300} mx="auto">
              {randomCountry ? (
                <div
                  style={{
                    boxShadow: "1px 2px 9px #000000",
                  }}
                >
                  <ReactCountryFlag
                    countryCode={randomCountry.countryISOCode.toString()}
                    svg
                    style={{
                      width: "20em",
                      height: "15em",
                    }}
                  />
                </div>
              ) : (
                <Text>A country should be placed here</Text>
              )}
            </Center>
            <Stack align="center">
              {selectedCountries.map((country) => (
                <Button
                  w={350}
                  size={"xl"}
                  onClick={() => compareCountry(country)}
                >
                  {country.countryFullName}
                </Button>
              ))}
              {correctCountryInfo && <Text fz="xl">{correctCountryInfo}</Text>}
              <Text c="green" fz="xl" fw={500}>
                Correct Choices: {correctChoices}
              </Text>
              <Text c="red" fz="xl" fw={500}>
                Wrong Choices: {wrongChoices}
              </Text>
            </Stack>
          </AppShell>
          <Modal id="deleteAusschreibungModal" opened={opened} onClose={close}>
            <Title variant="gradient" gradient={{ from: "green", to: "blue" }}>
              Game over
            </Title>
            <Text id="modalText" c="dimmed">
              You got {correctChoices} out of {correctChoices + wrongChoices}.
              That is{" "}
              {Math.round(
                (correctChoices / (correctChoices + wrongChoices)) * 100
              )}
              %
            </Text>
          </Modal>
        </ModalsProvider>
      </MantineProvider>
    </ColorSchemeProvider>
  );
}
