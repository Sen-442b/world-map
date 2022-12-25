import React, { useEffect, useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps";
import MouseTooltip from "react-sticky-mouse-tooltip";

export const Map = () => {
  const [tooltipText, setTooltipText] = useState<string>("");
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
