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

        buttons_menu.append(this.create_modifier_button(input_box, "<b>B</b>", "<b>", "</b>"))
        buttons_menu.append(this.create_modifier_button(input_box, "<i>I</i>", "<i>", "</i>"))
        buttons_menu.append(this.create_modifier_button(input_box, "<u>U</u>", "<u>", "</u>"))
        buttons_menu.append(this.create_modifier_button(input_box, "<s>S</s>", "<s>", "</s>"))

        buttons_menu.append(this.create_modifier_button(input_box, "Le", "<p style='text-align: left'>", "</p>"))
        buttons_menu.append(this.create_modifier_button(input_box, "Ce", "<p style='text-align: center'>", "</p>"))
        buttons_menu.append(this.create_modifier_button(input_box, "Ri", "<p style='text-align: right'>", "</p>"))
        
        var font_size_contents = [10, 12, 14, 16, 20, 22, 24]
        buttons_menu.append(this.create_dropdown_modifier_button(input_box, "font size", font_size_contents, "font-size: "))
        
        var font_style_contents = ["Arial", "Verdana", "Tahoma", "Times New Roman", "Georgia", "Courier New"]
        buttons_menu.append(this.create_dropdown_modifier_button(input_box, "font style", font_style_contents, "font-family: ", true))

        return buttons_menu
    }

    create_modifier_button(input_box, display, modifier_start, modifier_end) {
        var button = document.createElement("button")
        button.className = "text-buttons"
        button.innerHTML = display
        button.onclick = function() { modifier_button_click(input_box, modifier_start, modifier_end) }
        return button
    }

    create_dropdown_modifier_button(input_box, display, contents, modifier, apply_style_to_content = false) {
        var button = document.createElement("button")
        button.className = "text-buttons-dropdown"
        button.innerHTML = display
        
        var dropdown_content = document.createElement("div")
        dropdown_content.className = "text-buttons-content"
        
        button.onclick = function() { 
            dropdown_content.style.visibility = (dropdown_content.style.visibility == "visible") ? "hidden" : "visible"
        }
        
        contents.forEach(x => {
            var content = document.createElement("div")
            if (apply_style_to_content) 
                content.innerHTML = "<font style='" + modifier + x + "'>" + x + "</font>"
            else
                content.innerHTML = x
            content.className = "text-buttons-content-entry"
            content.onclick = function() { modifier_button_click(input_box, "<font style='" + modifier + x + "'>", "</font>") }
            dropdown_content.append(content)
        });

        button.append(dropdown_content)
        return button
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