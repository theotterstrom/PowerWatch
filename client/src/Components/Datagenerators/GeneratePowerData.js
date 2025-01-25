const options = require('./ChartOptions');
const generatePowerData = (allDataStates, dateStates, chartStates) => {
    const {
        nilleboAt,
        nillebovp,
        nillebovv,
        loveboat,
        readings,
        ottebo,
        pool,
        temps,
        nillebotemp,
        ottebotemp,
        lovetemp,
        utetemp,
    } = allDataStates;

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
            let lastObject = lastObjectList[0];

            const firstObjectList = readings.value.filter(obj => obj.date.split(" ")[0] === cur.date.split(" ")[0]);
            let firstObject = firstObjectList[0];

            if (!lastObject) {
                lastObject = firstObjectList[firstObjectList.length - 1];
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

    const chartData = {
        labels: dateList.filter(date => {
            if(alldates.value){
                return true
            } else if(monthFilter.value){
                return parseInt(date.split("-")[1]) === monthFilter.month
            };
            return (date >= startdate.value && date <= enddate.value);
        }),
        datasets: [
            nilleboAt.value && {
                label: "Nillebo AT",
                data: readingsDataSource["nilleboat"].map((d) => d.value.toFixed(2)),
                borderColor: "red",
                fill: false,
                tension: 0.4,
            },
            nillebovp.value && {
                label: "Nillebo VP",
                data: readingsDataSource["nillebovp"].map((d) => d.value.toFixed(2)),
                borderColor: "blue",
                fill: false,
                tension: 0.4,
            },
            nillebovv.value && {
                label: "Nillebo VV",
                data: readingsDataSource["nillebovv"].map((d) => d.value.toFixed(2)),
                borderColor: "green",
                fill: false,
                tension: 0.4,
            },
            loveboat.value && {
                label: "Lovebo AT",
                data: readingsDataSource["loveboat"].map((d) => d.value.toFixed(2)),
                borderColor: "grey",
                fill: false,
                tension: 0.4,
            },
            ottebo.value && {
                label: "Ottebo",
                data: readingsDataSource["ottebo"].map((d) => d.value.toFixed(2)),
                borderColor: "purple",
                fill: false,
                tension: 0.4,
            },
            pool.value && {
                label: "Pool",
                data: readingsDataSource["pool"].map((d) => d.value.toFixed(2)),
                borderColor: "brown",
                fill: false,
                tension: 0.4,
            },
            nillebotemp.value && {
                label: "Temp Nillebo",
                data: tempDataSource["nilletemp"].map((d) => d.avgTemp.toFixed(2)),
                borderColor: "orange",
                fill: false,
                tension: 0.4,
            },
            ottebotemp.value && {
                label: "Temp Ottebo",
                data: tempDataSource["ottetemp"].map((d) => d.avgTemp.toFixed(2)),
                borderColor: "cyan",
                fill: false,
                tension: 0.4,
            },
            lovetemp.value && {
                label: "Temp Lovebo",
                data: tempDataSource["lovetemp"].map((d) => d.avgTemp.toFixed(2)),
                borderColor: "magenta",
                fill: false,
                tension: 0.4,
            },
            utetemp.value && {
                label: "Temp Utomhus",
                data: tempDataSource["uttemp"].map((d) => d.avgTemp.toFixed(2)),
                borderColor: "lime",
                fill: false,
                tension: 0.4,
            },
        ].filter(Boolean),
    };

    return {
        chartData,
        chartOptions: options(window.innerWidth <= 1024, "Watt", chartStates)
    };
};

module.exports = generatePowerData;