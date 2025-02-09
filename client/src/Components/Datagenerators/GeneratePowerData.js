const generatePowerData = (allDataStates, readings, temps, dateStates, devices) => {

    const {
        startdate,
        enddate,
        alldates,
        month,
        timefilter
    } = dateStates;

    const monthFilterFunc = () => {
        const monthArr = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        if (month.value) {
            const monthName = month.value.split(" ")[1];
            let monthNumber = monthArr.findIndex(month => month === monthName);
            monthNumber++;
            return { value: true, month: monthNumber }
        };
        return { value: false };
    };

    const monthFilter = monthFilterFunc();

    const readingsDataSource = readings.value.length > 0 ? readings.value
        .filter(obj => {
            if (timefilter.value === "dates") {
                return (obj.date.split(" ")[0] >= startdate.value && obj.date.split(" ")[0] <= enddate.value)
            } else if (timefilter.value === "month") {
                return parseInt(obj.date.split("-")[1]) === monthFilter.month;
            } else if (timefilter.value === "day") {
                return obj.date.split(" ")[0] === startdate.value;
            }
        })
        .reduce((acc, cur, index, array) => {
            if (Object.values(acc)[0] && Object.values(acc)[0].some(obj => obj.date === cur.date.split(" ")[0])) {
                return acc;
            };
            const names = Object.keys(readings.value[0].values);
            if (index === 0) {
                names.forEach(name => acc[name] = []);
            };
            const tomorrowDate = new Date(cur.date.split(" ")[0])
            tomorrowDate.setDate(tomorrowDate.getDate() + 1);
            const formatTomorrow = tomorrowDate.toISOString().slice(0, 10);

            if (timefilter.value === "day") {
                let firstObject;
                let lastObject = cur;
                if (cur.date.split(" ")[1] !== "00") {
                    firstObject = array[index - 1];
                };
                names.forEach(name => {
                    let value = firstObject?.values[name] - lastObject?.values[name];
                    acc[name].push({
                        date: cur.date,
                        value: isNaN(value) ? 0 : value
                    })
                });
                return acc;
            };

            const lastObjectList = readings.value.filter(obj => obj.date.split(" ")[0] === formatTomorrow);
            let lastObject = lastObjectList.reverse()[0];

            const firstObjectList = readings.value.filter(obj => obj.date.split(" ")[0] === cur.date.split(" ")[0]);
            let firstObject = firstObjectList.reverse()[0];

            if (!lastObject) {
                lastObject = firstObjectList.reverse()[0];
            };

            names.forEach(name => {
                acc[name].push({
                    date: cur.date.split(" ")[0],
                    value: lastObject.values[name] - firstObject.values[name],
                    firstDate: firstObject.date,
                    lastDate: lastObject.date
                })
            });

            return acc;
        }, {}) : {};

    Object.values(readingsDataSource).forEach(array => array.sort((a, b) => new Date(a.date) - new Date(b.date)))

    const tranformTemp = data => {
        const result = {};
        data.forEach(item => {
            const timeUnit = item.date.split(" ")[timefilter.value === "day" ? 1 : 0];
            const values = item.value;
            Object.entries(values).forEach(([name, temp]) => {
                if (!result[name]) {
                    result[name] = [];
                }
                const existingDay = result[name].find(entry => entry.date === timeUnit);
                if (existingDay) {
                    const currentCount = existingDay.count || 1;
                    existingDay.avgTemp = ((existingDay.avgTemp * currentCount) + temp) / (currentCount + 1);
                    existingDay.count = currentCount + 1;
                } else {
                    result[name].push({ date: timeUnit, avgTemp: temp, count: 1 });
                }
            });
        });

        Object.keys(result).forEach(name => {
            result[name] = result[name].map(({ date, avgTemp }) => ({ date, avgTemp }));
        });
        return result;
    };

    const tempDataSource = tranformTemp(temps.value.filter(obj => {
        if (timefilter.value === "date") {
            return (obj.date.split(" ")[0] >= startdate.value && obj.date.split(" ")[0] <= enddate.value)
        } else if (timefilter.value === "month") {
            return parseInt(obj.date.split("-")[1]) === monthFilter.month;
        } else if (timefilter.value === "day") {
            return obj.date.split(" ")[0] === startdate.value
        }
    }));

    let dateList = [];
    let startingDate = new Date("2024-12-22");
    let endingDate = new Date();
    while (startingDate <= endingDate) {
        dateList.push(startingDate.toISOString().slice(0, 10));
        startingDate.setDate(startingDate.getDate() + 1);
    };

    const borderColors = [
        "red", "blue", "green", "grey", "purple", "brown", "orange", "cyan",
        "magenta", "lime", "gold", "teal", "navy", "maroon", "aqua", "coral",
        "orchid", "khaki", "indigo", "violet", "crimson", "turquoise", "peru",
        "salmon", "darkorange", "darkgreen", "darkblue", "darkred", "darkmagenta",
        "lightgreen"
    ];

    const chartDataSets = Object.entries(allDataStates).map(([deviceName, state], index) => {
        const currentDevice = devices.value.find(obj => obj.deviceName === deviceName);
        const [dataSource, unit] = currentDevice.deviceType === "Relay" ? [readingsDataSource, "value"] : [tempDataSource, "avgTemp"];

        return state.value && {
            label: currentDevice.displayName,
            data: dataSource[deviceName]?.map((d) => d[unit].toFixed(2)),
            borderColor: borderColors[index],
            fill: false,
            tension: 0.4
        }
    });
    const hourArr = Array.from({ length: 24 }, (_, i) => i);

    const chartData = {
        labels: timefilter.value === "day" ? hourArr : dateList.filter(date => {
            if (timefilter.value === "dates") {
                return (date.split(" ")[0] >= startdate.value && date.split(" ")[0] <= enddate.value)
            } else if (timefilter.value === "month") {
                return parseInt(date.split("-")[1]) === monthFilter.month
            }
        }),
        datasets: chartDataSets.filter(Boolean),
    };


    const wattAndDate = Object.entries(readingsDataSource).reduce(([watt, dateObject], [deviceName, deviceValues], index) => {
        if(index === 0){
            Object.keys(readingsDataSource).map(deviceName => watt[deviceName] = 0);
        };
        const device = devices.value.find(obj => obj.deviceName === deviceName);
        if (!device) return [watt, dateObject]; // Handle missing devices
        if(!chartData.datasets.map(obj => obj.label).includes(device.displayName)) return [watt, dateObject];
        for (const value of deviceValues) {
            const date = new Date(value.date);
    
            if (device.wattFormat === "Watt") {
                watt[deviceName] += isNaN(value.value) ? 0 : (value.value / 1000);
            } else if (device.wattFormat === "Kilowatt") {
                watt[deviceName] += isNaN(value.value) ? 0 : value.value;
            }
            
            if (date < dateObject.startDate) {
                dateObject.startDate = date;
            }
            if (date > dateObject.endDate) {
                dateObject.endDate = date;
            }
        }
    
        return [watt, dateObject];
    }, [{}, { startDate: new Date(), endDate: 0}]);

    const formatDate = (dateStr) => {
        const months = ["Januari", "Februari", "Mars", "April", "Maj", "Juni", "Juli", "Augusti", "September", "Oktober", "November", "December"];
        const [year, month, day] = dateStr.split('-');
        return `${parseInt(day, 10)} ${months[parseInt(month, 10) - 1]} ${year}`;
    };

    const intervalStr = `${new Date(wattAndDate[1].startDate).toISOString().split("T")[0]} - ${new Date(wattAndDate[1].endDate).toISOString().split("T")[0]}`

    const summedWatts = Object.values(wattAndDate[0]).length > 0 ? Object.values(wattAndDate[0]).reduce((sum, cur) => {
       return sum += cur
    }) : 0;

    return {
        chartData,
        filterStr: {
            timeStr: {
                interval: intervalStr,
                month: month.value,
                day: formatDate(startdate.value)
            },
            deviceNo: chartData.datasets.length,
            watt: `${summedWatts.toFixed(2)} kwH` 
        },
        filterData: {
            devices: Object.keys(readingsDataSource),
            consumption: wattAndDate[0]
        }
    };
};

module.exports = generatePowerData;