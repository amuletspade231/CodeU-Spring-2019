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
google.charts.setOnLoadCallback(fetchMessageData);

/**
 * Builds a chart element and adds it to the page.
 */
function drawChart(dataTable) {
  let chart = new google.visualization.LineChart(document.getElementById('chart-container'));
  const chartOptions = {
    width: 800,
    height: 400,
    curveType: "function"
  };

  chart.draw(dataTable, chartOptions);
}

/*
 * Fetches the JSON from the /charts path and populates
 * the chart-container div in chart.html with its data.
 *
 * Creates a line chart displaying the message count over time.
 */
function fetchMessageData() {
  fetch("/feed-json")
    .then((response) => {
      return response.json();
    })
    .then((msgJson) => {
      let msgData = new google.visualization.DataTable();
      msgData.addColumn('date', 'Date');
      msgData.addColumn('number', 'Message Count');

      for (i = 0; i < msgJson.length; i++) {
          msgRow = [];
          let timestampAsDate = new Date(msgJson[i].timestamp);
          let totalMessages = msgJson.length - i + 1;
          msgRow.push(timestampAsDate, totalMessages)
          msgData.addRow(msgRow);

      }
      drawChart(msgData);
    });
}

function buildUI() {
  fetchMessageData();
}
