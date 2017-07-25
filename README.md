# Pre-K for All

This replaces the previous version of application which utilized OpenLayers 2 (https://github.com/CityOfNewYork/Pre-K-Finder.git)

This app is a stand-alone HTML5 app that can be dropped into the doc root of any web server.

The pka.csv file included is a snapshot of the Pre-K facilities data for development use only.

In production the Pre-K facilities data may change without notice and is cached at a CDN daily.

* Use ```gradle -Penv=dev buildApp``` to build for gis dev environment
* Use ```gradle -Penv=stg buildApp``` to build for gis stg environment
* Use ```gradle -Penv=prd buildApp``` to build for gis prd environment
