<!--
Copyright 2019 Google Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
-->

<!DOCTYPE html>
<html>

  <head>
    <title>Charts</title>
    <link rel="stylesheet" href="/css/main.css">
    <script src="https://www.gstatic.com/charts/loader.js"></script>
    <script src="/js/chart-loader.js"></script>
  </head>

  <body onload="buildUI()">
    <div id="header">
      <div id="headbanner">
        <%@include file="/WEB-INF/jspf/navigation.jspf" %>
        <div id="title">
          <h1>DABBLE</h1>
        </div>
      </div>
    </div>
    <h1 id="page-title">Total Messages Over Time</h1>
    <div id="chart-container"></div>
  </body>

</html>
