import React, { useState, useMemo } from "react";
import generatePowerData from "../Datagenerators/GeneratePowerData";
import PowerOptions from "../Options/PowerOptions";
import LineGenerator from './LineGenerator';

const PowerOptionChild = React.memo(({ allDataStates, dateStates, devices, filterStr, filterData }) => {
  const initData = useMemo(() => ({ allDataStates, dateStates, devices, filterStr, filterData }), [allDataStates, dateStates, devices, filterStr, filterData]);
  return <PowerOptions initData={initData} />
});

const LineChild = React.memo(({ lineDataProp }) => {
  const lineData = useMemo(() => ({ lineDataProp }), [lineDataProp]);
  return <LineGenerator lineData={lineData} />
});

export default ({ initData }) => {
  const { readings, temps, devices } = initData;
  const deviceNames = devices.value.map(obj => obj.deviceName)
  const stateObject = Object.fromEntries(deviceNames.map(obj => [obj, true]));

  const [states, setStates] = useState(stateObject);

  const today = new Date();
  const oneWeekAgoDate = new Date();
  oneWeekAgoDate.setDate(today.getDate() - 7);
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const [startDate, setStartDate] = useState(oneWeekAgoDate.toISOString().split("T")[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split("T")[0]);
  const [allDates, setAllDates] = useState(false);
  const [month, setMonth] = useState(`${today.getFullYear()} ${monthNames[today.getMonth()]}`);
  const [timeFilter, setTimeFilter] = useState("dates");
  
  const allDataStates = useMemo(() => {
    const dynamicStates = Object.fromEntries(
      Object.entries(states).map(([key, value]) => [
        key,
        {
          value,
          set: (newValue) =>
            setStates((prev) => ({
              ...prev,
              [key]: newValue,
            })),
        },
      ])
    );

    return {
      ...dynamicStates
    };
  }, [states]);

  const dateStates = useMemo(() => ({
    startdate: { value: startDate, set: setStartDate },
    enddate: { value: endDate, set: setEndDate },
    alldates: { value: allDates, set: setAllDates },
    month: { value: month, set: setMonth },
    timefilter: { value: timeFilter, set: setTimeFilter }
  }), [startDate, endDate, allDates, month, timeFilter]);

  const { chartData, filterStr, filterData } = generatePowerData(allDataStates, readings, temps, dateStates, devices);

  return (<>
    <div className="mx-0 my-5 p-0">
      <PowerOptionChild allDataStates={allDataStates} dateStates={dateStates} devices={devices} filterStr={filterStr} filterData={filterData} />
      <LineChild lineDataProp={chartData} /> 
    </div>
  </>
  );
};