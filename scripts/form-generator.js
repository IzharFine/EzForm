var jsonRespone = {
    "FormFields": [
        { "Type": "Text", "Title": "שם פרטי", "No": 298, "Key": 92, "Value": null, "Required": 1, "ToolTip": null, "FormName": "BCard", "ComboValues": "", "PHName": null },
        { "Type": "Text", "Title": "שם משפחה", "No": 298, "Key": 93, "Value": null, "Required": 0, "ToolTip": null, "FormName": "BCard", "ComboValues": "", "PHName": null },
        { "Type": "Text", "Title": "ת\"ז", "No": 298, "Key": 94, "Value": null, "Required": 1, "ToolTip": null, "FormName": "BCard", "ComboValues": "", "PHName": null }, { "Type": "Text", "Title": "סלולר", "No": 298, "Key": 95, "Value": null, "Required": 0, "ToolTip": null, "FormName": "BCard", "ComboValues": "", "PHName": null }, { "Type": "Text", "Title": "מייל", "No": 298, "Key": 96, "Value": null, "Required": 0, "ToolTip": null, "FormName": "BCard", "ComboValues": "", "PHName": null }, { "Type": "Boolean", "Title": "אני מאשר...", "No": 298, "Key": 97, "Value": null, "Required": 1, "ToolTip": null, "FormName": "BCard", "ComboValues": "", "PHName": null }, { "Type": "Text", "Title": "סוג הלקוח", "No": 298, "Key": 98, "Value": null, "Required": 0, "ToolTip": null, "FormName": "BCard", "ComboValues": "", "PHName": "cu-type" }, { "Type": "Text", "Title": "תעודת זהות", "No": 298, "Key": 99, "Value": null, "Required": 0, "ToolTip": null, "FormName": "BCard", "ComboValues": "", "PHName": "cu-id" }, { "Type": "Text", "Title": "6 ספרות של אשראי", "No": 298, "Key": 100, "Value": null, "Required": 0, "ToolTip": null, "FormName": "BCard", "ComboValues": "", "PHName": "card-id" }], "message": "OK", "FormNumber": "298", "formKey": "9242E0273A1C", "apiUrl": "APIURL?api_key=11A1E3C7-C987-5B45-BD57-30daa770d4bf"
};


/* Built by Izhar Fine - 2018 */


/*  [Params]
 *      formData - The form data.
 *      e - Element that the form will be append to.
 *      options - 
 *      -   addSubmitButton - Add submit button and commit form only after click it.
 *          Take 1 parameter(Bool), defaults False.
 *      -   submitButtonCallBack - Add callback function after finish submit ajax call.
 *          Take 1 parameter(Func), defaults Null.
 *          Return 2 arguments
 *          1 - Form approved(Bool).
 *          2 - Message(String).
 *      -   hideTitle - Hide form title.
 *          Take 1 paremeter(Bool), defaults False.
 *      -   addFreeText - Add text at the top of the form(under the form title place)
 *          Take 1 parameter(String), defaults Null.
*/

/* [Extras]
 * getFieldByPHName - way to get field obj by his PHName.
*/


function generateForm(formData, e, options) {
    if (formData.message.toLowerCase() == "ok") {
        var form = new Form(formData);
        if (options != undefined)
            form.setOptions(options);
        var domObj = form.generateForm();
        e.appendChild(domObj);
        form.domObj = domObj;
        return form;
    }
    else {
        Form.prototype.showMsgBox(formData.message, "fg-error");
    }
};


function Form(formData) {
    this.data = formData;
    this.key = formData.formKey || 0;
    this.fields = [];
    this.options = {
        addSubmitButton: false,
        submitButtonCallBack: null,
        hideTitle: false,
        addFreeText: null
    };
    this.apiKey = formData.ServiceAPIKey;
    this.domObj = null;
};

Form.prototype.setOptions = function (options) {
    this.options.addSubmitButton = (options.addSubmitButton == undefined ? this.options.addSubmitButton : options.addSubmitButton);
    this.options.submitButtonCallBack = (options.submitButtonCallBack == undefined ? this.options.submitButtonCallBack : options.submitButtonCallBack);
    this.options.hideTitle = (options.hideTitle == undefined ? this.options.hideTitle : options.hideTitle);
    this.options.addFreeText = (options.addFreeText == undefined ? this.options.addFreeText : options.addFreeText);
};

Form.prototype.generateForm = function () {
    var data = this.data;
    var form = document.createElement("div");
    form.className = "form-generator fg-text-right";
    if (!this.options.hideTitle) {
        var formTitle = document.createElement("h1");
        formTitle.innerText = data.FormFields[0].FormName;
        form.appendChild(formTitle);
    }
    if (this.options.addFreeText != null) {
        var formFreeText = document.createElement("p");
        formFreeText.innerText = this.options.addFreeText;
        formFreeText.className = "fg-fix-padding";
        form.appendChild(formFreeText);
    }
    this.generateFields(data, form);
    if (this.options.addSubmitButton)
        this.addSubmitButton(form);
    return form;
};

Form.prototype.generateFields = function (data, form) {
    for (var i = 0; i < data.FormFields.length; i++) {
        var field = new Field(this, Number(data.FormFields[i].Key || 0), data.FormFields[i].Value, data.FormFields[i].Type, data.FormFields[i].Required, data.FormFields[i].Title, data.FormFields[i].ToolTip, data.FormFields[i].ComboValues, data.FormFields[i].PHName);
        var row = field.generateRow(this);
        form.appendChild(row);
        this.fields.push(field);
    }
    return form;
};

Form.prototype.addSubmitButton = function (form) {
    var self = this;
    var row = document.createElement("div");
    row.classList = "fg-row fg-content-end fg-fix-end";
    var submitButton = document.createElement("input");
    submitButton.className = "fg-btn";
    submitButton.type = "button";
    submitButton.value = "שלח טופס";
    submitButton.addEventListener("click", function () {
        self.submitForm();
    });
    row.appendChild(submitButton);
    form.appendChild(row);
};

Form.prototype.submitForm = function () {
    var that = this;
    var output = "";
    this.fields.forEach(function (field) {
        if (field.required && ((field.value == "" || field.value == null) || (field.type == "boolean" && field.value == "0"))) {
            output += field.title + ", ";
            field.domObj.getElementsByTagName("input")[0].classList.value = field.domObj.getElementsByTagName("input")[0].classList.value + " fg-must-fill";
        }
    });
    if (output != "") {
        var message = "חובה למלא את השדות הבאים: " + output;
        if (this.options.submitButtonCallBack != null) {
            this.options.submitButtonCallBack.call(this, false, message);
        }
        else {
            this.showMsgBox(message, "fg-error");
        }
    }
    else {
        var xhr = new XMLHttpRequest();
        var url = "APIURL" + this.apiKey;
        var xmlFields = this.convertFieldsToXml();
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                var respones = JSON.parse(xhr.responseText);
                if (that.options.submitButtonCallBack != null) {
                    that.options.submitButtonCallBack.call(that, respones.message.toLowerCase() == "ok", respones.message);
                }
                else {
                    if (respones.message.toLowerCase() == "ok") {
                        that.showMsgBox("טופס נשלח בהצלחה.", "fg-success");
                    }
                    else {
                        that.showMsgBox(respones.message, "fg-error");
                    }
                }
            }
        };
        var data = JSON.stringify({ "data": { "Key": this.key, "FieldsAndValue": xmlFields } });
        xhr.send(data);
    }
};

Form.prototype.getFieldByPHName = function (phname) {
    var obj;
    this.fields.forEach(function (field) {
        if (field.phname == phname)
            obj = field;
    });
    return obj;
};

Form.prototype.convertFieldsToXml = function () {
    var xml = "{R}";
    this.fields.forEach(function (ele) {
        xml += "{N}";
        xml += "{f}" + ele.key + "{/f}";
        xml += "{v}" + (ele.value == null ? "" : ele.value) + "{/v}";
        xml += "{/N}";
    });
    xml += "{/R}";
    return xml;
};

Form.prototype.showMsgBox = function (msg, type, timeout) {
    if (document.querySelector(".fg-container"))
         document.querySelector(".fg-container").remove();
    try {
        (timeout = (isNaN(timeout) || timeout == undefined) ? 3500 : timeout);
        timeout = parseInt(timeout);
    }
    catch (err) {
        console.log("Invalid timeout");
        timeout = 3500;
    }
    var container = document.createElement("div");
    container.className = "fg-container fg-show";
    if (this.domObj)
         container.style.top = this.domObj.offsetTop*1 + 20 + "px";
    var div = document.createElement("div");
    div.classList = "fg-msg-box " + (type == undefined || type == null ? "" : type);
    container.appendChild(div);
    div.innerText = msg;
    document.querySelector("body").appendChild(container);
    setTimeout(function () {
        container.classList.remove("fg-show");
        setTimeout(function () {
            container.remove();
        }, 500);
    }, timeout);
};


function Field(form, key, value, type, required, title, tooltip, comboValues, phname) {
    this.parent = form;
    this.key = key;
    this.value = value;
    this.type = type;
    this.required = required == 1;
    this.title = title;
    this.toolTip = (tooltip == null ? "" : tooltip);
    this.comboValues = comboValues;
    this.phname = (phname == null ? "" : phname);
    this.domObj = null;
};

Field.prototype.generateRow = function () {
    var self = this;
    //var form = form;
    var row = document.createElement("div");
    if (this.required)
        row.classList = "fg-row fg-required";
    else
        row.className = "fg-row";
    row.setAttribute("data-name", this.phname);
    var label = document.createElement("label");
    label.innerText = this.title;
    var field = this.defineFields();
    field.className = "fg-form-control";
    field.addEventListener('change', function () {
        //var value = this.value;
        self.updateField(this);
    });
    var col = document.createElement("div");
    col.classList = "fg-col-12 fg-sm-col-2";
    col.appendChild(label);
    row.appendChild(col);
    var col = document.createElement("div");
    col.className = "fg-col-12 fg-sm-col-10";
    col.appendChild(field);
    row.appendChild(col);
    this.domObj = row;
    return row;
};

Field.prototype.defineFields = function () {
    var field;
    this.type = this.type.toLowerCase();
    switch (this.type) {
        case "text":
        case "number":
        case "date": field = document.createElement("input");
            field.type = this.type;
            if (this.type == "date" && this.value) {
                var fixDate = new Date(this.value);
                this.value = fixDate.toISOString().split('T')[0];
            }
            field.value = this.value;
            field.title = this.toolTip;
            break;
        case "boolean": field = document.createElement("input");
            field.type = "checkbox";
            field.checked = this.value == "1";
            field.title = this.toolTip;
            break;
        case "combo": field = document.createElement("select");
            field.title = this.toolTip;
            var options = JSON.parse(this.comboValues);
            for (var z = 0; z < options.length; z++) {
                var option = document.createElement("option");
                option.value = options[z].v;
                option.innerText = options[z].n;
                if (this.value == options[z].v)
                    option.selected = true;
                field.appendChild(option);
            }
            if (this.value == "" || this.value == null)
                field.selectedIndex = -1;
            break;
        default:
            break;
    }
    return field;
};


Field.prototype.updateField = function (ele) {
    var value = ele.value;
    var formKey = this.parent.key;
    var key = this.key;
    var type = this.type;

    if (this.type == "boolean")
        value = ele.checked ? "1" : "0";
    if (this.required && value == "") {
        ele.value = this.value;
        this.parent.showMsgBox("שדה חובה לא יכול להיות ריק.", "fg-error");
    }
    else
        this.value = value;
    if (ele.classList.contains("fg-must-fill") && this.value != "") {
        ele.classList.remove("fg-must-fill");
    }
    if (!this.parent.options.addSubmitButton) {
        var xhr = new XMLHttpRequest();
        var url = "APIURL" + this.parent.apiKey;
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {

            }
        };
        var data = JSON.stringify({ "data": { "Key": formKey, "Field": key, "Value": value } });
        xhr.send(data);
    }
};