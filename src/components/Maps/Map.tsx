import React, { memo, useEffect, useMemo, useState } from "react";
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
  Region: string;

  latitude: string;
  longitude: string;
};

type tooltipDataObj = {
  country: string;
  internetUsers: string | number;
  region: string;
  subRegion: string;
  percent: string | number;
};
const initialTooltipDataObj = {
  country: "",
  internetUsers: "",
  region: "",
  subRegion: "",
  percent: "",
};
const Map = () => {
  const [tooltipData, setTooltipData] = useState<tooltipDataObj>(
    initialTooltipDataObj
  );
  const { country, internetUsers, region, subRegion, percent } = tooltipData;
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
    <div data-tip="" className="world-map">
      <ComposableMap>
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
                    fill: "rgba(255, 85, 51, 0.808)",
                    outline: "none",
                  },
                  pressed: {
                    fill: "#E42",
                    outline: "none",
                  },
                }}
                onMouseOver={() =>
                  setTooltipData((prevObj) => ({
                    ...prevObj,
                    country: geo.properties.name,
                  }))
                }
                onMouseOut={() =>
                  setTooltipData((prevObj) => ({ ...prevObj, country: "" }))
                }
              />
            ));
          }}
        </Geographies>
        {countriesData.map((currCountry: CountryDataObj) => {
          const {
            ["Country or area"]: country,
            ["Internet users"]: internetUsers,
            ["Region"]: region,
            ["Subregion"]: subRegion,
            latitude,
            longitude,
            Percentage: percent,
          } = currCountry;

          return (
            <Marker
              key={crypto.randomUUID()}
              coordinates={[Number(longitude), Number(latitude)]}
            >
              <circle
                fill="rgba(43, 136, 229, 0.776)"
                stroke="rgba(255, 255, 255, 0.833)"
                r={percentScale(Number(percent))}
                onMouseEnter={() => {
                  setTooltipData((prevObj) => ({
                    ...prevObj,
                    country,
                    internetUsers,
                    percent,
                    region,
                    subRegion,
                  }));
                }}
                onMouseLeave={() => setTooltipData(initialTooltipDataObj)}
              />
            </Marker>
          );
        })}
      </ComposableMap>
      {country && (
        <MouseTooltip visible={true} offsetX={2} offsetY={1}>
          <div className="tooltip">
            <p>{country}</p>

            {region && (
              <>
                <small>
                  {Number(percent) * 100}% of the population has internet access
                </small>
                <div>
                  <p>Total internet users: {internetUsers}</p>
                  <p>Region: {region}</p>
                  <p>Sub region: {subRegion}</p>
                </div>
              </>
            )}
          </div>
        </MouseTooltip>
      )}
    </div>
  );
};

export default memo(Map);
