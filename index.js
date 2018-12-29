      import Map from 'ol/Map.js';
      import View from 'ol/View.js';
      import OSMXML from 'ol/format/OSMXML.js';
      import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer.js';
      import {bbox as bboxStrategy} from 'ol/loadingstrategy.js';
      import {transformExtent} from 'ol/proj.js';
      import OSM from 'ol/source/OSM';
      import VectorSource from 'ol/source/Vector.js';
      import {Circle as CircleStyle, Fill, Stroke, Style} from 'ol/style.js';
      import {fromLonLat} from 'ol/proj';
      import MousePosition from 'ol/control/MousePosition.js';
      import {createStringXY} from 'ol/coordinate.js';

      const karbenLonLat = [8.7753, 50.2278];
      const karbenWebMercator = fromLonLat(karbenLonLat);

      var map = null;

      var mousePositionControl = new MousePosition({
        coordinateFormat: createStringXY(5),
        projection: 'EPSG:4326',
        // comment the following two lines to have the mouse position
        // be placed within the map.
        className: 'custom-mouse-position',
        target: document.getElementById('mouse-position'),
        undefinedHTML: '&nbsp;'
      });

      var styles = {
          'amenity': {
          'waste_basket': new Style({
            image: new CircleStyle({
              radius: 4,
              fill: new Fill({
                color: 'rgba(10, 102, 35, 1.0)'
              }),
              stroke: null
            })
          })
        },
        'vending': {
          'excrement_bags': new Style({
            image: new CircleStyle({
              radius: 4,
              fill: new Fill({
                color: 'rgba(255, 0, 0, 1.0)'
              }),
              stroke: null
            })
          })
        },
      };

      var vectorSource = new VectorSource({
        format: new OSMXML(),
        loader: function(extent, resolution, projection) {
          var epsg4326Extent = transformExtent(extent, projection, 'EPSG:4326');
          var client = new XMLHttpRequest();
          client.open('POST', 'https://overpass-api.de/api/interpreter');
          client.addEventListener('load', function() {
            var features = new OSMXML().readFeatures(client.responseText, {
              featureProjection: map.getView().getProjection()
            });
            vectorSource.addFeatures(features);
          });
          var query = '(node(' +
              epsg4326Extent[1] + ',' + epsg4326Extent[0] + ',' +
              epsg4326Extent[3] + ',' + epsg4326Extent[2] +
              ');rel(bn)->.foo;way(bn);node(w)->.foo;rel(bw););out meta;';
          client.send(query);
        },
        strategy: bboxStrategy
      });


      var vector = new VectorLayer({
        source: vectorSource,
        style: function(feature) {
          for (var key in styles) {
            var value = feature.get(key);
            if (value !== undefined) {
              for (var regexp in styles[key]) {
                if (new RegExp(regexp).test(value)) {
                  return styles[key][regexp];
                }
              }
            }
          }
          return null;
        }
      });

      var raster = new TileLayer({
        source: new OSM({
        })
      });

      map = new Map({
        //controls: defaultControls().extend([mousePositionControl]),
        layers: [raster, vector],
        target: document.getElementById('map'),
        view: new View({
          center: karbenWebMercator,
          maxZoom: 19,
          zoom: 14,
          minZoom: 12
        })
      });

      var projectionSelect = document.getElementById('projection');
      projectionSelect.addEventListener('change', function(event) {
        mousePositionControl.setProjection(event.target.value);
      });

      var precisionInput = document.getElementById('precision');
      precisionInput.addEventListener('change', function(event) {
        var format = createStringXY(event.target.valueAsNumber);
        mousePositionControl.setCoordinateFormat(format);
      });

      document.getElementById('export-png').addEventListener('click', function() {
        map.once('rendercomplete', function(event) {
          var canvas = event.context.canvas;
          if (navigator.msSaveBlob) {
            navigator.msSaveBlob(canvas.msToBlob(), 'map.png');
          } else {
            canvas.toBlob(function(blob) {
              saveAs(blob, 'map.png');
            });
          }
        });
        map.renderSync();
      });