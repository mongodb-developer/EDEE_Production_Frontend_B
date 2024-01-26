let code, response, endpointName, databox, infobox;
let codeChanged;
const useACE = true;
let _saveFileName = null;

const serviceHostname = "https://hostname:5500/service/";
async function onLoad() {
  if (useACE) {
    var editor = ace.edit("editor");
    editor.setTheme("ace/theme/cobalt");
    editor.session.setMode("ace/mode/javascript");
    editor.setOptions({
      fontFamily: "Source Code Pro",
      fontSize: "12pt",
    });

    document.getElementById("codediv").style.display = "none";
    _code = editor; // Changed for ACE
  } else {
    document.getElementById("editor").style.display = "none";
    _code = document.getElementById("codediv");
  }
  _output = document.getElementById("response");
  _postdata = document.getElementById("postdata");
  endpointName = document.getElementById("endpoint");
  document.getElementById("url").innerText = serviceHostname;
  codeChanged = true;

  // we can feed index.html with a different src file each time
  // we extract the code and put it in the code element
  const myURL = new URL(window.location);
  if (myURL.searchParams && myURL.searchParams.get("src")) {
    await loadTemplateCode(myURL.searchParams.get("src"));
    if (myURL.searchParams.get("title")) {
      document.title = myURL.searchParams.get("title");
    } else {
      document.title = myURL.searchParams.get("src").split("_").join("/");
    }
  }

  _code.onkeydown = function (e) {
    codeChanged = true;
    if (useACE == false && e.key == "Tab") {
      console.log("TAB");
      insertTextAtCursor("    ");
      e.preventDefault();
    }
  };
  // messageBox("Hi - I'm for debugging and things");

  // Sometimes we want to hide the GET or POST buttons
  if (myURL.searchParams && myURL.searchParams.get("hideGETbutton")) {
    callServiceGETButton = document.getElementById("callServiceGET");
    callServiceGETButton.style.visibility = "hidden";
  }

  if (myURL.searchParams && myURL.searchParams.get("hidePOSTbutton")) {
    callServicePOSTButton = document.getElementById("callServicePOST");
    callServicePOSTButton.style.visibility = "hidden";
  }

  // loader commented out, we can add it in the future if that's needed
  // loader = document.getElementById("loader");
  // loader.style.visibility = "hidden";
}

function loadLocalCode(filePath) {
  let reader = new FileReader(); // no arguments
  reader.readAsText(filePath);

  _output.innerText = "";
  _postdata.innerText = "";

  reader.onload = function () {
    if (useACE) {
      _code.setValue(reader.result, -1);
    } else {
      _code.innerText = reader.result;
    }
  };

  reader.onerror = function () {
    alert(reader.error);
  };
}

function insertTextAtCursor(text) {
  let selection = window.getSelection();
  let range = selection.getRangeAt(0);
  range.deleteContents();
  let node = document.createTextNode(text);
  range.insertNode(node);

  selection.collapseToEnd();
}

function messageBox(str) {
  document.getElementById("infobox").innerText = str;
}

async function callService(method) {
  cons0le.contents=""
  try {
    // loader.style.visibility = "visible";
    _output.innerText = "";
    const fullURL = serviceHostname + endpointName.innerText;

    const response = await callVirtualEndpoint(fullURL, method);

    let renderOut = ""
    if(cons0le.contents)
    {
      renderOut += "------- Console ----------\n"
      renderOut += cons0le.contents;
      renderOut += "\n--------------------------\n\n"
    }

    renderOut += `"StatusCode": ${response._status}\n`;
    for (const key in response._headers) {
      renderOut += `"${key}": ${response._headers[key]}\n\n`;
    }

    if (
      typeof response._data === "string" ||
      response._data instanceof String
    ) {
      renderOut += `${response._data}`;
    } else {
      renderOut += JSON.stringify(response._data, null, 2);
    }

    _output.innerText = renderOut;
  } catch (error) {
    console.error(error);
    messageBox(error); // Fatal problem
  } finally {
    // loader.style.visibility = "hidden";
  }
}

//Load a JS file and populate the code side

async function loadTemplateCode(fname) {
  parts = fname.split("_");

  url = "examples/" + parts.join("/") + "/" + parts[parts.length - 1];

  let response = await fetch(`${url}.js`);
  if (response.status == 200) {
    if (useACE) {
      _code.setValue(await response.text(), -1);
    } else {
      _code.innerText = await response.text();
    }
  } else {
    //We dont really care if it's missing
    if (useACE) {
      _code.setValue("// EXAMPLE CODE MISSING - Is URL Correct", -1);
    } else {
      _code.innerText = "// EXAMPLE CODE MISSING - Is URL Correct";
    }
  }

  response = await fetch(`${url}.json`);
  if (response.status == 200) {
    _postdata.innerText = await response.text();
  } else {
    _postdata.innerText = "";
  }

  response = await fetch(`${url}.url`);
  if (response.status == 200) {
    endpointName.innerText = await response.text();
  } else {
    endpointName.innerText = "";
  }
}

function saveToClipboard() {
  if (useACE) {
    navigator.clipboard.writeText(_code.getValue());
  } else {
    navigator.clipboard.writeText(_code.innerText);
  }
}

function saveCode() {
  let data = "";
  if (useACE) {
    data = _code.getValue();
  } else {
    data = _code.innerText;
  }
  if (_saveFileName == null) {
    _saveFileName = prompt("Please enter a filename");
  }

  var file = new Blob([data], { type: "application/javascript" });
  var a = document.createElement("a");
  var url = URL.createObjectURL(file);
  a.href = url;
  a.download = _saveFileName;
  document.body.appendChild(a);
  a.click();
  setTimeout(function () {
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }, 0);
}
