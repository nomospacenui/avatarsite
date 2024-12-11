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

        var content_body = document.createElement("div")
        content_body.className = "content-body"

        var content_input = document.createElement("textarea")
        content_input.className = "content-input"
        content_input.placeholder = "Content of thread"

        content_body.append(this.create_buttons(content_input))
        content_body.append(content_input)
        
        internalcontent_container.append(content_body)
    }

    create_buttons(input_box) {
        var buttons_menu = document.createElement("toolbar")

        var bold_button = document.createElement("button")
        bold_button.className = "text-buttons"
        bold_button.innerHTML = "<b>B</b>"
        bold_button.onclick = function() { modifier_button_click(input_box, "<b>", "</b>") }
        buttons_menu.append(bold_button)

        var italics_button = document.createElement("button")
        italics_button.className = "text-buttons"
        italics_button.innerHTML = "<i>I</i>"
        italics_button.onclick = function() { modifier_button_click(input_box, "<i>", "</i>") }
        buttons_menu.append(italics_button)

        var underline_button = document.createElement("button")
        underline_button.className = "text-buttons"
        underline_button.innerHTML = "<u>U</u>"
        underline_button.onclick = function() { modifier_button_click(input_box, "<u>", "</u>") }
        buttons_menu.append(underline_button)
        
        var left_align_button = document.createElement("button")
        left_align_button.className = "text-buttons"
        left_align_button.innerHTML = "L"
        left_align_button.onclick = function() { modifier_button_click(input_box, "<p style='text-align: left'>", "</p>") }
        buttons_menu.append(left_align_button)
        
        var center_align_button = document.createElement("button")
        center_align_button.className = "text-buttons"
        center_align_button.innerHTML = "C"
        center_align_button.onclick = function() { modifier_button_click(input_box, "<p style='text-align: center'>", "</p>") }
        buttons_menu.append(center_align_button)
        
        var right_align_button = document.createElement("button")
        right_align_button.className = "text-buttons"
        right_align_button.innerHTML = "R"
        right_align_button.onclick = function() { modifier_button_click(input_box, "<p style='text-align: right'>", "</p>") }
        buttons_menu.append(right_align_button)
        
        var font_size_dropdown = document.createElement("button")
        font_size_dropdown.className = "text-buttons-dropdown"
        font_size_dropdown.innerHTML = "font size"
        
        var font_size_dropdown_content = document.createElement("div")
        font_size_dropdown_content.className = "text-buttons-content"
        font_size_dropdown.onclick = function() { 
            font_size_dropdown_content.style.visibility = (font_size_dropdown_content.style.visibility == "visible") ?
                "hidden" :
                "visible"
        }
        
        for (var i = 10 ; i <= 24 ; i += 2) {
            var font_size = document.createElement("p")
            font_size.innerHTML = i
            font_size.className = "text-buttons-content-entry"
            const c_i = i
            font_size.onclick = function() { modifier_button_click(input_box, "<p style='font-size:" + c_i + "'>", "</p>") }
            font_size_dropdown_content.append(font_size)
        }

        font_size_dropdown.append(font_size_dropdown_content)
        buttons_menu.append(font_size_dropdown)

        return buttons_menu
    }
}

function modifier_button_click(input_box, modifier_start, modifier_end) {
    const bef_str = input_box.value.substring(0, input_box.selectionStart)
    const mid_str = input_box.value.substring(input_box.selectionStart, input_box.selectionEnd)
    const aft_str = input_box.value.substring(input_box.selectionEnd, input_box.value.length)
    input_box.value = bef_str + modifier_start + mid_str + modifier_end + aft_str;
    
    input_box.focus()
    var end_insert_pos = (bef_str + modifier_start + mid_str + modifier_end).length
    input_box.selectionEnd = end_insert_pos
}

export default CreateThread