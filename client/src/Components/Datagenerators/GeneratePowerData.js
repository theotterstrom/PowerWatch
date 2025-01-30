const generatePowerData = (allDataStates, readings, temps, dateStates, devices) => {

    const {
        startdate,
        enddate,
        alldates,
        month
    } = dateStates;

    const monthFilterFunc = () => {
        const monthArr = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        if(month.value !== "None"){
            const monthName = month.value.split(" ")[1];
            let monthNumber = monthArr.findIndex(month => month === monthName);
            monthNumber++;
            return { value: true, month: monthNumber}
        };
        return { value: false };
    };

    const monthFilter = monthFilterFunc();

    const readingsDataSource = readings.value.length > 0 ? readings.value
        .filter(obj => {
            if(alldates.value){
                return true;
            } else if(monthFilter.value){
                return parseInt(obj.date.split("-")[1]) === monthFilter.month;
            };
            return (obj.date.split(" ")[0] >= startdate.value && obj.date.split(" ")[0] <= enddate.value)
        })
        .reduce((acc, cur, index) => {
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
            const day = item.date.split(" ")[0];
            const values = item.value;
            Object.entries(values).forEach(([name, temp]) => {
                if (!result[name]) {
                    result[name] = [];
                }
                const existingDay = result[name].find(entry => entry.date === day);
                if (existingDay) {
                    const currentCount = existingDay.count || 1;
                    existingDay.avgTemp = ((existingDay.avgTemp * currentCount) + temp) / (currentCount + 1);
                    existingDay.count = currentCount + 1;
                } else {
                    result[name].push({ date: day, avgTemp: temp, count: 1 });
                }
            });
        });

        Object.keys(result).forEach(name => {
            result[name] = result[name].map(({ date, avgTemp }) => ({ date, avgTemp }));
        });
        return result;
    };

    const tempDataSource = tranformTemp(temps.value.filter(obj => {
        if(alldates.value){
            return true;
        } else if(monthFilter.value){
            return parseInt(obj.date.split("-")[1]) === monthFilter.month;
        };
        return (obj.date.split(" ")[0] >= startdate.value && obj.date.split(" ")[0] <= enddate.value);
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
            data: dataSource[deviceName].map((d) => d[unit].toFixed(2)),
            borderColor: borderColors[index],
            fill: false,
            tension: 0.4
        }
    });
    const chartData = {
        labels: dateList.filter(date => {
            if(alldates.value){
                return true
            } else if(monthFilter.value){
                return parseInt(date.split("-")[1]) === monthFilter.month
            };
            return (date >= startdate.value && date <= enddate.value);
        }),
        datasets: chartDataSets.filter(Boolean),
    };

    return {
        chartData
    };
};

module.exports = generatePowerData;