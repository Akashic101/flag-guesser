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
} from "@mantine/core";
import { useColorScheme, useDisclosure, useLocalStorage } from "@mantine/hooks";
import { SegmentedToggle } from "./components/segmentedToggle";
import ReactCountryFlag from "react-country-flag";
import { useEffect, useState } from "react";
import Logo from "./components/logo";
import { ModalsProvider } from "@mantine/modals";
import StatsCard from "./components/StatsCard";

interface Country {
  countryFullName: string;
  countryISOCode: string;
  continent: string;
  capital?: string;
  funFact?: string;
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

  const [score, setScore] = useState<number>(0);
  const [correctStreak, setCorrectStreak] = useState<number>(0);

  const [selectedContinents, setSelectedContinents] = useState<string[]>([]);

  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [activeHint, setActiveHint] = useState<boolean>(false);
  const [hint, setHint] = useState<string | undefined>("");
  const [pointsToGain, setPointsToGain] = useState<number>(100);
  const [selectedCountries, setSelectedCountries] = useState<Country[]>([]);
  const [randomCountry, setRandomCountry] = useState<Country>({
    capital: "Berlin",
    countryISOCode: "de",
    continent: "Europe",
    countryFullName: "Germany",
  });

  const [lastChosenCountryIndices, setLastChosenCountryIndices] = useState<
    Set<number>
  >(new Set());

  const toggleColorScheme = (value?: ColorScheme): void =>
    setColorScheme(value ?? (colorScheme === "dark" ? "light" : "dark"));

  const filteredCountries = CountryList.filter(
    (country) => continentFilters[country.continent]
  );

  const getRandomCountryWithDistance = (excludeIndices: number[] = []) => {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * filteredCountries.length);
    } while (
      lastChosenCountryIndices.has(newIndex) ||
      excludeIndices.includes(newIndex)
    );
    return newIndex;
  };

  const getRandomCountries = () => {
    const randomIndices: number[] | undefined = [];

    while (randomIndices.length < 4) {
      const randomIndex = getRandomCountryWithDistance(randomIndices);
      randomIndices.push(randomIndex);
    }

    const selectedCountriesArray = randomIndices.map(
      (index) => filteredCountries[index]
    );
    setSelectedCountries(selectedCountriesArray);

    const selectedCountryIndex = Math.floor(Math.random() * 4);
    const selectedCountry = selectedCountriesArray[selectedCountryIndex];
    setRandomCountry(selectedCountry);
    setCorrectCountryInfo("");

    setLastChosenCountryIndices((prevSet) => {
      const newSet = new Set(prevSet);
      if (newSet.size >= 10) {
        newSet.delete([...newSet][0]); // Remove the oldest entry
      }
      newSet.add(randomIndices[selectedCountryIndex]); // Add the index of the correct country
      return newSet;
    });
  };

  const compareCountry = (selectedCountry: Country) => {
    if (selectedCountry === randomCountry) {
      setCorrectChoices(correctChoices + 1);
      setScore((prevScore) => prevScore + (pointsToGain + 10 * correctStreak));
      setCorrectStreak(correctStreak + 1);
      setCorrectCountryInfo("That was the correct answer");
    } else {
      setWrongChoices(wrongChoices + 1);
      setScore((prevScore) => Math.max(0, prevScore - 50));
      setCorrectStreak(0);
      setCorrectCountryInfo(
        `The correct country was: ` + randomCountry?.countryFullName
      );
    }
    setActiveHint(false);
    getRandomCountries();
  };

  const resetCounters = () => {
    setScore(0);
    setCorrectStreak(0);
    setCorrectChoices(0);
    setWrongChoices(0);
    getRandomCountries();
    setPointsToGain(100);
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

  function showHint() {
    if (randomCountry?.capital) {
      setHint("The capital of this country is " + randomCountry?.capital);
    } else {
      setHint(randomCountry?.funFact);
    }
    setActiveHint(true);
    setPointsToGain(10);
  }

  useEffect(() => {
    getRandomCountries();
  }, []);

  useEffect(() => {
    if (gameStarted && timeLeft === 0) {
      setSelectedContinents(
        continents.filter((continent) => continentFilters[continent])
      );
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
            {!gameStarted && (
              <>
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
              </>
            )}
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
                    setScore(0);
                    setCorrectStreak(0);
                    setTimeLeft(60);
                    setCorrectChoices(0);
                    setWrongChoices(0);
                    setGameStarted(true);
                    getRandomCountries();
                  }}
                >
                  Start 1 Minute game
                </Button>
              )}
              {gameStarted && (
                <Stack>
                  <Text fw={700}>Time left: {timeLeft} seconds</Text>
                  <Text fw={700}>Score: {score}</Text>
                </Stack>
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
                <Text>A country should be placed here. Guess it wasn't</Text>
              )}
            </Center>
            <Stack align="center">
              {!activeHint && (
                <Button size={"xs"} onClick={showHint} variant="outline">
                  Show hint
                </Button>
              )}
              {activeHint && <Text>{hint}</Text>}

              {selectedCountries.map((country) => (
                <Button
                  w={350}
                  size={"xl"}
                  onClick={() => compareCountry(country)}
                >
                  {country.countryFullName}
                </Button>
              ))}
              {correctCountryInfo && (
                <Text fw={800} fz="xl">
                  {correctCountryInfo}
                </Text>
              )}
              <Text c="green" fz="xl" fw={500}>
                Correct Choices: {correctChoices}
              </Text>
              <Text c="red" fz="xl" fw={500}>
                Wrong Choices: {wrongChoices}
              </Text>
            </Stack>
          </AppShell>
          <Modal opened={opened} onClose={close}>
            <StatsCard
              continents={selectedContinents.join(", ")}
              correctChoices={correctChoices}
              wrongChoices={wrongChoices}
              totalChoices={correctChoices + wrongChoices}
              score={score}
            />
          </Modal>
        </ModalsProvider>
      </MantineProvider>
    </ColorSchemeProvider>
  );
}
