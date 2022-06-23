chrome.runtime.onMessage.addListener(gotMessage);

function gotMessage(request, sender, sendResponse) {
    const filler = new BasicFiller();

    const fields = [...document.querySelectorAll('input:not([type=submit]):not([type=radio])')];
    fields.map(filler.fillInputs)
    const radio = [...document.querySelectorAll('input[type=radio]')];
    filler.chooseRadio(radio);
    const areas = [...document.querySelectorAll('textarea')];
    areas.map(filler.fillAreas);
    const selects = [...document.querySelectorAll('select')];
    selects.map(filler.fillSelects);

    const reactFiller = new ReactFiller();
    reactFiller.dispatch(fields);
    reactFiller.dispatch(areas);
    reactFiller.dispatch(selects);
}

class ReactFiller {
    dispatch(elements) {
        const event = new Event('input', { bubbles: true });
        elements.forEach(element => {
            element.dispatchEvent(event);
        })
    }
}

class BasicFiller {
    chooseRadio(radios) {
        let unique = [];
        radios.forEach(element => {
            if (!unique.includes(element.getAttribute("name"))) {
                unique.push(element.getAttribute("name"))
            }
        });
        
        unique.forEach(element => {
            let current = radios.filter(x => x.getAttribute("name") == element);
            let randomIndex = getRandomInt(0, current.length);
            current[randomIndex].checked = true;
        });
    }

    fillSelects(select) {
        const min = 0;
        const max = select.options.length - 1;
        const optionIndex = getRandomInt(min, max);
        select.value = select.options[optionIndex].value;
    }

    fillAreas(area) {
        const minLength = Number.parseInt(area.getAttribute("minlength")) || 8;
        const maxLength = Number.parseInt(area.getAttribute("maxlength")) || 10;

        const length = getRandomInt(minLength, maxLength);

        area.value = generateText(length, { numbers: false, specialSymbols: false });
    }

    fillInputs(input) {
        const typeOfInput = input.type;
        const minLength = Number.parseInt(input.getAttribute("minlength")) || 8;
        const maxLength = Number.parseInt(input.getAttribute("maxlength")) || 10;

        const length = getRandomInt(minLength, maxLength);

        switch (typeOfInput) {
            case "password":
                const password = generateText(length, { lowerCase: true, upperCase: true, numbers: true, specialSymbols: true });
                document.querySelectorAll('input[type=password]').forEach(el => {
                    el.value = password
                })
                break;
            case "email":
                input.value = generateRandomEmail();
                break;
            case "number":
            case "tel":
                const min = Number.parseInt(input.min) || 8;
                const max = Number.parseInt(input.max) || 10;
                const randomNumber = getRandomInt(min, max);
                input.value = randomNumber;
                break;
            case "checkbox":
                input.checked = true;
                break;
            case "date":
                const date = new Date().toISOString().substring(0, 10);
                input.value = date;
                break;
            case "datetime-local":
                let now = new Date();
                now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
                input.value = now.toISOString().slice(0, 16);
                break;
            case "range":
                const minRange = Number.parseInt(input.min) || 0;
                const maxRange = Number.parseInt(input.min) || 1;
                const rangeValue = getRandomInt(minRange, maxRange);
                input.value = rangeValue;
                break;
            case "time":
                let timeNow = new Date();
                input.value = ("0" + timeNow.getHours()).slice(-2) + ":" + ("0" + timeNow.getMinutes()).slice(-2);
                break;
            case "color":
                input.value = generateRandomColor();
                break;
            case "week":
            case "image":
            case "file":
            case "month":
            case "url":
                // Not implemented
                break;
            case "text":
            case "search":
                input.value = generateText(length, { numbers: false, specialSymbols: false });
                break;
        }
    }
}

function generateText(length, { lowerCase = true, upperCase = true, numbers = true, specialSymbols = true }) {
    let charset = "";
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

function generateRandomEmail() {
    const chars = 'abcdefghijklmnopqrstuvwxyz1234567890';
    const alphabet = 'abcdefghijklmnopqrstuvwxyz';

    let string = '';
    for (var ii = 0; ii < 15; ii++) {
        string += chars[Math.floor(Math.random() * chars.length)];
    }

    let smtp = '';
    for (var ii = 0; ii < 4; ii++) {
        smtp += alphabet[Math.floor(Math.random() * alphabet.length)];
    }

    return `${string}@${smtp}.com`
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max + 1);
    return Math.floor(Math.random() * (max - min) + min);
    //The maximum is inclusive and the minimum is inclusive
}

function generateRandomColor() {
    return '#' + (Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0');
}