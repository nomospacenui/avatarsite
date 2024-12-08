class CreateThread {
    constructor(url_vars) {
        this._url_vars = url_vars

        var internalcontent_container = document.getElementById("internal-body")
        
        var title_input = document.createElement("input")
        title_input.className = "title-input"
        title_input.placeholder = "Title of thread"
        internalcontent_container.append(title_input)

        var content_header = document.createElement("div")
        content_header.className = "content-header"
        internalcontent_container.append(content_header)

        var content_input = document.createElement("textarea")
        content_input.className = "content-input"
        content_input.placeholder = "Content of thread"
        internalcontent_container.append(content_input)
    }
}

export default CreateThread