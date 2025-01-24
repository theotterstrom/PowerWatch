

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
                        size: window.innerWidth <= 767 ? 12 : 20,
                    },
                },
                position: 'top',
            },
            tooltip: {
                enabled: true,
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
                    maxRotation: 90,
                    minRotation: 90,
                    font: {
                        size: window.innerWidth <= 767 ? 12 : 20,
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
        }
    } : {
        responsive: true,
        plugins: {
            legend: {
                labels: {
                    color: "white",
                    font: {
                        size: window.innerWidth <= 1024 ? 20 : 12
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
                        size: window.innerWidth <= 1024 ? 20 : 12
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
                        size: window.innerWidth <= 1024 ? 20 : 12
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
                    
                    if(chosenDate !== chartStates.currentdate.value){
                        chartStates.currentdate.set(chosenDate);
                        chartStates.datavalues.set(dateValues);
                    };

                    const toolTipContainer = document.getElementsByClassName("toolTipContainer")[0]
                    toolTipContainer.style.transform = `translateX(${xCoordinate - 100}px)`;
                };
            };
        }
    };
};