WeatherTop
==========
### Release 3
Web app to add stations and enter weather reports manually.

---

Author: Pedro Royo  
SETU HDip Computer Science  
August 2024

---

## Usage example:
Create user account, login.  
Add a weather station, enter reports to the station.  
Edit reports, edit user details.  
Delete reports, delete stations.

## Features:
### Account
Check for password on login.  
When creating new account, if username exist send to login.  

### Navigation Menu
Firstname shows on Account button when logged in.  
Buttons _Add Station_ and _Add Report_ links to the form at the end of the page.  
Buttons _Add Station_ and _Add Report_ only appear when may be needed.  

### Dashboard
It shows when each station was last updated. Eg: _2 hours ago_.   
_Pressure_ and _Min / Max_ values hidden in dropdown for a visually light summary.  
Arrow points to wind direction. Alert appears when there is strong wind.  
When freezing, temperature changes colour (blue-green), snowflake alert appears.  
When 30ºC are reached, temperature colour changes to orange. 
Stations ordered by name.

### Station Reports 
Weather data populates 5 cards for a comprehensive station summary.  
Wind direction dropdown.  
Form with min/max help to enter correct values.  
When a station gets deleted, its reports also get deleted.  
Reports ordered by most recent on top.

### About
A template generates cards with all the weather codes.  

![](screenshots/screenshot-release3-dashboard.png)
![](screenshots/screenshot-release3-station.png)
![](screenshots/screenshot-release3-report.png)
![](screenshots/screenshot-release3-account.png)
![](screenshots/screenshot-release3-about.png)