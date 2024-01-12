class SimRequest
{
    constructor() {
        this._method = "GET"
        this.query = {}
        this.params = []
        this.path = ""
        this.protocol="https"
        this.body = undefined;
      
    }

    setPath(url) {
 
        const URLObj = new URL(url)
        this.protocol = URLObj.protocol
        this.query = URLObj.searchParams;
        this.path = URLObj.pathname;
        this.params = this.path.split("/")
        return this
    }

    setBody(body) {
        this.body = body;
        return this
    }

}


// Based on Express Response


class SimResponse {
    constructor() {
        this._status = 200
        this._data = null
        this._headers = { 'Content-Type' : 'application/json'}
    }

    status(val) {
        this._status = val;
        return this
    }

    end(val) {
        this.send(val)
    }

    json(val) {
        return this.send(JSON.stringify(val))
    }

    text(val) {
        return this.send(vak)
    }

    sendStatus(data) {
        return this.send(data)
    }

    send(data) {
        if( data instanceof Promise) {
            this._status = 500
            this._data = "Server Error - you are passing an unresolved Promise to send(), did you forget await?"
            return this
        }
        this._data = data
        return this
    }

    set(field,value) {
        return this.header(field,value)
    }

    header(field,value) {
        this._headers[field] = value
        return this
    }
}