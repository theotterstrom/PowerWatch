

module.exports = (isMobile, yAxisLabel, chartStates) => {

    let previousIndex = null;

    return isMobile ? {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: 'top',
                labels: {
                    color: "white",
                    font: {
                        size: 12,
                    },
                },
                position: 'top',
            },
            tooltip: {
                enabled: false,
                mode: 'index',
                intersect: false,
                callbacks: {
                    title: (tooltipItems) => `Datum: ${tooltipItems[0].label}`,
                    label: (tooltipItem) => {
                        return `${tooltipItem.dataset.label}: ${tooltipItem.raw}`;
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
                    maxRotation: 90,
                    minRotation: 90,
                    font: {
                        size: 12,
                    },
                }
            },
            y: {
                grid: {
                    display: true,
                },
                ticks: {
                    color: "white",
                    maxRotation: 90,
                    minRotation: 90,
                    font: {
                        size: 12,
                    },
                    callback: function (value) {
                        return `${value}`;
                    },
                }
            },
        },
        hover: {
            mode: 'index',
            intersect: false,
        },
        onHover: function (event, chartElement) {
            if (chartElement.length) {
                const index = chartElement[0].index;
                if (previousIndex !== index) {
                    previousIndex = index;
                    const chosenDate = chartElement[0].element.$context.chart.data.labels[index];
                    const dateValues = chartElement.map(obj => {
                        const value = obj.element["$context"].raw; // Value of the data point
                        const datasetIndex = obj.datasetIndex; // Dataset index
                        const datasetLabel = obj.element.$context.chart.data.datasets[datasetIndex].label; // Dataset label (line name)
                        const datasetColor = obj.element.$context.chart.data.datasets[datasetIndex].borderColor;
                        return {
                            value,
                            datasetLabel,
                            datasetColor
                        };
                    });

                    const xCoordinate = chartElement[0].element.x;
                    const yCoordinate = event.chart.chartArea.top;
                    if (chosenDate !== chartStates.currentdate.value) {
                        chartStates.currentdate.set(chosenDate);
                        chartStates.datavalues.set(dateValues);
                        chartStates.charty.set(yCoordinate);
                    };
                    if (820 <= window.innerWidth) {
                        const toolTipContainer = document.getElementsByClassName("toolTipContainer")[0];
                        const halfWidth = parseInt(toolTipContainer.style.width.replace("px", "")) / 2;
                        if(xCoordinate < 550 && xCoordinate > 160){
                            toolTipContainer.style.transform = `translateX(${xCoordinate - halfWidth - 12}px)`;
                        }
                    };
                };
            };
        }
    } : {
        responsive: true,
        plugins: {
            legend: {
                labels: {
                    color: "white",
                    font: {
                        size: 12
                    }
                },
                position: 'top',
            },
            tooltip: {
                enabled: false,
                mode: 'index',
                intersect: false,
                
                margin: 50,
                callbacks: {
                    title: (tooltipItems) => `Datum: ${tooltipItems[0].label}`,
                    label: (tooltipItem) => `${tooltipItem.dataset.label}: ${tooltipItem.raw}`,
                },
            },
        },
        scales: {
            x: {
                ticks: {
                    color: "white",
                    font: {
                        size: 12
                    }

                },
                title: {
                    display: true,
                    text: 'Datum',
                    color: "white"
                },
            },
            y: {
                title: {
                    display: true,
                    text: yAxisLabel,
                    color: "white"
                },
                ticks: {
                    color: "white",
                    font: {
                        size: 12
                    },
                    callback: function (value) {
                        return `${value}`;
                    },
                },
            },
        },
        hover: {
            mode: 'index',
            intersect: false,
        },
        onHover: function (event, chartElement) {
            if (chartElement.length) {
                const index = chartElement[0].index;
                if (previousIndex !== index) {
                    previousIndex = index;
                    const chosenDate = chartElement[0].element.$context.chart.data.labels[index];
                    const dateValues = chartElement.map(obj => {
                        const value = obj.element["$context"].raw; // Value of the data point
                        const datasetIndex = obj.datasetIndex; // Dataset index
                        const datasetLabel = obj.element.$context.chart.data.datasets[datasetIndex].label; // Dataset label (line name)
                        const datasetColor = obj.element.$context.chart.data.datasets[datasetIndex].borderColor;
                        return {
                            value,
                            datasetLabel,
                            datasetColor
                        };
                    });
                    
                    const xCoordinate = chartElement[0].element.x;

                    if (chosenDate !== chartStates.currentdate.value) {
                        chartStates.currentdate.set(chosenDate);
                        chartStates.datavalues.set(dateValues);
                    };
                    
                    const toolTipContainer = document.getElementsByClassName("toolTipContainer")[0];
                    const halfWidth = parseInt(toolTipContainer.style.width.replace("px", "")) / 2;
                    toolTipContainer.style.transform = `translateX(${xCoordinate - halfWidth - 12}px)`;
                };
            };
        }
    };
};