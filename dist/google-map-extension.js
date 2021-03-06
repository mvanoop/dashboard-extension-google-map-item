var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var CustomItems;
(function (CustomItems) {
    function getDefaultCustomLocalization() {
        return {
         
            'DashboardWebCustomItemStringId.DefaultNameGoogleMap': "Google Map",
            // Binding Panel
            'DashboardWebCustomItemStringId.Values': "Values",
            'DashboardWebCustomItemStringId.SetValue': "Set Value",
            'DashboardWebCustomItemStringId.ConfigureValue': "Configure Value",
            'DashboardWebCustomItemStringId.Arguments': "Arguments",
            'DashboardWebCustomItemStringId.SetArgument': "Set Argument",
            'DashboardWebCustomItemStringId.ConfigureArgument': "Configure Argument",
            'DashboardWebCustomItemStringId.Place': "Place",
            'DashboardWebCustomItemStringId.Binding.SetPlace': "Set Place",
            'DashboardWebCustomItemStringId.Binding.ConfigurePlace': "Configure Place",
            // Options
        };
    }
    DevExpress.Localization.addCultureInfo({ messages: getDefaultCustomLocalization() });
})(CustomItems || (CustomItems = {}));
/// <reference path="localization.ts" />
/// <reference path="../typings/globals/dashboards/dx-dashboard-designer.d.ts" />
var CustomItems;
(function (CustomItems) {
    CustomItems.GOOGLE_MAP_EXTENSION_NAME = 'OnlineGoogleMap';
    CustomItems.onlineMapMeta = {
        bindings: [{
            propertyName: 'Values',
            dataItemType: 'Measure',
            array: true,
            enableColoring: true,
            constraints: {
                allowedTypes: ['Integer', 'Float', 'Double', 'Decimal']
            },
            displayName: 'DashboardWebCustomItemStringId.Values',
            emptyPlaceholder: 'DashboardWebCustomItemStringId.SetValue',
            selectedPlaceholder: 'DashboardWebCustomItemStringId.ConfigureValue'
        }, {
            propertyName: 'Arguments',
            dataItemType: 'Dimension',
            array: false,
            enableInteractivity: true,
            enableColoring: true,
            displayName: 'DashboardWebCustomItemStringId.Arguments',
            emptyPlaceholder: 'DashboardWebCustomItemStringId.SetArgument',
            selectedPlaceholder: 'DashboardWebCustomItemStringId.ConfigureArgument'
        }
            ],
        properties: [],
        interactivity: {
            filter: true,
            drillDown: false
        },
        icon: CustomItems.GOOGLE_MAP_EXTENSION_NAME,
        title: "DashboardWebCustomItemStringId.DefaultNameGoogleMap",
        index: 1
    };
})(CustomItems || (CustomItems = {}));
/// <reference path="meta.ts" />
var CustomItems;
(function (CustomItems) {
    CustomItems.GOOGLE_MAP_ICON = "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n<!-- Generator: Adobe Illustrator 21.0.2, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->\n<!DOCTYPE svg PUBLIC \"-//W3C//DTD SVG 1.1//EN\" \"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd\">\n<svg version=\"1.1\" id=\"" + CustomItems.onlineMapMeta.icon + "\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\"\n\t viewBox=\"0 0 24 24\" style=\"enable-background:new 0 0 24 24;\" xml:space=\"preserve\">\n<style type=\"text/css\">\n\t.dx_red{fill:#E25454;}\n\t.dx_darkgray{fill:#414141;}\n</style>\n<path class=\"dx_darkgray\" d=\"M12,1C8.1,1,5,4.1,5,8c0,3.9,3,10,7,15c4-5,7-11.1,7-15C19,4.1,15.9,1,12,1z M12,12c-2.2,0-4-1.8-4-4\n\tc0-2.2,1.8-4,4-4s4,1.8,4,4C16,10.2,14.2,12,12,12z\"/>\n<circle class=\"dx_red\" cx=\"12\" cy=\"8\" r=\"2\"/>\n</svg>";
})(CustomItems || (CustomItems = {}));
var CustomItems;
(function (CustomItems) {
    var googleMapItem = (function (_super) {
        __extends(googleMapItem, _super);
        function googleMapItem(model, $container, options) {
            var _this = _super.call(this, model, $container, options) || this;
            _this.mapViewer = null;
            _this.markers = [];
            _this.infowindow = new google.maps.InfoWindow();
            _this.i = 1;
            _this.exportingImage = new Image;
            return _this;
        }
        googleMapItem.prototype.setSize = function (width, height) {
            _super.prototype.setSize.call(this, width, height);
            var contentWidth = this.contentWidth(), contentHeight = this.contentHeight();
            this.mapViewer.option('width', contentWidth);
            this.mapViewer.option('height', contentHeight);
        };
        googleMapItem.prototype.clearSelection = function () {
            _super.prototype.clearSelection.call(this);
        };
        googleMapItem.prototype._getDataSource = function () {
            var data = [];
            var bindingValue = this.getBindingValue('Values');
            var bindingArgument = this.getBindingValue('Arguments');

            if (bindingValue.length == 0 || bindingArgument.length == 0)
                return [];
            data.push([bindingArgument[0].displayName(), bindingValue[0].displayName()]);
            if (this.getBindingValue('Values').length > 0) {
                this.iterateData(function (row) {
                    var place = row.getValue('Arguments')[0];
                    var value = row.getValue('Values')[0];
                    if (place&&value) {
                        data.push([place, value]);
                    }
                });
            }
            return data;
        };
        googleMapItem.prototype.renderContent = function ($element, changeExisting, afterRenderCallback) {
            this.i = 1;
            this.markers = [];
            $element[0].id = this._getID();
            var map = new google.maps.Map($element[0], {
                zoom: 3,
                fullscreenControl: false,
              //  gestureHandling: 'greedy',
                center: { lat: 24.239085, lng: 76.363373 }
            });
            var mydata = this._getDataSource();
            if (mydata.length <= 1)
                return;
            this._codePlace(mydata, map, this._clusterMapping)
        };
        googleMapItem.prototype._codePlace = function (data, map, callback) {
            try {
                if (data.length <= 1)
                    return;
                if (data[0].length != 2)
                {
                    console.log('not enough data')
                    return;
                }

                var _this = this;
                var geocoder = new google.maps.Geocoder();
                geocoder.geocode({ 'address': data[_this.i][0] }, function (results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                        console.log(data[_this.i][0]);
                      
                        //var infowindow = new google.maps.InfoWindow({
                        //    content: data[_this.i][0] + " : " + data[_this.i][1]
                        //});
                        // map.setCenter(results[0].geometry.location);
                        var titkeText=data[0][0] + " : " + data[_this.i][0] + " - " + data[0][1] + " : " + data[_this.i][1];
                        var marker = new google.maps.Marker({
                            map: map,
                            position: results[0].geometry.location,
                            title:  titkeText
                        });
                        marker.tag = data[_this.i][1];
                        marker.measureName = data[0][1];
                        marker.dimensionName = data[0][0];
                        // marker.displayText = data[0][1];

                        var markerText = data[0][0] + " : " + data[_this.i][0] + "<br/>" + data[0][1] + " : " + data[_this.i][1];
                        marker.addListener('click', function () {
                            _this.infowindow.setContent( markerText);
                            _this.infowindow.open(map, marker);
                        });
                        _this.markers.push(marker);
                    }
                    else {
                        console.log("Geocode was not successful for the following reason: " + status);
                    }
                    if (_this.i == data.length - 1)
                        callback(_this.markers, map);
                    else {
                        _this.i++;
                        _this._codePlace(data, map, callback);
                    }
                });
                
            } catch (err) {
                console.log(err);
                callback(_this.markers, map);
            }
         
        };
        googleMapItem.prototype._clusterMapping = function (markers, map) {
            var bounds = new google.maps.LatLngBounds();
            for (var i = 0; i < markers.length; i++) {
                bounds.extend(markers[i].getPosition());
            }
            map.fitBounds(bounds);
            var markerCluster = new MarkerClusterer(map, markers,
         { imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m' });
        };
        googleMapItem.prototype._onClick = function (row) {
           // this.setMasterFilter(row);
           // this._updateSelection();
        };
        googleMapItem.prototype._getID = function () {
            return "map-" + this.getName();
        }
        return googleMapItem;
    }(DevExpress.Dashboard.customViewerItem));
    CustomItems.googleMapItem = googleMapItem;
})(CustomItems || (CustomItems = {}));
/// <reference path="meta.ts" />
/// <reference path="icon.ts" />
/// <reference path="localization.ts" />
/// <reference path="online-map-viewer.ts" />
var CustomItems;
(function (CustomItems) {
    var GoogleMapItemExtension = (function () {
        function GoogleMapItemExtension(dashboardControl) {
            this.name = CustomItems.GOOGLE_MAP_EXTENSION_NAME;
            this.metaData = CustomItems.onlineMapMeta;
            this.createViewerItem = function (model, $element, content) {
                return new CustomItems.googleMapItem(model, $element, content);
            };
            dashboardControl.registerIcon(CustomItems.GOOGLE_MAP_ICON);
        }
        return GoogleMapItemExtension;
    }());
    CustomItems.GoogleMapItemExtension = GoogleMapItemExtension;
})(CustomItems || (CustomItems = {}));
