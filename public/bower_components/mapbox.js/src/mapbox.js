'use strict';

// Hardcode image path, because Leaflet's autodetection
// fails, because mapbox.js is not named leaflet.js
window.L.Icon.Default.imagePath = '//api.tiles.mapbox.com/mapbox.js/' + 'v' +
    require('../package.json').version + '/images';

var geocoderControl = require('./geocoder_control'),
    gridControl = require('./grid_control'),
    featureLayer = require('./feature_layer'),
    legendControl = require('./legend_control'),
    shareControl = require('./share_control'),
    tileLayer = require('./tile_layer'),
    infoControl = require('./info_control'),
    map = require('./map'),
    gridLayer = require('./grid_layer');

L.mapbox = module.exports = {
    VERSION: require('../package.json').version,
    geocoder: require('./geocoder'),
    marker: require('./marker'),
    simplestyle: require('./simplestyle'),
    tileLayer: tileLayer.tileLayer,
    TileLayer: tileLayer.TileLayer,
    infoControl: infoControl.infoControl,
    InfoControl: infoControl.InfoControl,
    shareControl: shareControl.shareControl,
    ShareControl: shareControl.ShareControl,
    legendControl: legendControl.legendControl,
    LegendControl: legendControl.LegendControl,
    geocoderControl: geocoderControl.geocoderControl,
    GeocoderControl: geocoderControl.GeocoderControl,
    gridControl: gridControl.gridControl,
    GridControl: gridControl.GridControl,
    gridLayer: gridLayer.gridLayer,
    GridLayer: gridLayer.GridLayer,
    featureLayer: featureLayer.featureLayer,
    FeatureLayer: featureLayer.FeatureLayer,
    map: map.map,
    Map: map.Map,
    config: require('./config'),
    sanitize: require('sanitize-caja'),
    template: require('mustache').to_html
};
