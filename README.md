# Why?
One of the most useful tools we have in limiting the spread of the virus is 
contact tracing. If we can quickly inform those who are at risk of 
unknowingly contracting the virus, those individuals can take precautions 
to prevent passing it on to others. Speed is an advantage.


# Technical Info
The app is build on Expo. In the background it tracks and sends the user's location to a server. If a user marks themselves as diagnosed with COVID-19. The server can use its location data network to immediately mark which users are at risk and display the results to those users in the app.

There is no personal information stored against the location data. After installing the app, the user is never asked to login via email, or Facebook or Google, etc. The app does not need to know who is using it.

The app sends a unique id, known only to it to the server, this is how it can check if the device has come in close proximity to any known COVID-19 diagnosed users. And because the id is unguessable, the location info reported by it is only accesible via the same device.

If you uninstall the app, the link is severed.

The background is powered [here](https://github.com/AlastairTaft/GeoTraceAPI).
