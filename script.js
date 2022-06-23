chrome.runtime.onMessage.addListener(gotMessage);

function gotMessage(request, sender, sendResponse) {
    const filler = new BasicFiller();

    const fields = [...document.querySelectorAll('input:not([type=submit])')];
    fields.map(filler.fillInputs)
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
    fillSelects(select) {
        const min = 0;
        const max = select.options.length - 1;
        const optionIndex = Math.floor(Math.random() * (max - min + 1) + min);
        select.value = select.options[optionIndex].value;
    }

    fillAreas(area) {
        const minLength = Number.parseInt(area.getAttribute("minlength")) || 8;
        const maxLength = Number.parseInt(area.getAttribute("maxlength")) || 10;

        const length = Math.floor(Math.random() * (maxLength - minLength + 1) + minLength);
        let props = { lowerCase: true, upperCase: true, numbers: false, specialSymbols: false };

        area.value = generateText(length, props);
    }

    fillInputs(input) {
        const typeOfInput = input.type;
        const minLength = Number.parseInt(input.getAttribute("minlength")) || 8;
        const maxLength = Number.parseInt(input.getAttribute("maxlength")) || 10;

        const length = Math.floor(Math.random() * (maxLength - minLength + 1) + minLength);

        if (typeOfInput == "password") {
            const password = this.generateText(length);
            document.querySelectorAll('input[type=password]').forEach(el => {
                el.value = password
            })
        }
        else if (typeOfInput == "email") {
            input.value = generateRandomEmail();
        } else if (typeOfInput == "number") {
            const min = Number.parseInt(input.min) || 8;
            const max = Number.parseInt(input.max) || 10;
            const randomNumber = Math.floor(Math.random() * (max - min + 1) + min);
            input.value = randomNumber;
        } else {
            let props = { lowerCase: true, upperCase: true, numbers: false, specialSymbols: false };
            input.value = generateText(length, props);
        }
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