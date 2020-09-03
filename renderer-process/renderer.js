// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are not available in this process.
var otaConfig = {};
var wifiConfig = {};
var elDetached = null;
var ssidSelected = null;
var ssidLists = [];
var serialPortLists = [];
var clickedNode = "";
var clickedNodeDetail = null;
var moduleLists = [];
var elModDetached = null;
var moduleSelected = null;

$(document).ready(function () {
  console.log("This PC IP: ", window.ip.address().toString());
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
          // console.log("Data: ", item);
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
          // console.log("SSID Selected: " + ssidSelected);
          // Open modal for input SSID Config
          $("#ssid-name").val(ssidSelected);
          $("#ssid-pass").val("");
          document.getElementById("modal-wifi").showModal();
        });
        // Filtering SSID
        $("#ssid-search").keyup(function () {
          ssidSelected = null;
          $("#ssid-list .list-group-item").detach();
          // console.log("Detached Element: ", elDetached);
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
    // console.log("This .nav-group-item: ", $(this));
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
            // console.log("Data: ", item);
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
            // console.log("SSID Selected: " + ssidSelected);
            // Open modal for input SSID Config
            $("#ssid-name").val(ssidSelected);
            $("#ssid-pass").val("");
            document.getElementById("modal-wifi").showModal();
          });
          // Filtering SSID
          $("#ssid-search").keyup(function () {
            ssidSelected = null;
            $("#ssid-list .list-group-item").detach();
            // console.log("Detached Element: ", elDetached);
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
    // console.log($(this)[0].id);
    if ($(this)[0].id === "ssid-cancel") {
      wifiConfig = {};
      $("#ssid-list .list-group-item").each(function () {
        $(this).removeClass("active");
      });
      // console.log("Wifi Config: ", wifiConfig);
    } else if ($(this)[0].id.includes("module-cancel")) {
      $("#config-module .form-group").remove();
      delete otaConfig[clickedNode];
    }
    // console.log(document.querySelectorAll("dialog"));
    document.querySelectorAll("dialog").forEach((item, idx) => {
      item.close();
    });
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
    }
    /* if (wifiConfig.ssid) {
      window.api.send("toMain", { state: "upload wifi config", data: wifiConfig });
    } else {
      document.getElementById("modal-notification").close();
      $("#notification-content").html("Wifi Config is not Set");
      document.getElementById("modal-notification").showModal();
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
    // console.log("Clicked Node", this);
    // Module lists
    $("#module-list").html("");
    $("#module-list").html("<li class=\"list-group-header\"><input id=\"module-search\" class=\"form-control\" type=\"text\" placeholder=\"Filter Module\"></li>");
    clickedNode = this._private.data.id;
    clickedNodeDetail = this;
    if (this.hasClass("highlighted")) {
      this.removeClass("highlighted");
      delete otaConfig[this._private.data.id];
      document.getElementById("modal-notification").close();
      $("#notification-content").html("Node " + this._private.data.id + " Disabled");
      document.getElementById("modal-notification").showModal();
    } else {
      if (this._private.data.id === "Apps") {
        otaConfig["Apps"] = {
          config: {
            address: window.ip.address().toString()
          }
        }
        this.addClass("highlighted");
        document.getElementById("modal-notification").close();
        $("#notification-content").html("Node " + this._private.data.id + " Enabled");
        document.getElementById("modal-notification").showModal();
      } else {
        $.ajax({
          url: "https://repo.quadran4ds.com/module",
          type: "GET",
          encode: true,
          success: function (res) {
            // console.log("Module", res);
            moduleLists = res.data;
            // Module lists
            res.data.forEach((item, idx) => {
              console.log("Data: ", item);
              if (item.thumb) {
                $("#module-list").append("<li class=\"list-group-item\"><img class=\"media-object pull-left\" src=\"" + item.thumb + "\" width=\"32\" height=\"32\"><div class=\"media-body\"><strong>" + item.name + "</strong><p>" + item._id + "</p></div></li>");
              } else {
                $("#module-list").append("<li class=\"list-group-item\"><img class=\"media-object pull-left\" src=\"./renderer-process/assets/img/module.png\" width=\"32\" height=\"32\"><div class=\"media-body\"><strong>" + item.name + "</strong><p>" + item._id + "</p></div></li>");
              }
            })
            elModDetached = $("#module-list .list-group-item");
            // Module selection handler
            $("#module-list .list-group-item").click(function (evt) {
              // console.log("This #module-list: ", $(this));
              // console.log("Module: ", $(this)[0].innerHTML.substring($(this).html().indexOf("<p>") + 3, $(this).html().indexOf("</p>")));
              $("#config-module .form-group").remove();
              $(".list-group-item").each(function () {
                $(this).removeClass("active");
              });
              $(this).addClass("active");
              moduleSelected = $(this)[0].innerHTML.substring($(this).html().indexOf("<p>") + 3, $(this).html().indexOf("</p>"));
              // console.log("Module Selected: " + moduleSelected);
              // Open modal for input Module Config
              var selectedModule = {};
              selectedModule = moduleLists[moduleLists.findIndex(v => v._id === $(this)[0].innerHTML.substring($(this).html().indexOf("<p>") + 3, $(this).html().indexOf("</p>")))]
              for (var i = 0; i < Object.keys(selectedModule.config).length; i++) {
                // console.log("Module Config", Object.keys(selectedModule.config)[i]);
                $("#config-module").append("<div class=\"form-group\"><label>" + Object.keys(selectedModule.config)[i] + "</label><input type=\"text\" class=\"form-control\" name=\"" + Object.keys(selectedModule.config)[i] + "\" value=\"" + selectedModule.config[Object.keys(selectedModule.config)[i]] + "\"></div>");
              }
              document.getElementById("modal-config-module").showModal();
            });
            // Filtering Module
            $("#module-search").keyup(function () {
              moduleSelected = null;
              $("#module-list .list-group-item").detach();
              // console.log("Detached Module Element: ", elModDetached);
              if ($(this).val().length > 0) {
                moduleLists.map((item, idx) => {
                  // console.log("SSID List: ", item);
                  if (item.name.toLowerCase().includes($(this).val().toLowerCase())) {
                    if (item.thumb) {
                      $("#module-list").append("<li class=\"list-group-item\"><img class=\"media-object pull-left\" src=\"" + item.thumb + "\" width=\"32\" height=\"32\"><div class=\"media-body\"><strong>" + item.name + "</strong><p>" + item._id + "</p></div></li>");
                    } else {
                      $("#module-list").append("<li class=\"list-group-item\"><img class=\"media-object pull-left\" src=\"./renderer-process/assets/img/module.png\" width=\"32\" height=\"32\"><div class=\"media-body\"><strong>" + item.name + "</strong><p>" + item._id + "</p></div></li>");
                    }
                  }
                })
              } else {
                elModDetached.appendTo("#module-list");
              }
            });
          },
          error: function (err) {
            console.log("Error", err);
          }
        }).done(function () {
          // moduleDiv = $("#module-data").html();
          document.getElementById("modal-ota").showModal();
        });
      }
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
  // Module config submit
  $("#config-module-submit").click(function (evt) {
    evt.preventDefault();
    otaConfig[clickedNode] = {};
    otaConfig[clickedNode]["module"] = moduleSelected;
    otaConfig[clickedNode]["config"] = {};
    $.each($('#config-module input').serializeArray(), function (i, field) {
      // console.log("Field", field)
      otaConfig[clickedNode]["config"][`${field.name}`] = field.value;
    });
    // console.log("OTA Config", otaConfig);
    document.getElementById("modal-config-module").close();
  });
  // Submit module used
  $("#module-submit").click(function (evt) {
    evt.preventDefault();
    clickedNodeDetail.addClass("highlighted");
    console.log("OTA Config", otaConfig);
    document.getElementById("modal-ota").close();
  });
  // Upload OTA
  $("#upload-program").click(function (evt) {
    evt.preventDefault();
    if (Object.keys(otaConfig).length > 0) {
      window.api.send("toMain", { state: "upload config", data: otaConfig });
    } else {
      document.getElementById("modal-notification").close();
      $("#notification-content").html("Please Input Your Configuration");
      document.getElementById("modal-notification").showModal();
    }
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
});
