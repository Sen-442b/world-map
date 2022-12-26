import React, { useEffect, useMemo, useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from "react-simple-maps";
import MouseTooltip from "react-sticky-mouse-tooltip";
import { csv } from "d3-fetch";
import { scaleLinear } from "d3";

type CountryDataObj = {
  "Country or area": string;

  "Internet users": string;

  Percentage: string;

  Subregion: string;

  latitude: string;
  longitude: string;
};
export const Map = () => {
  const [tooltipText, setTooltipText] = useState<string>("");
  const [maxValue, setMaxValue] = useState<number>(0);
  const [countriesData, setCountriesData] = useState<CountryDataObj[] | any>(
    []
  );
  useEffect(() => {
    (async () => {
      const countries = await csv(
        "./List_of_countries_by_number_of_Internet_users_3.csv"
      );
      const filteredCountries = countries.filter(
        (country) => country.Percentage
      );
      const sortedCountries = [...filteredCountries].sort(
        (a, b) => Number(b.Percentage) - Number(a.Percentage)
      );
      console.log(sortedCountries);

      setMaxValue(Number(sortedCountries[0].Percentage));
      setCountriesData(sortedCountries);
    })();
  }, []);
  const percentScale = useMemo(
    () => scaleLinear().domain([0, maxValue]).range([0, 9]),
    [maxValue]
  );
  return (
    <div data-tip="">
      <ComposableMap>
        <ZoomableGroup>
          <Geographies geography="https://world-map-backend.sen442b.repl.co/features">
            {({ geographies }) => {
              return geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  style={{
                    default: {
                      fill: "#D6D6DA",
                      outline: "none",
                    },
                    hover: {
                      fill: "#F53",
                      outline: "none",
                    },
                    pressed: {
                      fill: "#E42",
                      outline: "none",
                    },
                  }}
                  onMouseEnter={() => setTooltipText(geo.properties.name)}
                  onMouseLeave={() => setTooltipText("")}
                />
              ));
            }}
          </Geographies>
          {countriesData.map((country: CountryDataObj) => {
            const { latitude, longitude, Percentage: percentage } = country;

            return (
              <Marker
                key={crypto.randomUUID()}
                coordinates={[Number(longitude), Number(latitude)]}
              >
                <circle
                  fill="rgba(43, 136, 229, 0.776)"
                  stroke="rgba(255, 255, 255, 0.833)"
                  r={percentScale(Number(percentage))}
                />
              </Marker>
            );
          })}
        </ZoomableGroup>
      </ComposableMap>
      {tooltipText && (
        <MouseTooltip visible={true} offsetX={25} offsetY={15}>
          <span>{tooltipText}</span>
        </MouseTooltip>
      )}
    </div>
  );
};
