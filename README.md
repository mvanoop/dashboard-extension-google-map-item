The **Google Map** extension is a [custom dashboard item](https://www.devexpress.com/Support/Center/Question/Details/T491984) that allows you to place markers on Google using any search string.

## Installation

1. Download the latest version of scripts 

2. Add the *dist* folder in your project.

3. Add google map api link
```xml
      <script async defer
    src="https://maps.googleapis.com/maps/api/js?key=YOURKEY">
    </script>
```

4. Attach the download script to the project inside the `<body>` section before the end tag onto the page containing Web Dashboard.
```xml
<body>
    <!-- ... -->
    <script src="/dist/google-map-extension.js"></script>
      <script src="/dist/markerclusterer.js"></script>
</body>
```
5. Handle the Web Dashboard's [BeforeRender](https://documentation.devexpress.com/#Dashboard/DevExpressDashboardWebScriptsASPxClientDashboard_BeforeRendertopic) event to perform client-side customization of the Web Dashboard control before the control and its elements have been rendered.
```xml
<!-- For ASP.NET Web Forms -->
<dx:ASPxDashboard ID="ASPxDashboard1" runat="server" DashboardStorageFolder="~/App_Data/Dashboards">
  <ClientSideEvents BeforeRender="onBeforeRender" />
</dx:ASPxDashboard>
```
```C#
@* For ASP.NET MVC *@
@Html.DevExpress().Dashboard(settings => {
    settings.Name = "Dashboard";
    settings.ClientSideEvents.BeforeRender = "onBeforeRender";
}).GetHtml()
```

5. Register the custom item extension to add the Online Map to the Web Dashboard.

```javascript
function onBeforeRender(sender) {
  var dashboardControl = sender.GetDashboardControl();
  dashboardControl.registerExtension(new CustomItems.GoogleMapItemExtension(dashboardControl));
}
</script>
```

Note google map api key is required for authentication

For more information on authentication keys, see the required map provider documentation ( [Google](https://developers.google.com/maps/documentation/javascript/get-api-key?hl=en)

## License
This extension is distributed under the **MIT** license (free and open-source), but can only be used with a commercial DevExpress Dashboard software product. You can [review the license terms](https://www.devexpress.com/Support/EULAs/NetComponents.xml) or [download a free trial version](https://go.devexpress.com/DevExpressDownload_UniversalTrial.aspx) of the Dashboard suite at [DevExpress.com](https://www.devexpress.com).

## Support & Feedback

* Refer to [this section](https://documentation.devexpress.com/#Dashboard/CustomDocument117232) for general information about client-side extensions.
* To learn how to create a custom item, see the following [KB article](https://www.devexpress.com/Support/Center/Question/Details/T491984).
* To address questions regarding the Web Dashboard and JavaScript API, use [DevExpress Support Center](https://www.devexpress.com/Support/Center).
