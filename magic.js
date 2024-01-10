let syntaxOKFlag, syntaxErrorMessage

async function callVirtualEndpoint(url, verb) {
    const res = new SimResponse()

    if (codeChanged) {
        document.getElementById("codehost")?.remove()

        const codehost = document.createElement("script")
        codehost.id = "codehost"
        document.body.appendChild(codehost)
        let source = code.innerText
        source = cleanCode(source)


        window.addEventListener("error", (event) => {
            console.log(event)
            syntaxOKFlag = false
            syntaxErrorMessage = `${event.message} : Line ${event.lineno} Col: ${event.colno}`
        }
        )


        syntaxOKFlag = true
        codehost.innerHTML = source

        if (!syntaxOKFlag) {
            res.status(500);

            res.send(`Server Error ocurred: ${syntaxErrorMessage}`)
            return res;
        }
    }

    const req = new SimRequest()

    req.setPath(url)
    req.method = verb
    if (verb == "POST") req.setBody(postdata.innerText)

    console.log(req.params[2]);
    if (req.params[2].trim().length == 0) {
        res.status(404);
        res.send(`Perhaps you need more in the URL as /service is not an endpoint`)
        return res;
    }

    const fName = `${verb.toLowerCase()}_${req.params[2]}`
    if (window[fName]) {
        try {

            //TODO dont call if code not modified
            if (codeChanged) {
                await window.initWebService?.(); // We are doing this each time although we wouldn't 
                codeChanged = false
            }

            await window[fName](req, res)
        } catch (e) {
            console.log(e)
            res.status(500);
            res.send(`Server Error ocurred: ${e}`)
        }
    } else {
        res.status(404);
        res.send(`Not Found handler ${fName}`)
    }
    return res;
}

function cleanCode(sourcecode) {
    sourcecode = sourcecode.replaceAll("const ", "var ")
    sourcecode = sourcecode.replaceAll("let ", "var ")
    return sourcecode
}


const system = {
    getenv: function (name) {
        let rval = localStorage.getItem(name);
        if (rval == null || rval == undefined) {
            rval = prompt(`Please enter a value for "${name}".
This is stored in the browser so 
DO NOT ENTER A REAL PASSWORD.`)
            if (rval == null) return "";
            if (rval.length < 6) throw new Error("Usernames and passwords must be at least 6 characters long in this environment.")
            localStorage.setItem(name, rval)
        }
        return rval
    }
}