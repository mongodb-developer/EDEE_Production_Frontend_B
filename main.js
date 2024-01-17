
let code, response, endpointName, databox, infobox
let codeChanged

const serviceHostname = "https://hostname:5500/service/"
async function onLoad() {
    code = document.getElementById('codediv')
    output = document.getElementById('response')
    postdata = document.getElementById('postdata')
    endpointName = document.getElementById('endpoint')
    document.getElementById('url').innerText = serviceHostname;
    codeChanged = true;

    // we can feed index.html with a different src file each time
    // we extract the code and put it in the code element
    const myURL = new URL(window.location)
    if (myURL.searchParams && myURL.searchParams.get("src")) {
        await loadTemplateCode(myURL.searchParams.get("src"))
    }

   

    code.onkeydown = function(e){
        codeChanged = true;
        if(e.key == 'Tab') {
            console.log("TAB")
            insertTextAtCursor("    ");
            e.preventDefault();
        }
    }
    // messageBox("Hi - I'm for debugging and things");

    // Sometimes we want to hide the GET or POST buttons
    if (myURL.searchParams && myURL.searchParams.get("hideGETbutton")) {
        callServiceGETButton = document.getElementById('callServiceGET');
        callServiceGETButton.style.visibility = "hidden";
    }

    if (myURL.searchParams && myURL.searchParams.get("hidePOSTbutton")) {
        callServicePOSTButton = document.getElementById('callServicePOST');
        callServicePOSTButton.style.visibility = "hidden";
    }

    // loader commented out, we can add it in the future if that's needed
    // loader = document.getElementById("loader");
    // loader.style.visibility = "hidden";
}

function insertTextAtCursor(text)
{
    let selection = window.getSelection();
    let range = selection.getRangeAt(0);
    range.deleteContents();
    let node = document.createTextNode(text);
    range.insertNode(node);

    selection.collapseToEnd();
}


function messageBox(str) {
    document.getElementById('infobox').innerText = str;
}

async function callService(method) {
    try {
        // loader.style.visibility = "visible";
        output.innerText = ""
        const fullURL = serviceHostname + endpointName.innerText

        const response = await callVirtualEndpoint(fullURL, method)


        let renderOut = ""
        renderOut += `"StatusCode": ${response._status}\n`
        for (const key in response._headers) {
            renderOut += `"${key}": ${response._headers[key]}\n\n`
        }

        if (typeof response._data === 'string' || response._data instanceof String) {
            renderOut += `${response._data}`
        } else {
            renderOut += JSON.stringify(response._data, null, 2)
        }

        output.innerText = renderOut
    }
    catch (error) {
        console.error(error)
        messageBox(error);
    }
    finally {
        // loader.style.visibility = "hidden";
    }
}

//Load a JS file and populate the code side

async function loadTemplateCode(fname) {
    parts = fname.split("_")

    url = "examples/" + parts.join("/") + "/" + parts[parts.length - 1]

    let response = await fetch(`${url}.js`)
    if (response.status == 200) {
        code.innerText = await response.text()
    } else {
        //We dont really care if it's missing
        code.innerText = ""
    }

    response = await fetch(`${url}.json`)
    if (response.status == 200) {
        postdata.innerText = await response.text()
    } else {
        postdata.innerText = ""
    }

    response = await fetch(`${url}.url`)
    if (response.status == 200) {
        endpointName.innerText = await response.text()
    } else  {
        endpointName.innerText = ""
    }
}

function saveToClipboard()
{
    navigator.clipboard.writeText(code.innerText);
}

