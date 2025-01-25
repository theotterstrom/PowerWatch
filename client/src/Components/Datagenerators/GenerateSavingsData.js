const options = require('./ChartOptions');
const generateSavingsData = (allDataStates, chartStates) => {
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
        savingsmonth
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

    const totalSpendning = newSavingsList.value
        .filter(obj => {
            if (monthFilter.value) {
                return parseInt(obj.date.split("-")[1]) === monthFilter.month;
            };
            return (obj.date.split(" ")[0] >= savingsstartdate.value && obj.date.split(" ")[0] <= savingsenddate.value) || allsavingsdate.value
        })
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
        .filter(obj => {
            if (monthFilter.value) {
                return parseInt(obj.date.split("-")[1]) === monthFilter.month;
            };
            return (obj.date.split(" ")[0] >= savingsstartdate.value && obj.date.split(" ")[0] <= savingsenddate.value) || allsavingsdate.value
        })
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
        labels: dateList.filter(date => {
            if (monthFilter.value) {
                return parseInt(date.split("-")[1]) === monthFilter.month;
            };
            return (date >= savingsstartdate.value && date <= savingsenddate.value) || allsavingsdate.value
        }),
        datasets: [
            nilleboatsavings.value && {
                label: "Nillebo AT verklig",
                data: savingsDataSource["nilleboat"].map((d) => (d.realCost / 100).toFixed(2)),
                borderColor: "red",
                fill: false,
                tension: 0.4,
            },
            nilleboatsavings.value && {
                label: "Nillebo AT snitt",
                data: savingsDataSource["nilleboat"].map((d) => (d.averageCost / 100).toFixed(2)),
                borderColor: "rgb(125, 0, 81)",
                fill: false,
                tension: 0.4,
            },

            nillebovpsavings.value && {
                label: "Nillebo VP verklig",
                data: savingsDataSource["nillebovp"].map((d) => (d.realCost / 100).toFixed(2)),
                borderColor: "green",
                fill: false,
                tension: 0.4,
            },
            nillebovpsavings.value && {
                label: "Nillebo VP snitt",
                data: savingsDataSource["nillebovp"].map((d) => (d.averageCost / 100).toFixed(2)),
                borderColor: "lime",
                fill: false,
                tension: 0.4,
            },

            nillebovvsavings.value && {
                label: "Nillebo VV verklig",
                data: savingsDataSource["nillebovv"].map((d) => (d.realCost / 100).toFixed(2)),
                borderColor: "blue",
                fill: false,
                tension: 0.4,
            },
            nillebovvsavings.value && {
                label: "Nillebo VV snitt",
                data: savingsDataSource["nillebovv"].map((d) => (d.averageCost / 100).toFixed(2)),
                borderColor: "rgb(0, 187, 255)",
                fill: false,
                tension: 0.4,
            },

            loveboatsavings.value && {
                label: "Lovebo AT verklig",
                data: savingsDataSource["loveboat"].map((d) => (d.realCost / 100).toFixed(2)),
                borderColor: "orange",
                fill: false,
                tension: 0.4,
            },
            loveboatsavings.value && {
                label: "Lovebo AT snitt",
                data: savingsDataSource["loveboat"].map((d) => (d.averageCost / 100).toFixed(2)),
                borderColor: "rgb(161, 86, 0)",
                fill: false,
                tension: 0.4,
            },

            lovebovvsavings.value && {
                label: "Lovebo VV verklig",
                data: savingsDataSource["lovebovv"].map((d) => (d.realCost / 100).toFixed(2)),
                borderColor: "magenta",
                fill: false,
                tension: 0.4,
            },
            lovebovvsavings.value && {
                label: "Lovebo VV snitt",
                data: savingsDataSource["lovebovv"].map((d) => (d.averageCost / 100).toFixed(2)),
                borderColor: "pink",
                fill: false,
                tension: 0.4,
            },

            ottebosavings.value && {
                label: "Ottebo verklig",
                data: savingsDataSource["ottebo"].map((d) => (d.realCost / 100).toFixed(2)),
                borderColor: "yellow",
                fill: false,
                tension: 0.4,
            },
            ottebosavings.value && {
                label: "Ottebo snitt",
                data: savingsDataSource["ottebo"].map((d) => (d.averageCost / 100).toFixed(2)),
                borderColor: "rgb(109, 110, 0)",
                fill: false,
                tension: 0.4,
            },

            garagesavings.value && {
                label: "Garage verklig",
                data: savingsDataSource["garage"].map((d) => (d.realCost / 100).toFixed(2)),
                borderColor: "rgb(1, 255, 208)",
                fill: false,
                tension: 0.4,
            },
            garagesavings.value && {
                label: "Garage snitt",
                data: savingsDataSource["garage"].map((d) => (d.averageCost / 100).toFixed(2)),
                borderColor: "rgb(0, 200, 255)",
                fill: false,
                tension: 0.4,
            },

            poolsavings.value && {
                label: "Pool verklig",
                data: savingsDataSource["pool"].map((d) => (d.realCost / 100).toFixed(2)),
                borderColor: "rgb(66, 66, 66)",
                fill: false,
                tension: 0.4,
            },
            poolsavings.value && {
                label: "Pool snitt",
                data: savingsDataSource["pool"].map((d) => (d.averageCost / 100).toFixed(2)),
                borderColor: "lightgrey",
                fill: false,
                tension: 0.4,
            },
        ].filter(Boolean),
    };

    return {
        savingsData,
        savingsOptions: options(window.innerWidth <= 1024, 'Kostnad', chartStates),
        totalSpendning,
        totalSaved: totalSpendning[1] - totalSpendning[0]
    }
};
module.exports = generateSavingsData;