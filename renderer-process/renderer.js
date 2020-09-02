// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are not available in this process.
var otaConfig = {};
var wifiConfig = {};
var elDetached = null;
var ssidSelected = null;
var ssidLists = [];
var serialPortLists = [];

$(document).ready(function () {
  $("#about-modal").show();
  $("#window-app").hide();
  $("#container-data").hide();
  $("#container-ota").hide();
  // Button event to show about window
  $("#get-about").click(function (evt) {
    $("#about-modal").show();
    $("#window-app").hide();
  });
  // Button event to show main window app
  $("#get-started").click(function (evt) {
    $("#about-modal").hide();
    $("#window-app").show();
    if ($("#menutab-device").hasClass("active")) {
      $("#tab-cloud").hide();
      $("#tab-device").show();
      // SSID lists
      $("#ssid-list").html("");
      $("#ssid-list").html("<li class=\"list-group-header\"><input id=\"ssid-search\" class=\"form-control\" type=\"text\" placeholder=\"Filter SSID\"></li>");
      window.wifi.wifiNetworks().then(data => {
        ssidLists = data;
        data.forEach((item, idx) => {
          console.log("Data: ", item);
          if (item.security.length > 0) {
            $("#ssid-list").append("<li class=\"list-group-item\"><img class=\"media-object pull-left\" src=\"./renderer-process/assets/img/lock-icon.png\" width=\"32\" height=\"32\"><div class=\"media-body\"><strong>" + item.ssid + "</strong><p>Signal Level: " + item.signalLevel + "</p></div></li>");
          } else {
            $("#ssid-list").append("<li class=\"list-group-item\"><img class=\"media-object pull-left\" src=\"./renderer-process/assets/img/unlock-icon.png\" width=\"32\" height=\"32\"><div class=\"media-body\"><strong>" + item.ssid + "</strong><p>Signal Level: " + item.signalLevel + "</p></div></li>");
          }
        })
        elDetached = $("#ssid-list .list-group-item");
        // SSID selection handler
        $("#ssid-list .list-group-item").click(function (evt) {
          // console.log("This #ssid-list: ", $(this));
          // console.log("SSID: ", $(this)[0].innerHTML.substring($(this).html().indexOf("<strong>") + 8, $(this).html().indexOf("</strong>")));
          $(".list-group-item").each(function () {
            $(this).removeClass("active");
          });
          $(this).addClass("active");
          ssidSelected = $(this)[0].innerHTML.substring($(this).html().indexOf("<strong>") + 8, $(this).html().indexOf("</strong>"));
          console.log("SSID Selected: " + ssidSelected);
          // Open modal for input SSID Config
          $("#ssid-name").val(ssidSelected);
          $("#ssid-pass").val("");
          document.getElementById("modal-wifi").showModal();
        });
        // Filtering SSID
        $("#ssid-search").keyup(function () {
          ssidSelected = null;
          $("#ssid-list .list-group-item").detach();
          console.log("Detached Element: ", elDetached);
          if ($(this).val().length > 0) {
            ssidLists.map((item, idx) => {
              // console.log("SSID List: ", item);
              if (item.ssid.toLowerCase().includes($(this).val().toLowerCase())) {
                if (item.security.length > 0) {
                  $("#ssid-list").append("<li class=\"list-group-item\"><img class=\"media-object pull-left\" src=\"./renderer-process/assets/img/lock-icon.png\" width=\"32\" height=\"32\"><div class=\"media-body\"><strong>" + item.ssid + "</strong><p>Signal Level: " + item.signalLevel + "</p></div></li>");
                } else {
                  $("#ssid-list").append("<li class=\"list-group-item\"><img class=\"media-object pull-left\" src=\"./renderer-process/assets/img/unlock-icon.png\" width=\"32\" height=\"32\"><div class=\"media-body\"><strong>" + item.ssid + "</strong><p>Signal Level: " + item.signalLevel + "</p></div></li>");
                }
              }
            })
          } else {
            elDetached.appendTo("#ssid-list");
          }
        });
      });
    } else if ($("#menutab-cloud").hasClass("active")) {
      $("#tab-device").hide();
      $("#tab-cloud").show();
    }
  });
  // Button event to navigate between menu list
  $(".nav-group-item").click(function (evt) {
    console.log("This .nav-group-item: ", $(this));
    $("#footer-toolbar").html("");
    $(".list-group-item").each(function () {
      $(this).removeClass("active");
    });
    $(".nav-group-item").each(function () {
      $(this).removeClass("active");
      $("#container-" + $(this)[0].id.split("-")[1]).hide();
    });
    $(this).addClass("active");
    $("#container-" + $(this)[0].id.split("-")[1]).show();
    if ($(this)[0].id.split("-")[1] === "configuration") {
      window.api.send("toMain", { state: "configuration menu" });
      if ($("#menutab-device").hasClass("active")) {
        $("#tab-cloud").hide();
        $("#tab-device").show();
        // SSID lists
        $("#ssid-list").html("");
        $("#ssid-list").html("<li class=\"list-group-header\"><input id=\"ssid-search\" class=\"form-control\" type=\"text\" placeholder=\"Filter SSID\"></li>");
        window.wifi.wifiNetworks().then(data => {
          ssidLists = data;
          data.forEach((item, idx) => {
            console.log("Data: ", item);
            if (item.security.length > 0) {
              $("#ssid-list").append("<li class=\"list-group-item\"><img class=\"media-object pull-left\" src=\"./renderer-process/assets/img/lock-icon.png\" width=\"32\" height=\"32\"><div class=\"media-body\"><strong>" + item.ssid + "</strong><p>Signal Level: " + item.signalLevel + "</p></div></li>");
            } else {
              $("#ssid-list").append("<li class=\"list-group-item\"><img class=\"media-object pull-left\" src=\"./renderer-process/assets/img/unlock-icon.png\" width=\"32\" height=\"32\"><div class=\"media-body\"><strong>" + item.ssid + "</strong><p>Signal Level: " + item.signalLevel + "</p></div></li>");
            }
          })
          elDetached = $("#ssid-list .list-group-item");
          // SSID selection handler
          $("#ssid-list .list-group-item").click(function (evt) {
            // console.log("This #ssid-list: ", $(this));
            // console.log("SSID: ", $(this)[0].innerHTML.substring($(this).html().indexOf("<strong>") + 8, $(this).html().indexOf("</strong>")));
            $(".list-group-item").each(function () {
              $(this).removeClass("active");
            });
            $(this).addClass("active");
            ssidSelected = $(this)[0].innerHTML.substring($(this).html().indexOf("<strong>") + 8, $(this).html().indexOf("</strong>"));
            console.log("SSID Selected: " + ssidSelected);
            // Open modal for input SSID Config
            $("#ssid-name").val(ssidSelected);
            $("#ssid-pass").val("");
            document.getElementById("modal-wifi").showModal();
          });
          // Filtering SSID
          $("#ssid-search").keyup(function () {
            ssidSelected = null;
            $("#ssid-list .list-group-item").detach();
            console.log("Detached Element: ", elDetached);
            if ($(this).val().length > 0) {
              ssidLists.map((item, idx) => {
                // console.log("SSID List: ", item);
                if (item.ssid.toLowerCase().includes($(this).val().toLowerCase())) {
                  if (item.security.length > 0) {
                    $("#ssid-list").append("<li class=\"list-group-item\"><img class=\"media-object pull-left\" src=\"./renderer-process/assets/img/lock-icon.png\" width=\"32\" height=\"32\"><div class=\"media-body\"><strong>" + item.ssid + "</strong><p>Signal Level: " + item.signalLevel + "</p></div></li>");
                  } else {
                    $("#ssid-list").append("<li class=\"list-group-item\"><img class=\"media-object pull-left\" src=\"./renderer-process/assets/img/unlock-icon.png\" width=\"32\" height=\"32\"><div class=\"media-body\"><strong>" + item.ssid + "</strong><p>Signal Level: " + item.signalLevel + "</p></div></li>");
                  }
                }
              })
            } else {
              elDetached.appendTo("#ssid-list");
            }
          });
        });
      } else if ($("#menutab-cloud").hasClass("active")) {
        $("#tab-device").hide();
        $("#tab-cloud").show();
      }
    } else if ($(this)[0].id.split("-")[1] === "data") {
      window.api.send("toMain", { state: "data menu" });
    } else if ($(this)[0].id.split("-")[1] === "ota") {
      window.api.send("toMain", { state: "ota menu" });
    }
  });
  // Submit modal for SSID
  $("#ssid-submit").click(function (evt) {
    evt.preventDefault();
    wifiConfig["ssid"] = $("#ssid-name").val();
    wifiConfig["psk"] = $("#ssid-pass").val();
    console.log("Wifi Config: ", wifiConfig);
    document.getElementById("modal-wifi").close();
  });
  // Close modal for adding sensor
  $(".modal-exit").click(function (evt) {
    evt.preventDefault();
    console.log($(this)[0].id);
    if ($(this)[0].id === "ssid-cancel") {
      wifiConfig = {};
      $("#ssid-list .list-group-item").each(function () {
        $(this).removeClass("active");
      });
    }
    // console.log(document.querySelectorAll("dialog"));
    document.querySelectorAll("dialog").forEach((item, idx) => {
      item.close();
    });
    console.log("Wifi Config: ", wifiConfig);
  });
  // Submit Wifi Config
  $("#submit-wifi-config").click(function (evt) {
    evt.preventDefault();
    if (wifiConfig.ssid) {
      window.api.send("toMain", { state: "searching devices", data: serialPortLists });
      window.api.receive("fromMain", (data) => {
        if (data.elementid) {
          // Checking data receiver handler
          if (data.elementid === "serialport-list") {
            $("#device-list").html("");
            if (data.value.length > 0) {
              serialPortLists = data.value;
              // Serialport lists for device Lists
              for (var i = 0; i < data.value.length; i++) {
                if (data.value[i].manufacturer) {
                  var o = new Option(data.value[i].manufacturer + " (" + data.value[i].path + ")", data.value[i].path);
                  /// jquerify the DOM object 'o' so we can use the html method
                  $(o).html(data.value[i].manufacturer + " (" + data.value[i].path + ")");
                  $("#device-list").append(o);
                } else {
                  var o = new Option("- (" + data.value[i].path + ")", data.value[i].path);
                  /// jquerify the DOM object 'o' so we can use the html method
                  $(o).html("- (" + data.value[i].path + ")");
                  $("#device-list").append(o);
                }
              }
            } else {
              // Serialport lists for device Lists
              for (var i = 0; i < serialPortLists.length; i++) {
                if (serialPortLists[i].manufacturer) {
                  var o = new Option(serialPortLists[i].manufacturer + " (" + serialPortLists[i].path + ")", serialPortLists[i].path);
                  /// jquerify the DOM object 'o' so we can use the html method
                  $(o).html(serialPortLists[i].manufacturer + " (" + serialPortLists[i].path + ")");
                  $("#device-list").append(o);
                } else {
                  var o = new Option("- (" + serialPortLists[i].path + ")", serialPortLists[i].path);
                  /// jquerify the DOM object 'o' so we can use the html method
                  $(o).html("- (" + serialPortLists[i].path + ")");
                  $("#device-list").append(o);
                }
              }
            }
          }
        }
      });
      document.getElementById("modal-device").showModal();
    } else {
      document.getElementById("modal-notification").close();
      $("#notification-content").html("Wifi SSID Must be Selected");
      document.getElementById("modal-notification").showModal();
      // alert("Not Selected")
    }
    /* if (wifiConfig.ssid) {
      window.api.send("toMain", { state: "upload wifi config", data: wifiConfig });
    } else {
      document.getElementById("modal-notification").close();
      $("#notification-content").html("Wifi Config is not Set");
      document.getElementById("modal-notification").showModal();
      // alert("Not Selected")
    } */
  });
  // Upload Wifi Config to Device
  $("#device-submit").click(function (evt) {
    evt.preventDefault();
    wifiConfig["path"] = $("#device-list").val();
    if (wifiConfig.ssid && wifiConfig.path) {
      window.api.send("toMain", { state: "upload wifi config", data: wifiConfig });
      document.getElementById("modal-device").close();
    } else {
      document.getElementById("modal-notification").close();
      $("#notification-content").html("Wifi and Device Config Must be Specified");
      document.getElementById("modal-notification").showModal();
    }
  });
  // Open tab for display device
  $("#menutab-device").click(function (evt) {
    $("#menutab-cloud").removeClass("active");
    $("#menutab-device").addClass("active");
    $("#tab-cloud").hide();
    $("#tab-device").show();
  });
  // Open tab for display cloud
  $("#menutab-cloud").click(function (evt) {
    $("#menutab-device").removeClass("active");
    $("#menutab-cloud").addClass("active");
    $("#tab-device").hide();
    $("#tab-cloud").show();
  });
  // OTA
  var cy = cytoscape({
    container: document.getElementById("cy"),
    boxSelectionEnabled: false,
    autounselectify: true,
    style: [
      {
        selector: "node",
        style: {
          "content": "data(id)",
          "text-valign": "center",
          "text-halign": "center"
        }
      },
      {
        selector: ":parent",
        css: {
          "text-valign": "top",
          "text-halign": "center",
        }
      },
      {
        selector: "edge",
        style: {
          "curve-style": "bezier",
          "target-arrow-shape": "triangle"
        }
      },
      // some style for the extension
      {
        selector: ".highlighted",
        style: {
          "background-color": "#61bffc",
          "line-color": "#61bffc",
          "target-arrow-color": "#61bffc",
          "transition-property": "background-color, line-color, target-arrow-color",
          "transition-duration": "0.5s"
        }
      },
    ],
    elements: {
      nodes: [
        { data: { id: "D1", parent: "Digital" }, position: { x: 80, y: 80 } },
        { data: { id: "D2", parent: "Digital" }, position: { x: 80, y: 120 } },
        { data: { id: "D3", parent: "Digital" }, position: { x: 80, y: 160 } },
        { data: { id: "D4", parent: "Digital" }, position: { x: 80, y: 200 } },
        { data: { id: "D5", parent: "Digital" }, position: { x: 80, y: 240 } },
        { data: { id: "D6", parent: "Digital" }, position: { x: 80, y: 280 } },
        { data: { id: "Digital", parent: "Pandaya+" } },
        { data: { id: "A1", parent: "Analog" }, position: { x: 140, y: 80 } },
        { data: { id: "A2", parent: "Analog" }, position: { x: 140, y: 120 } },
        { data: { id: "A3", parent: "Analog" }, position: { x: 140, y: 160 } },
        { data: { id: "A4", parent: "Analog" }, position: { x: 140, y: 200 } },
        { data: { id: "A5", parent: "Analog" }, position: { x: 140, y: 240 } },
        { data: { id: "A6", parent: "Analog" }, position: { x: 140, y: 280 } },
        { data: { id: "Analog", parent: "Pandaya+" } },
        { data: { id: "I1", parent: "I2C" }, position: { x: 200, y: 80 } },
        { data: { id: "I2", parent: "I2C" }, position: { x: 200, y: 120 } },
        { data: { id: "I3", parent: "I2C" }, position: { x: 200, y: 160 } },
        { data: { id: "I4", parent: "I2C" }, position: { x: 200, y: 200 } },
        { data: { id: "I5", parent: "I2C" }, position: { x: 200, y: 240 } },
        { data: { id: "I6", parent: "I2C" }, position: { x: 200, y: 280 } },
        { data: { id: "I2C", parent: "Pandaya+" } },
        { data: { id: "Pandaya+" } },
        { data: { id: "Apps" }, position: { x: 750, y: 160 } },
        { data: { id: "Cloud" }, position: { x: 750, y: 200 } }
      ],
      edges: [
        { data: { id: "PA", source: "Pandaya+", target: "Apps" } },
        { data: { id: "PC", source: "Pandaya+", target: "Cloud" } }
      ]
    },
    layout: {
      name: "preset",
      padding: 5
    }
  });
  var nodeSpec = cy.elements().nodes();
  // console.log("Index of Cloud Node", nodeSpec.map(el => { return el._private.data.id }).indexOf("Cloud"));
  cy.unbind("click");
  cy.bind("click", "node", function (node) {
    console.log("Clicked Node", this);
    if (this.hasClass("highlighted")) {
      this.removeClass("highlighted");
      delete otaConfig[this._private.data.id];
      document.getElementById("modal-notification").close();
      $("#notification-content").html("Port " + this._private.data.id + " Disabled");
      document.getElementById("modal-notification").showModal();
      // alert("Node " + this._private.data.id + " Disabled");
    } else {
      this.addClass("highlighted");
      otaConfig[this._private.data.id] = {
        status: 1
      }
      document.getElementById("modal-notification").close();
      $("#notification-content").html("Port " + this._private.data.id + " Enabled");
      document.getElementById("modal-notification").showModal();
      // alert("Node " + this._private.data.id + " Enabled");
    }
  })
  // Submit cloud config
  /* $("#submit-cloud-config").click(function (evt) {
    evt.preventDefault();
    if ($("#cloud-enable").val() === "1") {
      nodeSpec[nodeSpec.map(el => { return el._private.data.id }).indexOf("Cloud")].addClass("highlighted");
    } else {
      nodeSpec[nodeSpec.map(el => { return el._private.data.id }).indexOf("Cloud")].removeClass("highlighted");
    }
  }); */
  // Upload OTA
  $("#upload-program").click(function (evt) {
    evt.preventDefault();
    window.api.send("toMain", { state: "upload config", data: otaConfig });
  });
  // Notification handler
  window.api.receive("fromMain", (data) => {
    if (data.elementid) {
      console.log("Received from main process");
      // Checking data receiver handler
      if (data.elementid === "notification") {
        console.log("Data Value: ", data.value);
        document.getElementById("modal-notification").close();
        $("#notification-content").html(data.value);
        document.getElementById("modal-notification").showModal();
      }
    }
  })

  /**
   *
  // Initiate variables used
  var devicePort = "";
  var baudRate = 9600;
  var serialPortLists = [];
  var serialPortPathSelected = null;
  var preferences = {};
  var elDetached = null;
  var numberOfSensor = 0;
  var sensor = [];
  var dataNumber = 0;
  var regClicked = 0;
  var dataTemp = [];
  var dataRegXY = [];
  var regX = [];
  var regY = [];
  var sbx = [];
  var sby = [];
  // Showing up about window and hiding main window app
  $("#about-modal").show();
  $("#window-app").hide();
  $("#container-experiment").hide();
  $("#container-preferences").hide();
  $("#experiment-menu").hide();
  // Window ready to send to main process
  window.api.send("toMain", { state: "window is ready" });
  // Receive data event from main process
  window.api.receive("fromMain", (data) => {
    if (data.elementid) {
      console.log("Received from main process");
      // Checking data receiver handler
      if (data.elementid === "serialport-list") {
        if (data.value.length > 0) {
          // Serialport lists for experiment
          $("#serialport-list").html("<li class=\"list-group-header\"><input id=\"serialport-search\" class=\"form-control\" type=\"text\" placeholder=\"Filter Path\"></li>");
          $("#serialport").html("");
          serialPortLists = data.value;
          data.value.forEach((item, idx) => {
            // console.log("Data Value: ", item);
            if (item.manufacturer) {
              if (item.manufacturer.toLowerCase().includes("arduino")) {
                $("#" + data.elementid).append("<li class=\"list-group-item\"><img class=\"img-circle media-object pull-left\" src=\"./assets/img/arduino-icon.png\" width=\"32\" height=\"32\"><div class=\"media-body\"><strong>" + item.manufacturer + "</strong><p>" + item.path + "</p></div></li>");
              } else {
                $("#" + data.elementid).append("<li class=\"list-group-item\"><img class=\"img-circle media-object pull-left\" src=\"./assets/img/serialport-icon.png\" width=\"32\" height=\"32\"><div class=\"media-body\"><strong>" + item.manufacturer + "</strong><p>" + item.path + "</p></div></li>");
              }
            } else {
              $("#" + data.elementid).append("<li class=\"list-group-item\"><img class=\"img-circle media-object pull-left\" src=\"./assets/img/serialport-icon.png\" width=\"32\" height=\"32\"><div class=\"media-body\"><strong>-</strong><p>" + item.path + "</p></div></li>")
            }
          })
          elDetached = $("#serialport-list .list-group-item");
          // Serialport lists for preferences
          serialPortPathSelected = null;
          $("#serialport-list .list-group-item").each(function () {
            // console.log("Serial Port Path: ", $(this).html().substring($(this).html().indexOf("<p>") + 3, $(this).html().indexOf("</p>")));
            $(this).removeClass("active");
            if ($(this).html().substring($(this).html().indexOf("<p>") + 3, $(this).html().indexOf("</p>")) === preferences.serialport) {
              $(this).addClass("active");
              serialPortPathSelected = $(this).html().substring($(this).html().indexOf("<p>") + 3, $(this).html().indexOf("</p>"));
            }
          });
          // Serialport selection handler
          $("#serialport-list .list-group-item").click(function (evt) {
            // console.log("This #serialport-list: ", $(this));
            // console.log("Serial Port Path: ", $(this)[0].innerHTML.substring($(this).html().indexOf("<p>") + 3, $(this).html().indexOf("</p>")));
            $(".list-group-item").each(function () {
              $(this).removeClass("active");
            });
            $(this).addClass("active");
            serialPortPathSelected = $(this)[0].innerHTML.substring($(this).html().indexOf("<p>") + 3, $(this).html().indexOf("</p>"));
          });
          // Filtering serialport
          $("#serialport-search").keyup(function () {
            serialPortPathSelected = null;
            $("#serialport-list .list-group-item").detach();
            // console.log("Detached Element: ", elDetached);
    				if ($(this).val().length > 0) {
              serialPortLists.map((item, idx) => {
                // console.log("Serial Port List: ", item);
                if (item.path.toLowerCase().includes($(this).val().toLowerCase())) {
                  if (item.manufacturer) {
                    if (item.manufacturer.toLowerCase().includes("arduino")) {
                      $("#serialport-list").append("<li class=\"list-group-item\"><img class=\"img-circle media-object pull-left\" src=\"./assets/img/arduino-icon.png\" width=\"32\" height=\"32\"><div class=\"media-body\"><strong>" + item.manufacturer + "</strong><p>" + item.path + "</p></div></li>");
                    } else {
                      $("#serialport-list").append("<li class=\"list-group-item\"><img class=\"img-circle media-object pull-left\" src=\"./assets/img/serialport-icon.png\" width=\"32\" height=\"32\"><div class=\"media-body\"><strong>" + item.manufacturer + "</strong><p>" + item.path + "</p></div></li>");
                    }
                  } else {
                    $("#serialport-list").append("<li class=\"list-group-item\"><img class=\"img-circle media-object pull-left\" src=\"./assets/img/serialport-icon.png\" width=\"32\" height=\"32\"><div class=\"media-body\"><strong>-</strong><p>" + item.path + "</p></div></li>")
                  }
                }
              })
            } else {
              elDetached.appendTo("#serialport-list");
            }
            // Serialport lists for preferences
            $("#serialport-list .list-group-item").each(function () {
              // console.log("Serial Port Path: ", $(this).html().substring($(this).html().indexOf("<p>") + 3, $(this).html().indexOf("</p>")));
              $(this).removeClass("active");
              if ($(this).html().substring($(this).html().indexOf("<p>") + 3, $(this).html().indexOf("</p>")) === preferences.serialport) {
                $(this).addClass("active");
                serialPortPathSelected = $(this).html().substring($(this).html().indexOf("<p>") + 3, $(this).html().indexOf("</p>"));
              }
            });
            // Serialport selection handler
            $("#serialport-list .list-group-item").click(function (evt) {
              // console.log("This #serialport-list: ", $(this));
              // console.log("Serial Port Path: ", $(this)[0].innerHTML.substring($(this).html().indexOf("<p>") + 3, $(this).html().indexOf("</p>")));
              $(".list-group-item").each(function () {
                $(this).removeClass("active");
              });
              $(this).addClass("active");
              serialPortPathSelected = $(this)[0].innerHTML.substring($(this).html().indexOf("<p>") + 3, $(this).html().indexOf("</p>"));
            });
          });
        }
      } else if (data.elementid === "container-preferences") {
        console.log("Data Value: ", data.value);
        preferences = data.value;
        $("#baudrate").val(data.value.baudrate);
      } else if (data.elementid === "notification") {
        console.log("Data Value: ", data.value);
        document.getElementById("modal-notification").close();
        $("#notification-content").html(data.value);
        document.getElementById("modal-notification").showModal();
      } else if (data.elementid === "sensor-stat") {
        console.log("Data Value: ", data.value);
        if (isNaN(data.value)) {
          document.getElementById("modal-notification").close();
          $("#notification-content").html(data.value);
          document.getElementById("modal-notification").showModal();
        } else {
          sensor.forEach((item, idx) => {
            if (Number(data.value) === Number(item.signal)) {
              console.log("Index: ", idx);
              $("#" + (idx + 1).toString() + "stat").html("<span class=\"icon icon-check\"></span>");
            }
          })
        }
      } else if (data.elementid === "experiment-data") {
        console.log("Signal Data: ", data.value);
        if (isNaN(data.value)) {
          document.getElementById("modal-notification").close();
          $("#notification-content").html(data.value);
          document.getElementById("modal-notification").showModal();
        } else {
          dataTemp.push({
            timestamp: new Date(),
            signal: Number(data.value)
          });
          console.log("Sensor: ", sensor);
          console.log("Data Temp: ", dataTemp);
          if (sensor.length > 0) {
            var reference = dataTemp.filter((elem) => Number(sensor.find((el) => el.name === "1").signal) === Number(elem.signal));
            var r = sensor.filter((elem) => Number(elem.signal) === Number(data.value));
            var s = dataTemp.filter((elem) => Number(elem.signal) === Number(data.value));
            console.log("Ref: ", reference);
            console.log("Prop: ", r);
            console.log("Data: ", s);
            if (r.length > 0) {
              var tempDataXY = [];
              dataNumber++;
              sbx.push((new Date(s[0].timestamp).getTime() - new Date(reference[0].timestamp).getTime())/1000.);
              sby.push(Number(r[0].dist));
              tempDataXY.push((new Date(s[0].timestamp).getTime() - new Date(reference[0].timestamp).getTime())/1000.);
              tempDataXY.push(Number(r[0].dist));
              $("#table-data tbody").append("<tr><td>" + dataNumber.toString() + "</td><td>" + new Date(s[0].timestamp).getTime().toString() + "</td><td>" + ((new Date(s[0].timestamp).getTime() - new Date(reference[0].timestamp).getTime())/1000.).toString() + "</td><td>" + r[0].dist + "</td></tr>");
              console.log("Sb.X: ", sbx);
              console.log("Sb.Y: ", sby);
              console.log("TempXY: ", tempDataXY);
              dataRegXY.push(tempDataXY);
              // Create a Plot
              var trace = {
                x: sbx,
                y: sby,
                mode: "markers",
                type: "scatter",
                name: "Data",
                marker: { size: 8 }
              };
              var layout = {
                xaxis: {
                  title: {
                    text: "t (s)"
                  }
                },
                yaxis: {
                  title: {
                    text: "s (cm)"
                  }
                },
              };
              var config = {
                responsive: true,
                scrollZoom: true,
                displaylogo: false,
                modeBarButtonsToRemove: ["zoom2d","pan2d","select2d","lasso2d","toggleSpikelines","resetScale2d"],
                modeBarButtonsToAdd: [{
                  name: "Draw regression",
                  icon: Plotly.Icons["drawline"],
                  click: function (gd) {
                    regX = [];
                    regY = [];
                    // console.log("Plot Div: ", gd);
                    var result = window.regression.linear(dataRegXY);
                    var xMax = Math.ceil(Math.max.apply(null, sbx));
                    var xMin = Math.floor(Math.min.apply(null, sbx));
                    for (var i = xMin * 100; i <= xMax * 100; i++) {
                      regX.push(i/100);
                      regY.push((result.equation[0] * i/100) + result.equation[1]);
                    }
                    document.getElementById("modal-notification").close();
                    $("#notification-content").html(result.string);
                    document.getElementById("modal-notification").showModal();
                    if (regClicked > 0) {
                      if (gd.data.length > 1) {
                        Plotly.deleteTraces(gd, [-1]);
                        Plotly.addTraces(gd, {
                          x: regX,
                          y: regY,
                          mode: 'lines',
                          type: 'scatter',
                          name: 'Regression'
                        });
                      } else {
                        Plotly.addTraces(gd, {
                          x: regX,
                          y: regY,
                          mode: 'lines',
                          type: 'scatter',
                          name: 'Regression'
                        });
                      }
                      // Plotly.deleteTraces(gd, [-1]);
                    } else {
                      Plotly.addTraces(gd, {
                        x: regX,
                        y: regY,
                        mode: 'lines',
                        type: 'scatter',
                        name: 'Regression'
                      });
                      regClicked++
                    }
                  }
                }]
              };
              Plotly.newPlot("plot-data", [trace], layout, config);
            }
          } else {
            document.getElementById("modal-notification").close();
            $("#notification-content").html("Please Prepare Sensor Data Used in Preparation First");
            document.getElementById("modal-notification").showModal();
          }
        }
      }
    }
  });
  // Button event to show about window
  $("#get-about").click(function (evt) {
    $("#about-modal").show();
    $("#window-app").hide();
  });
  // Button event to show main window app
  $("#get-started").click(function (evt) {
    $("#about-modal").hide();
    $("#window-app").show();
    window.api.send("toMain", { state: "callibrating sensor" });
  });
  // Button event to submit preferences
  $("#submit-preferences").click(function (evt) {
    evt.preventDefault();
    console.log("Serial Port Selected: ", serialPortPathSelected);
    console.log("Baud Rate Selected: ", $("#baudrate").val());
    if (serialPortPathSelected && $("#baudrate").val()) {
      window.api.send("toMain", { state: "preferences val", val: { serialport: serialPortPathSelected, baudrate: Number($("#baudrate").val()) } });
    } else {
      document.getElementById("modal-notification").close();
      $("#notification-content").html("Please, at Least Select One Preferences");
      document.getElementById("modal-notification").showModal();
    }
  });
  // Button event to navigate between menu list
  $(".nav-group-item").click(function (evt) {
    console.log("This .nav-group-item: ", $(this));
    $("#experiment-menu").hide();
    $("#footer-toolbar").html("");
    $(".list-group-item").each(function () {
      $(this).removeClass("active");
    });
    $(".nav-group-item").each(function () {
      $(this).removeClass("active");
      $("#container-" + $(this)[0].id.split("-")[1]).hide();
    });
    $(this).addClass("active");
    $("#container-" + $(this)[0].id.split("-")[1]).show();
    if ($(this)[0].id.split("-")[1] === "preparation") {
      dataTemp = [];
      window.api.send("toMain", { state: "callibrating sensor" });
      $("#footer-toolbar").html("<button id=\"sensor-open\" class=\"btn btn-default active\"><span class=\"icon icon-list-add\"></span></button>");
      // Open modal for adding sensor
      $("#sensor-open").click(function (evt) {
        document.getElementById("modal-sensor").showModal();
      });
    } else if ($(this)[0].id.split("-")[1] === "experiment") {
      window.api.send("toMain", { state: "experiment data" });
      $("#experiment-menu").show();
      if ($("#menutab-data").hasClass("active")) {
        $("#tab-plot").hide();
        $("#tab-data").show();
      } else if ($("#menutab-plot").hasClass("active")) {
        $("#tab-data").hide();
        $("#tab-plot").show();
      }
      $("#footer-toolbar").html("<button id=\"reset-data\" class=\"btn btn-negative\">Reset</button>");
      // Reset Data
      $("#reset-data").click(function (evt) {
        $("#plot-data").html("");
        $("#table-data tbody").html("");
        dataNumber = 0;
        regClicked = 0;
        dataTemp = [];
        dataRegXY = [];
        regX = [];
        regY = [];
        sbx = [];
        sby = [];
        window.api.send("toMain", { state: "reset value" });
      });
    } else if ($(this)[0].id.split("-")[1] === "preferences") {
      dataTemp = [];
      window.api.send("toMain", { state: "reload list" });
      window.api.send("toMain", { state: "check preferences" });
    }
  });
  // Open modal for adding sensor
  $("#sensor-open").click(function (evt) {
    document.getElementById("modal-sensor").showModal();
  });
  // Close modal for adding sensor
  $(".modal-exit").click(function (evt) {
    evt.preventDefault();
    // console.log(document.querySelectorAll("dialog"));
    document.querySelectorAll("dialog").forEach((item, idx) => {
      item.close();
    })
  });
  // Submit modal for adding sensor
  $("#sensor-submit").click(function (evt) {
    evt.preventDefault();
    console.log("Number of Sensor: ", numberOfSensor);
		console.log("Sensor Number: ", $("#sensor-num").val());
    console.log("Sensor Signal: ", $("#sensor-signal").val());
		console.log("Sensor Distance: ", $("#sensor-dist").val());
    // window.api.send("toMain", { state: "cookies store" });
    sensor.push({
      name: $("#sensor-num").val(),
      signal: $("#sensor-signal").val(),
      dist: $("#sensor-dist").val()
    })
    $("#sensor-prop tbody").append("<tr><td>" + (numberOfSensor + 1).toString() + "</td><td>" + sensor[numberOfSensor].signal.toString() + "</td><td>" + sensor[numberOfSensor].dist.toString() + "</td><td id=\"" + (numberOfSensor + 1).toString() + "stat\" class=\"text-center\"><span class=\"icon icon-minus\"></span></td><td class=\"text-center\"><span id=\"" + (numberOfSensor + 1).toString() + "del\" class=\"icon icon-trash\" title=\"Remove Sensor\"></span>&nbsp;<span id=\"" + (numberOfSensor + 1).toString() + "modify\" class=\"icon icon-pencil\" title=\"Edit Sensor Properties\"></span></td></tr>");
    numberOfSensor = sensor.length;
    $("#sensor-num").val(numberOfSensor + 1);
    // Remove listener for sensor
    $("#" + numberOfSensor.toString() + "del").click(function (evt) {
      if (Number(this.id.replace("del", "")) == numberOfSensor) {
        console.log("Closest <tr>: ", $(this).closest("tr"));
        sensor.pop();
        numberOfSensor = sensor.length;
        $("#sensor-num").val(numberOfSensor + 1);
        $(this).closest("tr").remove();
      } else {
        document.getElementById("modal-notification").close();
        $("#notification-content").html("Cannot be Removed");
        document.getElementById("modal-notification").showModal();
      }
    });
    document.getElementById("modal-sensor").close();
  });
  // Open tab for display plot
  $("#menutab-plot").click(function (evt) {
    $("#menutab-data").removeClass("active");
    $("#menutab-plot").addClass("active");
    $("#tab-data").hide();
    $("#tab-plot").show();
  });
  // Open tab for display table data
  $("#menutab-data").click(function (evt) {
    $("#menutab-plot").removeClass("active");
    $("#menutab-data").addClass("active");
    $("#tab-plot").hide();
    $("#tab-data").show();
  });
   *
   */
});
