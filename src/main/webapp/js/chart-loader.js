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

function drawChart(){
  var sentiment_data = new google.visualization.DataTable();
  //define columns for the DataTable instance
  sentiment_data.addColumn('string', 'Date');
  sentiment_data.addColumn('number', 'Average Sentiment');

  //add data to sentiment_data
  sentiment_data.addRows([
      ["March 1", -0.5],
      ["March 6", -0.3],
      ["March 11", 0.9],
      ["March 16", 0.5],
  ]);
  var chart = new google.visualization.LineChart(document.getElementById('chart-container'));
  var chart_options = {
                        width: 800,
                        height: 400,
                        title: "Average Sentiment",
                        curveType: "function"
                      };

  chart.draw(sentiment_data, chart_options);
}
