const generateSavingsData = (allDataStates) => {
    const {
        nilleboatsavings,
        nillebovpsavings,
        nillebovvsavings,
        loveboatsavings,
        lovebovvsavings,
        ottebosavings,
        garagesavings,
        poolsavings,
        savingsstartdate,
        savingsenddate,
        allsavingsdate,
        savings,
    } = allDataStates;

    const filterObj = {
        nilleboat: nilleboatsavings.value,
        nillebovp: nillebovpsavings.value,
        nillebovv: nillebovvsavings.value,
        loveboat: loveboatsavings.value,
        lovebovv: lovebovvsavings.value,
        ottebo: ottebosavings.value,
        garage: garagesavings.value,
        pool: poolsavings.value
    };

    let newSavingsList = JSON.parse(JSON.stringify(savings))
    for (const saving of newSavingsList.value) {
        const values = saving.values;
        for (const device of Object.keys(values)) {
            if (!filterObj[device]) {
                delete values[device];
            }
        }
    };

    const totalSpendning = newSavingsList.value
        .filter(obj => (obj.date.split(" ")[0] >= savingsstartdate.value && obj.date.split(" ")[0] <= savingsenddate.value) || allsavingsdate.value)
        .reduce(([spending, average], cur) => {
            let sum1 = 0;
            let sum2 = 0;
            for (const device of Object.values(cur.values)) {
                sum1 += device.realCost;
                sum2 += device.averageCost;
            };
            return [spending += sum1, average += sum2]
        }, [0, 0]);

    const savingsDataSource = newSavingsList.value.length > 0 ? newSavingsList.value
        .filter(obj => (obj.date.split(" ")[0] >= savingsstartdate.value && obj.date.split(" ")[0] <= savingsenddate.value) || allsavingsdate.value)
        .reverse()
        .reduce((acc, cur, index) => {

            const names = Object.keys(newSavingsList.value[0].values);
            if (index === 0) {
                names.forEach(name => acc[name] = []);
            };

            names.forEach(name => {
                if (!acc[name].some(obj => obj.date === cur.date.split(" ")[0])) {
                    acc[name].push({
                        date: cur.date.split(" ")[0],
                        realCost: cur.values[name].realCost,
                        averageCost: cur.values[name].averageCost
                    });
                } else {
                    const currentDateObjIndex = acc[name].findIndex(obj => obj.date === cur.date.split(" ")[0]);
                    acc[name][currentDateObjIndex].realCost += cur.values[name].realCost;
                    acc[name][currentDateObjIndex].averageCost += cur.values[name].averageCost;
                };
            });

            return acc;
        }, {}) : {};
    Object.values(savingsDataSource).forEach(array => array.sort((a, b) => new Date(a.date) - new Date(b.date)))

    let dateList = [];
    let startingDate = new Date("2024-12-24");
    let endingDate = new Date();
    while (startingDate <= endingDate) {
        dateList.push(startingDate.toISOString().slice(0, 10));
        startingDate.setDate(startingDate.getDate() + 1);
    };
    const savingsData = {
        labels: dateList.filter(date => (date >= savingsstartdate.value && date <= savingsenddate.value) || allsavingsdate.value),
        datasets: [
            nilleboatsavings.value && {
                label: "Nillebo AT verklig",
                data: savingsDataSource["nilleboat"].map((d) => d.realCost / 100),
                borderColor: "red",
                fill: false,
            },
            nilleboatsavings.value && {
                label: "Nillebo AT snitt",
                data: savingsDataSource["nilleboat"].map((d) => d.averageCost / 100),
                borderColor: "blue",
                fill: false,
            },

            nillebovpsavings.value && {
                label: "Nillebo VP verklig",
                data: savingsDataSource["nillebovp"].map((d) => d.realCost / 100),
                borderColor: "green",
                fill: false,
            },
            nillebovpsavings.value && {
                label: "Nillebo VP snitt",
                data: savingsDataSource["nillebovp"].map((d) => d.averageCost / 100),
                borderColor: "black",
                fill: false,
            },

            nillebovvsavings.value && {
                label: "Nillebo VV verklig",
                data: savingsDataSource["nillebovv"].map((d) => d.realCost / 100),
                borderColor: "purple",
                fill: false,
            },
            nillebovvsavings.value && {
                label: "Nillebo VV snitt",
                data: savingsDataSource["nillebovv"].map((d) => d.averageCost / 100),
                borderColor: "brown",
                fill: false,
            },

            loveboatsavings.value && {
                label: "Lovebo AT verklig",
                data: savingsDataSource["loveboat"].map((d) => d.realCost / 100),
                borderColor: "orange",
                fill: false,
            },
            loveboatsavings.value && {
                label: "Lovebo AT snitt",
                data: savingsDataSource["loveboat"].map((d) => d.averageCost / 100),
                borderColor: "cyan",
                fill: false,
            },

            lovebovvsavings.value && {
                label: "Lovebo VV verklig",
                data: savingsDataSource["lovebovv"].map((d) => d.realCost / 100),
                borderColor: "magenta",
                fill: false,
            },
            lovebovvsavings.value && {
                label: "Lovebo VV snitt",
                data: savingsDataSource["lovebovv"].map((d) => d.averageCost / 100),
                borderColor: "lime",
                fill: false,
            },

            ottebosavings.value && {
                label: "Ottebo verklig",
                data: savingsDataSource["ottebo"].map((d) => d.realCost / 100),
                borderColor: "lightblue",
                fill: false,
            },
            ottebosavings.value && {
                label: "Ottebo snitt",
                data: savingsDataSource["ottebo"].map((d) => d.averageCost / 100),
                borderColor: "pink",
                fill: false,
            },

            garagesavings.value && {
                label: "Garage verklig",
                data: savingsDataSource["garage"].map((d) => d.realCost / 100),
                borderColor: "yellow",
                fill: false,
            },
            garagesavings.value && {
                label: "Garage snitt",
                data: savingsDataSource["garage"].map((d) => d.averageCost / 100),
                borderColor: "grey",
                fill: false,
            },

            poolsavings.value && {
                label: "Pool verklig",
                data: savingsDataSource["pool"].map((d) => d.realCost / 100),
                borderColor: "turqoise",
                fill: false,
            },
            poolsavings.value && {
                label: "Pool snitt",
                data: savingsDataSource["pool"].map((d) => d.averageCost / 100),
                borderColor: "darkred",
                fill: false,
            },
        ].filter(Boolean),
    };
    const savingsOptions = {
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
        savingsData,
        savingsOptions: window.innerWidth <= 1024 ? mobileOptions : savingsOptions,
        totalSpendning,
        totalSaved: totalSpendning[1] - totalSpendning[0]
    }
};
module.exports = generateSavingsData;