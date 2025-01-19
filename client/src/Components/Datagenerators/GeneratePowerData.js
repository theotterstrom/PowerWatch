const generatePowerData = (allDataStates, dateStates) => {
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
        alldates
    } = dateStates;

    const readingsDataSource = readings.value.length > 0 ? readings.value
        .filter(obj => (obj.date.split(" ")[0] >= startdate.value && obj.date.split(" ")[0] <= enddate.value) || alldates.value)
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

            if(!lastObject){
                lastObject = firstObjectList[firstObjectList.length -1];
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

    const tempDataSource = tranformTemp(temps.value.filter(obj => (obj.date.split(" ")[0] >= startdate.value && obj.date.split(" ")[0] <= enddate.value) || alldates.value));

    let dateList = [];
    let startingDate = new Date("2024-12-22");
    let endingDate = new Date();
    while (startingDate <= endingDate) {
        dateList.push(startingDate.toISOString().slice(0, 10));
        startingDate.setDate(startingDate.getDate() + 1);
    };

    const chartData = {
        labels: dateList.filter(date => (date >= startdate.value && date <= enddate.value) || alldates.value),
        datasets: [
            nilleboAt.value && {
                label: "Nillebo Ackumulatortank",
                data: readingsDataSource["nilleboat"].map((d) => d.value),
                borderColor: "red",
                fill: false,
            },
            nillebovp.value && {
                label: "Nillebo Värmepump",
                data: readingsDataSource["nillebovp"].map((d) => d.value),
                borderColor: "blue",
                fill: false,
            },
            nillebovv.value && {
                label: "Nillebo Varmvatten",
                data: readingsDataSource["nillebovv"].map((d) => d.value),
                borderColor: "green",
                fill: false,
            },
            loveboat.value && {
                label: "Lovebo Ackumulatortank",
                data: readingsDataSource["loveboat"].map((d) => d.value),
                borderColor: "grey",
                fill: false,
            },
            ottebo.value && {
                label: "Ottebo",
                data: readingsDataSource["ottebo"].map((d) => d.value),
                borderColor: "purple",
                fill: false,
            },
            pool.value && {
                label: "Pool",
                data: readingsDataSource["pool"].map((d) => d.value),
                borderColor: "brown",
                fill: false,
            },
            nillebotemp.value && {
                label: "Temperatur Nillebo",
                data: tempDataSource["nilletemp"].map((d) => d.avgTemp),
                borderColor: "orange",
                fill: false,
            },
            ottebotemp.value && {
                label: "Temperatur Ottebo",
                data: tempDataSource["ottetemp"].map((d) => d.avgTemp),
                borderColor: "cyan",
                fill: false,
            },
            lovetemp.value && {
                label: "Temperatur Lovebo",
                data: tempDataSource["lovetemp"].map((d) => d.avgTemp),
                borderColor: "magenta",
                fill: false,
            },
            utetemp.value && {
                label: "Temperatur Utomhus",
                data: tempDataSource["uttemp"].map((d) => d.avgTemp),
                borderColor: "lime",
                fill: false,
            },
        ].filter(Boolean),
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                labels: {
                    color: "white",
                    font: {
                        size: window.innerWidth <= 1024 ? 20 : 12
                    }
                },
            },
        },
        scales: {
            x: {
                ticks: {
                    color: "white", // Set x-axis label color to white
                    font: {
                        size: window.innerWidth <= 1024 ? 20 : 12
                    }

                },
            },
            y: {
                ticks: {
                    color: "white", // Set y-axis label color to white
                    font: {
                        size: window.innerWidth <= 1024 ? 20 : 12
                    }
                },
            },
        },
    };

    const mobileOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: 'top',
                labels: {
                    color: "white", // Set legend label color to white
                    font: {
                        size: window.innerWidth <= 767 ? 12 : 20,
                    },
                },

            },
        },
        scales: {
            x: {
                grid: {
                    display: false,
                },
                ticks: {
                    color: "white",
                    maxRotation: 90, // Default rotation
                    minRotation: 90,
                    font: {
                        size: window.innerWidth <= 767 ? 12 : 20,
                    },
                }
            },
            y: {
                grid: {
                    display: true,
                },
                ticks: {
                    color: "white",
                    maxRotation: 90, // Default rotation
                    minRotation: 90,
                    font: {
                        size: window.innerWidth <= 767 ? 12 : 20,
                    },

                }
            },
        },
    };

    return {
        chartData,
        chartOptions: window.innerWidth <= 1024 ? mobileOptions : chartOptions
    }
};

module.exports = generatePowerData;