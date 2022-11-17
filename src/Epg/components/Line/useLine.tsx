import React from "react";
//import { startOfDay } from "date-fns";

// Import types
import { DateTime } from "../../helpers/types";

// Import helpers
import { HOUR_IN_MINUTES, PROGRAM_REFRESH, getPositionX } from "../../helpers";

// Import hooks
import { useInterval } from "../../hooks";

interface useLineProps {
  startDate: DateTime;
  endDate: DateTime;
  dayWidth: number;
  hourWidth: number;
  sidebarWidth: number;
}

export function useLine({
  startDate,
  endDate,
  dayWidth,
  hourWidth,
  sidebarWidth,
}: useLineProps) {

  const date = new Date();
  const dateUtc = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
  const initialState =
    getPositionX(
      startDate,//startOfDay(new Date(startDate)),
      dateUtc,//new Date(),
      startDate,
      endDate,
      hourWidth
    ) + sidebarWidth;
  const [positionX, setPositionX] = React.useState<number>(() => initialState);

  const isDayEnd = positionX <= dayWidth;
  const isScrollX = React.useMemo(() => (isDayEnd ? PROGRAM_REFRESH : null), [
    isDayEnd,
  ]);

  useInterval(() => {
    const offset = hourWidth / HOUR_IN_MINUTES;
    const positionOffset = offset * 2;
    setPositionX((prev) => prev + positionOffset);
  }, isScrollX);

  React.useEffect(() => {
    const positionX = getPositionX(
      startDate,
      dateUtc,
      startDate,
      endDate,
      hourWidth
    );
    const newPositionX = positionX + sidebarWidth;
    setPositionX(newPositionX);
  }, [startDate, endDate, sidebarWidth, hourWidth]);

  return { positionX };
}
