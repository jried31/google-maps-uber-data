Please see the file "PROJECT_README.pdf" for more information about this project and design consideration.

Project Code
The webpage can be accessed at http://www.redootv.com , and my project code is located at
https://github.com/jried31/google-maps-uber-data. The project code can be run by downloading from Github, and within the project folder run “node server.js”.

Dataset
From https://github.com/fivethirtyeight/uber-tlc-foil-response/tree/master/uber-trip-data . I was specifically told to focus on the files uber-raw-data-<month>14.csv, which track anonymized pickup locations for drivers in NYC.

For this project, I was instructed to transform the data such that half of the data become pickup
locations, and the other half drop off. Then develop a website that displays information about
the dataset.

How To Use
Filter area by polygon shape
1, Select polyline from the pallet located in top center of the google map.
2. Draw the desired polygon. Note that search will only work with polygons with 4 or more sides. Unable to investigate why triangles don’t work.
3. Press the “Perform Search” button to retrieve data.

NOTE: Multiple shapes can be drawn to screen. However, data will filtered and displayed only for the most recent shape drawn.


Remove a shape
1. Select the shape
2. Press “Remove Shape”
3. Press “Perform Search” button to update the data (optional)
