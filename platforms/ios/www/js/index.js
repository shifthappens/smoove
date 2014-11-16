/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        //alert('opgestart');
        //app.receivedEvent('deviceready');
        startBeaconRanger();

    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        //alert('opgestart');
    }
}

var beacon = {
    uuid: 'b9407f30-f5f8-466e-aff9-25556b57fe6d',
    identifier: 'smoovebeacon',
    minor: undefined,
    major: 1
};

var beacon_timeouts = 0;
var max_timeouts = 5;

function startBeaconRanger()
{
    var logToDom = function (message) {
        var e = document.createElement('label');
        e.innerText = message;

        var br = document.createElement('br');
        var br2 = document.createElement('br');
        document.body.appendChild(e);
        document.body.appendChild(br);
        document.body.appendChild(br2);

        window.scrollTo(0, window.document.height);
    };

    var delegate = new cordova.plugins.locationManager.Delegate();

    delegate.didDetermineStateForRegion = function (pluginResult) {

        logToDom('[DOM] didDetermineStateForRegion: ' + JSON.stringify(pluginResult));

        cordova.plugins.locationManager.appendToDeviceLog('[DOM] didDetermineStateForRegion: '
            + JSON.stringify(pluginResult));
    };

    delegate.didStartMonitoringForRegion = function (pluginResult) {
        console.log('didStartMonitoringForRegion:', pluginResult);

        //logToDom('didStartMonitoringForRegion:' + JSON.stringify(pluginResult));
    };

    delegate.didRangeBeaconsInRegion = function (pluginResult) {
        SmooveBeaconProcessor(pluginResult);


        //logToDom('[DOM] didRangeBeaconsInRegion proximity: ' + pluginResult.proximity);
    };

    var beaconRegion = new cordova.plugins.locationManager.BeaconRegion(beacon.identifier, beacon.uuid, beacon.major, beacon.minor);

    cordova.plugins.locationManager.setDelegate(delegate);

    // required in iOS 8+
    cordova.plugins.locationManager.requestWhenInUseAuthorization(); 
    // or cordova.plugins.locationManager.requestAlwaysAuthorization()

    cordova.plugins.locationManager.startRangingBeaconsInRegion(beaconRegion)
        .fail(console.error)
        .done();
        
}

function reconnectBeacon(pluginResult)
{
    document.getElementById('connectivity-status').className = 'connected';
    document.getElementById('connectivity-status').innerHTML = 'verbonden';
    document.getElementById('waiting-for-connection').style.display = 'none';
    beacon_timeouts = 0;

    getActionsForBeacon(pluginResult);
}

function disconnectBeacon()
{
    document.getElementById('connectivity-status').className = 'disconnected';
    document.getElementById('connectivity-status').innerHTML = 'niet verbonden';
    document.getElementById('waiting-for-connection').style.display = 'inline';

    $('#app #actionbox button').hide();    
}

function getActionsForBeacon(pluginResult)
{
    //normally you would do a http get request from a server to get all the actions associated with the beacon
    //in this proof of concept app we just populate the DOM with some buttons and hardwire them
    console.log('getActionsForBeacon. Pluginresult: ', pluginResult);
    var label = "Onbekende knop ("+beacon.minor+")";
    var eventHandler = 'noAction';

    $('#app #actionbox button').hide();

    jQuery.each(pluginResult.beacons, function(index, beacon)
    {
        $('#actionbox #noaction').hide();
        
        switch(beacon.minor)
        {
            case 10:
            label = 'Open Deur';
            eventHandler = 'openDoor';
            $('#actionbox #action-for-beacon-10').show();
            break;

            case 20:
            label = "Zet Lamp Aan";
            eventHandler = 'switchLight'
            $('#actionbox #action-for-beacon-20').show();
            break;

            default:
            eventHandler = 'noAction';
            $('#actionbox #noaction').text('Geen acties bekend voor beacon ('+beacon.minor+')');
            //$('#actionbox #noaction').show();
            break;
        }

    });

}

function openDoor(event)
{
    console.log('deur open!');
    response = httpGet('http://192.168.1.10/enu/trigger/deur');
    console.log(response);
}

function switchLight(event)
{
    console.log('licht aan!');
    response = httpGet('http://192.168.1.10/enu/lockstate.xml.p?lock1state=1');
    console.log(response);
}

function noAction(event)
{
    //niets
}


function startBeaconMonitor()
{

    var logToDom = function (message) {
        var e = document.createElement('label');
        e.innerText = message;

        var br = document.createElement('br');
        var br2 = document.createElement('br');
        document.body.appendChild(e);
        document.body.appendChild(br);
        document.body.appendChild(br2);

        window.scrollTo(0, window.document.height);
    };

    var delegate = new cordova.plugins.locationManager.Delegate();

    delegate.didDetermineStateForRegion = function (pluginResult) {

        logToDom('[DOM] didDetermineStateForRegion: ' + JSON.stringify(pluginResult));

        cordova.plugins.locationManager.appendToDeviceLog('[DOM] didDetermineStateForRegion: '
            + JSON.stringify(pluginResult));
    };

    delegate.didStartMonitoringForRegion = function (pluginResult) {
        console.log('didStartMonitoringForRegion:', pluginResult);

        logToDom('didStartMonitoringForRegion:' + JSON.stringify(pluginResult));
    };

    delegate.didRangeBeaconsInRegion = function (pluginResult) {
        SmooveBeaconProcessor(pluginResult);
    };

    var beaconRegion = new cordova.plugins.locationManager.BeaconRegion(beacon.identifier, beacon.uuid, beacon.major, beacon.minor);

    cordova.plugins.locationManager.setDelegate(delegate);

    // required in iOS 8+
    cordova.plugins.locationManager.requestWhenInUseAuthorization(); 
    // or cordova.plugins.locationManager.requestAlwaysAuthorization()

    cordova.plugins.locationManager.startMonitoringForRegion(beaconRegion)
        .fail(console.error)
        .done();
}

function SmooveBeaconProcessor(pluginResult)
{
    if(typeof pluginResult == 'object')
    {
        if(pluginResult.beacons.length == 0)
        {
            console.log('GEEN beacons gevonden');
            beacon_timeouts++;

            if(beacon_timeouts >= max_timeouts)
                disconnectBeacon();
        }
        else
        {
            console.log(pluginResult.beacons.length+' beacons gevonden');
            reconnectBeacon(pluginResult);
        }
    }

    console.log(pluginResult);
}

function httpGet(theUrl)
{
    var xmlHttp = null;

    xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false );
    xmlHttp.send( null );
    return xmlHttp.responseText;
}

app.initialize();