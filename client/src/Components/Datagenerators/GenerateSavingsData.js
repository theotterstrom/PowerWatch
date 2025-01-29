const options = require('./ChartOptions');
const generateSavingsData = (allDataStates, savings, dateStates, chartStates, devices) => {

    const {
        savingsstartdate,
        savingsenddate,
        allsavingsdate,
        savingsmonth
    } = dateStates;

    const monthFilterFunc = () => {
        const monthArr = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        if (savingsmonth.value !== "None") {
            const monthName = savingsmonth.value.split(" ")[1];
            let monthNumber = monthArr.findIndex(month => month === monthName);
            monthNumber++;
            return { value: true, month: monthNumber }
        };
        return { value: false };
    };

    const monthFilter = monthFilterFunc()

    const filteredSavings = savings.value.filter(obj => {
        if (allsavingsdate.value) {
            return true;
        } else if (monthFilter.value) {
            return parseInt(obj.date.split("-")[1]) === monthFilter.month;
        }
        return obj.date.split(" ")[0] >= savingsstartdate.value && obj.date.split(" ")[0] <= savingsenddate.value;
    });

    const [totalSpending, savingsDataSource] = filteredSavings.reduce(
        ([totals, acc], cur, index) => {
            let sum1 = 0;
            let sum2 = 0;
            const names = Object.keys(cur.values);

            if (index === 0) {
                names.forEach(name => acc[name] = []);
            }
            
            names.forEach(name => {
                const realCost = cur.values[name].realCost;
                const averageCost = cur.values[name].averageCost;
                sum1 += allDataStates[name]?.value ? realCost : 0;
                sum2 += allDataStates[name]?.value ? averageCost : 0;

                const date = cur.date.split(" ")[0];
                if(acc[name]){
                    const existingIndex = acc[name].findIndex(obj => obj.date === date);
                    if (existingIndex === -1) {
                        acc[name].push({ date, realCost, averageCost });
                    } else {
                        acc[name][existingIndex].realCost += realCost;
                        acc[name][existingIndex].averageCost += averageCost;
                    };
                };
            });

            return [[totals[0] + sum1, totals[1] + sum2], acc];
        },
        [[0, 0], {}]
    );

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
            data: savingsDataSource[deviceName].map((d) => (d["realCost"] / 100).toFixed(2)),
            borderColor: borderColors[colorIndex],
            fill: false,
            tension: 0.4
        };
        colorIndex++;
        const averageCost = state.value && {
            label: currentDevice.displayName + " average",
            data: savingsDataSource[deviceName].map((d) => (d["averageCost"] / 100).toFixed(2)),
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

    const savingsData = {
        labels: dateList.filter(date => {
            if (allsavingsdate.value) {
                return true;
            } else if (monthFilter.value) {
                return parseInt(date.split("-")[1]) === monthFilter.month;
            };
            return (date >= savingsstartdate.value && date <= savingsenddate.value)
        }),
        datasets: chartDataSets.filter(Boolean),
    };

    return {
        savingsData,
        savingsOptions: options(window.innerWidth <= 1024, 'Kostnad', chartStates),
        totalSpending,
        totalSaved: totalSpending[1] - totalSpending[0]
    }
};
module.exports = generateSavingsData;