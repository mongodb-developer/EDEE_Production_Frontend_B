
let code, response, endpointName, databox, infobox
const serviceHostname = "https://hostname:5500/service/"
async function onLoad() {
    code = document.getElementById('codediv')
    output = document.getElementById('response')
    postdata = document.getElementById('postdata')
    endpointName = document.getElementById('endpoint')
    document.getElementById('url').innerText = serviceHostname;
    const myURL = new URL(window.location)
    console.log(myURL)
    if (myURL.searchParams && myURL.searchParams.get("src")) {
        await loadTemplateCode(myURL.searchParams.get("src"))
    }

    // messageBox("Hi - I'm for debugging and things");

}



function messageBox(str) {
    document.getElementById('infobox').innerText = str;
}

async function callService(method) {
    try {
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
}

//Load a JS file and populate the code side

async function loadTemplateCode(fname) {
    parts = fname.split("_")

    url = "examples/" + parts.join("/") + "/" + parts[parts.length - 1]
    console.log(url)


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