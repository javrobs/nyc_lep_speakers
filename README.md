<h1 class="p1">Languages of the Limited English Proficient (LEP) Speakers by Community District in NYC</h1>
<h2>Introduction</h2>
<p>These interactive visualizations help us understand the total quantity of speakers with a limited English proficiency and the concentration of each of the languages they speak in each of NYC's community districts.</p>
<h2>Sketch and Inspiration</h2>
<p>The desired result is approximately as follows:</p>
<p data-sourcepos="9:1-10:26" dir="auto"><a target="_blank" rel="noopener noreferrer" href="https://github.com/javrobs/nyc_lep_speakers/blob/main/images/draft.png"><img src="https://github.com/javrobs/nyc_lep_speakers/raw/main/images/draft.png" alt="draft" /></a></p>
<h2>Sources</h2>
<p>The data was obtained from 2 different sources, gathered from NYC's open data portal.&nbsp;</p>
<ul>
<li>Source 1: Contains information about the total amount of speakers of a number of languages in each of NYC's community districts. JSON URL: <a href="https://data.cityofnewyork.us/resource/ajin-gkbp.json">https://data.cityofnewyork.us/resource/ajin-gkbp.json</a></li>
<li>Source 2: Contains the coordinates for the polygons determining each of NYC's community districts. JSON URL: <a href="https://data.cityofnewyork.us/resource/jp9i-3b7y.json">https://data.cityofnewyork.us/resource/jp9i-3b7y.json</a></li>
</ul>
<h2>Challenges</h2>
<p>First of all, we stored the two peaces of data in MongoDB; each of them in a different collection (using the sources we mencioned above).
Before proceeding to create the data visualizations, we had to join the two sources to get just one output from an API call.
 We matched the two different collections using the following property:</p>
<ul>
<li>&ldquo;borough_cd_code&rdquo; for the collection that contains information about the speakers --> populations</li>
<li>&ldquo;boro_cd&rdquo; for the collection that contains the coordinates of each community district --> communities</li>
</ul>
<p>For this, we simply put together the properties we needed from the collection named populations (with the number of non english speakers) with  the NY city's coordinates. This task was made using FLASK library in Python. 

By doing that, the processing of the data is made from the server, improving the performance of our dashboard. </p>

<p>As our data is filtered based on different needs, we built 6 different routes of APIs:</p>
<ul>
<li>/communities/&lt;Language&gt;: This API filters the speakers data for the specified language and then completes the merge with our coordinates data.</li>
<li>/communities_all: This path groups by community district and sums all of the Limited English Proficiency Speakers for each of the community districts and then completes the merge with our coordinates data.</li>
<li>/demographic_all: This path selects the 5 Biggest Communities of all New York City (based on the number of non english speakers).</li><li>/demographic/&lt;Language&gt; This path selects the data for the 5 Biggest Communities of all New York City, considering only the language indicated as a parameter of the call (based on the number of non english speakers).</li>
<li>/populations_all: This path selects the district, borough and numbers for the complete New York City.</li>
<li>/populations/&lt;Language&gt; This path selects the district, borough and numbers, considering only the language indicated as a parameter of the call.</li>

</ul>
<p>Each of the calls of the different API are made depending on the filter selected by the user.</p>
<h2>Building the dashboard</h2>
<p>Once the data processing was completed, we then proceeded to build the dashboard. Our dashboard is comprised by 4 different parts:</p>
<ol>
<li>Dropdown menu: This menu filters for all the languages or a specific language contained in the dataset.</li>
<li>Summary: A frame with a summarization of the selected data.</li>
<li>Sunburst Chart: An interactive pie-like chart containing all of the data summarized and hierarchized beginning with NYC's boroughs.</li>
<li>Choropleth Map: A map divided by community districts. The color of each community district varies depending on the total amount of speakers contained in that area for the selected data (all languages or a specific language).</li>
</ol>
<h2>Creation Process</h2>
<p>We divided the creation process in different stages:</p>
<ul>
<li>Stage 1: We gathered the data. An initial obstacle was that the data about the speakers was missing the geographic coordinates for each of the community districts, which were necessary for the creation of the map.</li>
<li>Stage 2: We processed the data and built 6 different API's to offer the output sources for the charts and map using Python and Flask.</li>
<li>Stage 3: We built the different JavaScript files containing the logic to implement all the functionality; the sunburst chart, the bar one and the choropleth map.</li>
<li>Stage 4: We built the HTML and CSS files, which would enable us to put all of the elements of the dashboard together and display them.</li>
</ul>
<h2>Final Result</h2>
<p>The screenshot below shows a preview of the final result.</p>
<p><img src="https://github.com/javrobs/nyc_lep_speakers/blob/main/images/dashboard.png?raw=true" alt="dashboard_map.png" style="display: block; margin-left: auto; margin-right: auto;" /></p>
<p><img src="https://github.com/javrobs/nyc_lep_speakers/blob/main/images/dashboard_map.png?raw=true" alt="dashboard_map.png" style="display: block; margin-left: auto; margin-right: auto;" /></p>
<h2>Contributors</h2>
<p>This dashboard was created by the following authors:</p>
<ul>
<li>Javier Robles Samar (<a href="https://www.linkedin.com/in/javier-robles-samar/">LinkedIn</a>)</li>
<li>Mar&iacute;a Jos&eacute; Cavazos (<a href="https://www.linkedin.com/in/marijose-cavazos-b2a353110/">LinkedIn</a>)</li>
<li>Alejandra Espinosa (<a href="https://www.linkedin.com/in/z-ale-espinosa/">LinkedIn</a>)</li>
<li>Aldo Antonio Silva Espinoza (<a href="https://www.linkedin.com/in/aldoslv/">LinkedIn</a>)</li>
</ul>
