chrome.runtime.onMessage.addListener(gotMessage);

function gotMessage(request, sender, sendResponse) {
    const fields = [...document.querySelectorAll('input:not([type=submit])')];
    fields.map(fillInputs)
    const areas = [...document.querySelectorAll('textarea')];
    areas.map(fillAreas);
    const selects = [...document.querySelectorAll('select')];
    selects.map(fillSelects);
}

function fillSelects(select) {
    const min = 0;
    const max = select.options.length - 1;
    const optionIndex = Math.floor(Math.random() * (max - min + 1) + min);
    select.value = select.options[optionIndex].value;
}

function fillAreas(area) {
    const minLength = Number.parseInt(area.getAttribute("minlength")) || 8;
    const maxLength = Number.parseInt(area.getAttribute("maxlength")) || 10;

    const length = Math.floor(Math.random() * (maxLength - minLength + 1) + minLength);
    let props = { lowerCase: true, upperCase: true, numbers: false, specialSymbols: false };

    area.value = generateText(length, props);
}

function fillInputs(input) {
    const typeOfInput = input.type;
    const minLength = Number.parseInt(input.getAttribute("minlength")) || 8;
    const maxLength = Number.parseInt(input.getAttribute("maxlength")) || 10;

    const length = Math.floor(Math.random() * (maxLength - minLength + 1) + minLength);

    if (typeOfInput == "text") {
        let props = { lowerCase: true, upperCase: true, numbers: false, specialSymbols: false };
        input.value = generateText(length, props);
    }
    else if (typeOfInput == "password") {
        const password = generateText(length);
        document.querySelectorAll('input[type=password]').forEach(el => {
            el.value = password
        })
    }
    else if (typeOfInput == "email") {
        input.value = "random@email.com";
    } else if (typeOfInput == "number") {
        const min = Number.parseInt(input.min) || 8;
        const max = Number.parseInt(input.max) || 10;
        const randomNumber = Math.floor(Math.random() * (max - min + 1) + min);
        input.value = randomNumber;
    }
}

function generateText(length, props = { lowerCase: true, upperCase: true, numbers: true, specialSymbols: true }) {
    let charset = "";
    const { lowerCase, upperCase, numbers, specialSymbols } = props;
    if (lowerCase) {
        charset += "abcdefghijklmnopqrstuvwxyz";
    }
    if (upperCase) {
        charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    }
    if (numbers) {
        charset += "0123456789";
    }
    if (specialSymbols) {
        charset += "!@#$%^&*()";
    }

    let retVal = "";

    for (let i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
}