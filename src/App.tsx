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
  Checkbox,
} from "@mantine/core";
import { useColorScheme, useLocalStorage } from "@mantine/hooks";
import { SegmentedToggle } from "./components/segmentedToggle";
import ReactCountryFlag from "react-country-flag";
import { useEffect, useState } from "react";
import Logo from "./components/logo";

interface Country {
  countryFullName: string;
  countryISOCode: string;
  continent: string;
}

interface ContinentFilters {
  [continent: string]: boolean;
}

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

  const [correctChoices, setCorrectChoices] = useState(0);
  const [wrongChoices, setWrongChoices] = useState(0);
  const [correctCountryInfo, setCorrectCountryInfo] = useState("");
  const [continentFilters, setContinentFilters] = useState<ContinentFilters>(
    initialContinentFilters
  );

  const [selectedCountries, setSelectedCountries] = useState<Country[]>([]);

  const [randomCountry, setRandomCountry] = useState<Country | null>();

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
  };

  const compareCountry = (
    selectedCountry:
      | { countryFullName: String; countryISOCode: String }
      | null
      | undefined
  ) => {
    if (selectedCountry === randomCountry) {
      setCorrectChoices(correctChoices + 1);
      getRandomCountries();
      setCorrectCountryInfo("");
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

  const handleContinentFilterChange = (continent: string) => {
    if (
      Object.values(continentFilters).filter(Boolean).length === 1 &&
      continentFilters[continent]
    ) {
      return;
    }

    setContinentFilters({
      ...continentFilters,
      [continent]: !continentFilters[continent],
    });
    getRandomCountries();
  };

  useEffect(() => {
    getRandomCountries();
  }, []);

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
        <AppShell
          padding="md"
          header={
            <Header height={60}>
              {
                <Group sx={{ height: "100%" }} px={10} position="apart">
                  <Group sx={{ height: "100%" }}>
                    <Logo />
                  </Group>
                  <Group>
                    <SegmentedToggle />
                    {Object.keys(continentFilters).map((continent) => (
                      <Checkbox
                        label={continent}
                        key={continent}
                        checked={continentFilters[continent]}
                        onChange={() => handleContinentFilterChange(continent)}
                      >
                        {continent}
                      </Checkbox>
                    ))}
                    <Button
                      variant="gradient"
                      gradient={{ from: "orange", to: "red" }}
                      onClick={resetCounters}
                    >
                      Reset Counters
                    </Button>
                  </Group>
                </Group>
              }
            </Header>
          }
        >
          <Center maw={200} h={600} mx="auto">
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
              <Text></Text>
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
            <Space h="md" />
            {correctCountryInfo && <Text fz="xl">{correctCountryInfo}</Text>}
            <Text fz="xl">Correct Choices: {correctChoices}</Text>
            <Text fz="xl">Wrong Choices: {wrongChoices}</Text>
          </Stack>
        </AppShell>
      </MantineProvider>
    </ColorSchemeProvider>
  );
}
