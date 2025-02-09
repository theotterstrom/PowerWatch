const generateSavingsData = (allDataStates, savings, dateStates, devices) => {

    const {
        savingsstartdate,
        savingsenddate,
        allsavingsdate,
        savingsmonth,
        timefilter
    } = dateStates;

    const monthFilterFunc = () => {
        const monthArr = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        if (savingsmonth.value) {
            const monthName = savingsmonth.value.split(" ")[1];
            let monthNumber = monthArr.findIndex(month => month === monthName);
            monthNumber++;
            return { value: true, month: monthNumber }
        };
        return { value: false };
    };

    const monthFilter = monthFilterFunc()

    const filteredSavings = savings.value.filter(obj => {
        if (timefilter.value === "dates") {
            return (obj.date.split(" ")[0] >= savingsstartdate.value && obj.date.split(" ")[0] <= savingsenddate.value)
        } else if (timefilter.value === "month") {
            return parseInt(obj.date.split("-")[1]) === monthFilter.month;
        } else if (timefilter.value === "day") {
            return obj.date.split(" ")[0] === savingsstartdate.value;
        }
    });

    const [totalSpending, savingsDataSource] = filteredSavings.reduce(([totals, acc], cur, index) => {
        let sum1 = 0;
        let sum2 = 0;
        const names = devices.value.filter(obj => obj.deviceType === "Relay").map(obj => obj.deviceName);

        if (index === 0) {
            names.forEach(name => acc[name] = []);
        }


        names.forEach(name => {
            const realCost = cur.values[name]?.realCost || null;
            const averageCost = cur.values[name]?.averageCost || null;
            sum1 += allDataStates[name]?.value ? realCost : 0;
            sum2 += allDataStates[name]?.value ? averageCost : 0;

            if (acc[name]) {
                const date = timefilter.value === "day" ? cur.date : cur.date.split(" ")[0];
                const existingIndex = acc[name].findIndex(obj => obj.date === date);

                if (existingIndex === -1 || timefilter.value === "day") {
                    acc[name].push({ date, realCost, averageCost });
                } else {
                    acc[name][existingIndex].realCost += realCost;
                    acc[name][existingIndex].averageCost += averageCost;
                };
            };
        });

        return [[totals[0] + sum1, totals[1] + sum2], acc];
    }, [[0, 0], {}]);
    console.log(savingsDataSource)
    Object.values(savingsDataSource).forEach(array => array.sort((a, b) => new Date(a.date) - new Date(b.date)))
    let dateList = [];
    let startingDate = new Date("2024-12-24");
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

    let colorIndex = 0;
    const unprocessedSets = Object.entries(allDataStates).map(([deviceName, state]) => {
        const currentDevice = devices.value.find(obj => obj.deviceName === deviceName);
        const realCost = state.value && {
            label: currentDevice.displayName + " real",
            data: savingsDataSource[deviceName] ? savingsDataSource[deviceName].map((d) => (d["realCost"] / 100).toFixed(2)) : [],
            borderColor: borderColors[colorIndex],
            fill: false,
            tension: 0.4
        };
        colorIndex++;
        const averageCost = state.value && {
            label: currentDevice.displayName + " average",
            data: savingsDataSource[deviceName] ? savingsDataSource[deviceName].map((d) => (d["averageCost"] / 100).toFixed(2)) : [],
            borderColor: borderColors[colorIndex],
            fill: false,
            tension: 0.4
        };
        colorIndex++;
        return {
            realCost,
            averageCost
        }
    });

    const chartDataSets = unprocessedSets.reduce((acc, cur) => {
        acc.push(cur.realCost);
        acc.push(cur.averageCost);
        return acc
    }, []);
    console.log(chartDataSets.filter(Boolean),)
    const hourArr = Array.from({ length: 24 }, (_, i) => i);

    const savingsData = {
        labels: timefilter.value === "day" ? hourArr : dateList.filter(date => {
            if (timefilter.value === "dates") {
                return (date.split(" ")[0] >= savingsstartdate.value && date.split(" ")[0] <= savingsenddate.value)
            } else if (timefilter.value === "month") {
                return parseInt(date.split("-")[1]) === monthFilter.month
            }
        }),
        datasets: chartDataSets.filter(Boolean),
    };

    const intervalValue = Object.entries(savingsDataSource).reduce((dateObject, [deviceName, deviceValues], index) => {
        const device = devices.value.find(obj => obj.deviceName === deviceName);
        if (!device) return dateObject; // Handle missing devices
        if (!savingsData.datasets.map(obj => obj.label).includes(device.displayName)) return dateObject;
        for (const value of deviceValues) {
            const date = new Date(value.date);

            if (date < dateObject.startDate) {
                dateObject.startDate = date;
            }
            if (date > dateObject.endDate) {
                dateObject.endDate = date;
            }
        };

        return dateObject;
    }, { startDate: new Date(), endDate: 0 });

    const formatDate = (dateStr) => {
        const months = ["Januari", "Februari", "Mars", "April", "Maj", "Juni", "Juli", "Augusti", "September", "Oktober", "November", "December"];
        const [year, month, day] = dateStr.split('-');
        return `${parseInt(day, 10)} ${months[parseInt(month, 10) - 1]} ${year}`;
    };
    const intervalStr = `${new Date(intervalValue.startDate).toISOString().split("T")[0]} - ${new Date(intervalValue.endDate).toISOString().split("T")[0]}`
    return {
        savingsData,
        filterStr: {
            timeStr: {
                interval: intervalStr,
                month: savingsmonth.value,
                day: formatDate(savingsstartdate.value)
            },
            deviceNo: savingsData.datasets.length,
        },
        filterData: {
            devices: Object.keys(savingsDataSource),
        },
        totalSpending,
        totalSaved: totalSpending[1] - totalSpending[0]
    }
};
module.exports = generateSavingsData;