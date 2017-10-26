## DADA: Dynamic Annotation for Data Analysis

Provides a basic image and video annotation and visualization tool
to support machine learning... This project was hacked together (a 
first attempt to learn javascript) but builds on an awesome collection 
of open-source projects including: 

+ React and Create React App (build environment for mortals)
+ React-Toolbox (I like their asethics)
+ React-Toolbox-Themr (helps glue the top two together) 
+ React-Store for state management (I liked the explicit global and local stores) 
+ Leaflet and Leaflet Draw for the images and annotations (everything you could want)
+ React wrappers for Leaflet and Leaflet Draw (helps keep it clean)
+ Girder (whew, the entire server side)
+ LargeImage plugin for Girder (serves arbitarily big images/video)


## Video?

Not really. The project supports sequences of images, not video formats. 
Leaflet is not really setup for this and so performance is not great (1-2 fps). 
Some hacking was done to reduce blinking between frames but there is lots of 
room for improvement.   

## Girder

The client expects data, metadata and annotations to be stored in a Girder 
hiearchy in a very specific (and fairly ad hoc) way. There are a couple
of utilities to assist uploads and convert files but they could be much improved. 
