<h1 class="p1">Languages of the Limited English Proficient (LEP) Speakers by Community District in NYC</h1>
<h2>Introduction</h2>
<p>These interactive visualizations help us understand the total quantity of speakers with a limited English proficiency and the concentration of each of the languages they speak in each of NYC's community districts.</p>
<h2>Sketch and Inspiration</h2>
<p>The desired result is approximately as follows:</p>
<p data-sourcepos="9:1-10:26" dir="auto"><a target="_blank" rel="noopener noreferrer" href="https://github.com/javrobs/nyc_lep_speakers/blob/main/images/draft.png"><img src="https://github.com/javrobs/nyc_lep_speakers/raw/main/images/draft.png" alt="draft" /></a></p>
<h2>Sources</h2>
<p>The data was obtained from 2 different sources, both of them obtained from NYC's open data portal.&nbsp;</p>
<ul>
<li>Source 1: Contains information about the total amount of speakers of a number of languages in each of NYC's community districts. JSON URL: <a href="https://data.cityofnewyork.us/resource/ajin-gkbp.json">https://data.cityofnewyork.us/resource/ajin-gkbp.json</a></li>
<li>Source 2: Contains the coordinates for the polygons determining each of NYC's community districts. JSON URL: <a href="https://data.cityofnewyork.us/resource/jp9i-3b7y.json">https://data.cityofnewyork.us/resource/jp9i-3b7y.json</a></li>
</ul>
<h2>Challenges</h2>
<p>Because our data came from 2 different sources we had to cross-reference and unify the sources before proceeding to create the data visualizations. We matched the two different files using the following properties:</p>
<ul>
<li>&ldquo;borough_cd_code&rdquo; for the file that contains information about the speakers.</li>
<li>&ldquo;boro_cd&rdquo; for the file that contains the coordinates of each community district.</li>
</ul>
<p>For this, we simply added the properties we needed from the speakers file to the coordinates file using Python. This way, the processing of the data is made from the server, improving the performance of our dashboard.</p>
<p>As our data is filtered this process is done using 2 different routes for our API:</p>
<ul>
<li>/communities/&lt;Language&gt;: This path filters the speakers file for only the specified language and then completes the merge with our coordinates file.</li>
<li>/communities_all: This path groups by community district and sums all of the Limited English Proficiency Speakers for each of the community districts and then completes the merge with our coordinates file.</li>
</ul>
<p>Each of the paths is activated depending on the filter selected by the user.</p>
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
<li>Stage 2: We processed the data and built an API for the map and sunburst chart to call using Python and Flask.</li>
<li>Stage 3: We built the different JavaScript files containing the logic for the dropdown menu, the sunburst chart and the choropleth map.</li>
<li>Stage 4: We built the HTML and CSS files, which would enable us to put all of the elements of the dashboard together and display them.</li>
</ul>
<h2>Final Result</h2>
<p>The screenshot below shows a preview of the final result.</p>
<p><img src="https://github.com/javrobs/nyc_lep_speakers/blob/main/images/dashboard.png?raw=true" alt="dashboard.png" style="display: block; margin-left: auto; margin-right: auto;" /></p>
<h2>Contributors</h2>
<p>This dashboard was created by the following authors:</p>
<ul>
<li>Javier Robles Samar (<a href="https://www.linkedin.com/in/javier-robles-samar/">LinkedIn</a>)</li>
<li>Mar&iacute;a Jos&eacute; Cavazos (<a href="https://www.linkedin.com/in/marijose-cavazos-b2a353110/">LinkedIn</a>)</li>
<li>Alejandra Espinosa (<a href="https://www.linkedin.com/in/z-ale-espinosa/">LinkedIn</a>)</li>
<li>Aldo Antonio Silva Espinoza (<a href="https://www.linkedin.com/in/aldoslv/">LinkedIn</a>)</li>
</ul>
