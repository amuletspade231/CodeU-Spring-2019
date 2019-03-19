/*
 * Copyright 2019 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

google.charts.load('current', {packages: ['corechart']});
google.charts.setOnLoadCallback(drawChart);

/**
 * Builds a chart element and adds it to the page.
 */
function drawChart() {
  let sentimentData = new google.visualization.DataTable();
  //define columns for the DataTable instance
  sentimentData.addColumn('string', 'Date');
  sentimentData.addColumn('number', 'Average Sentiment');

  //add data to sentimentData
  sentimentData.addRows([
    ["March 1", -0.5],
    ["March 6", -0.3],
    ["March 11", 0.9],
    ["March 16", 0.5],
  ]);
  let chart = new google.visualization.LineChart(document.getElementById('chart-container'));
  const chartOptions = {
    width: 800,
    height: 400,
    title: "Average Sentiment",
    curveType: "function"
  };

  chart.draw(sentimentData, chartOptions);
}

/*
 * Fetches the JSON from the /charts path and populates
 * the chart-container div in chart.html with its data.
 */
function fetchMessageData() {
  fetch("/charts")
      .then((response) => {
        return response.json();
      })
      .then((msgJson) => {
        console.log(msgJson);
      });
}

fetchMessageData();
