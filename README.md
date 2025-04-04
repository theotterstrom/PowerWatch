﻿# PowerWatch
PowerWatch is by far the most advanced web-interface system that i've built.

The purpose of the website originates from a project me and my grandfather, Hans, initiated 2020.
The goal of the project was to implement a smart-control over our most energy-consuming devices in our countryside houses.
The implementation was as following:
1. We bought several Shelly 1 plus relays and installed them throughout our 3 houses in devices where the energy consumption was considered highest and on devices we knew needed to be powered on during the cold part of the year in order for the indoor temperature to never be below 10 degrees Celsius.
2. We implemented a cron-script on a VPS-server where the procedure of the script was:
     a) Every evening at 11PM we webscraped the following days energy prices per hour and stored these in a database.
     b) About 10 minutes after, we looked at our settings describing how many hours of the following day each device needed to be switched on. With this information we created a schedule for each device to only be turned on during the X cheapest hours of           the day.
     c) During the next day, each hour, we would check the schedule and run through each registered device and either switch them on or off depending on the schedule created from step b.

During the energy-crisis of 2021, this came in handy and allowed us to save alot of money by only using our devices when the electricity was at it's cheapest.
In the beginning there was no UI, only the scripts running in the cloud. But i saw alot of potential in this, leading to the development of the website powerwatch.se.
What has been implemented so far is a user-interface allowing outside users to register and monitor their energy-consumption through 3 dashboards:
  1. Energy & Temperature - this dashboard allow users to display the energy-consumption and temperatures. The user can apply filters concerning time-interval and the devices they would like to view.
  2. Economy - this dashboard shows the user the total cost that the devices has consumed during a certain time. There is also a time and device filter applied here.
  3. Schedules & prices - this dashboard allows the user to see each devices schedule for a specific day aswell as the prices for that day.

Other than that, there is a widget for setting each devices schedule and a control panel where the user can add new devices and change them accordingly. Inside the control panel, the user can also put their power-zone (in sweden there are 4, each offering their customers a different watt-price) and their Shelly-credentials.

The stacks used for this project is:
  1. Node-JS
  2. Express.js
  3. React.js
  4. Node-cron
  5. MongoDB

Please feel free to visit https://powerwatch.se/ and visit the demo-tab for more information on how the system works and how it is displayed!
