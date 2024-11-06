class Thread {
    constructor() {
        var page_title = document.getElementById("page_title")
        page_title.innerHTML = "Title"
        var content_container = document.getElementById("content")
        
        var thread_header = document.createElement("div")
        thread_header.className = "threadheader"
        
        var thread_title = document.createElement("div")
        thread_title.className = "threadtitle"
        thread_title.innerHTML = "Thread Title"

        thread_header.appendChild(thread_title)
        
        var report_thread_button = document.createElement("button")
        report_thread_button.className = "button-accent"
        report_thread_button.innerHTML = "Report Thread"
        
        thread_header.appendChild(report_thread_button)
        
        content_container.appendChild(thread_header)
    }
}

new Thread()