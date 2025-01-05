document.addEventListener('mouseup', () => {
    const selectedText = window.getSelection().toString().trim();

    if(selectedText) {
        //console.log("Highlighted text:", selectedText);
        const translateIcon = getTranslateIcon();

        translateIcon.addEventListener("click", async () => {
            const textContainer = document.createElement("div");
            textContainer.id = "text-container";
            textContainer.style.position = "absolute";
            textContainer.style.backgroundColor = "black";
            textContainer.style.color = "white";
            textContainer.style.zIndex = "10000";
            textContainer.style.padding = "1rem";

            const range = window.getSelection().getRangeAt(0);
            const rect = range.getBoundingClientRect();
            textContainer.style.left = `${rect.left - window.scrollX}px`;
            textContainer.style.top = `${rect.bottom - window.scrollY}px`;

            const res = await fetch("http://localhost:5000/translate", {
                method: "POST",
                body: JSON.stringify({
                    q: selectedText,
                    source: "auto",
                    target: "en",
                }),
                headers: { "Content-Type": "application/json" },
            });

            textContainer.textContent = (await res.json()).translatedText;

            document.body.append(textContainer);
            removeTranslateIcon();
        })

        //chrome.runtime.sendMessage({ text: selectedText });
    }
})

function getTranslateIcon() {
    removeTextContainer();
    removeTranslateIcon();

    const translateIcon = document.createElement("div");
    translateIcon.id="translate-icon";
    translateIcon.style.position = "absolute"
    translateIcon.style.borderRadius = "20px"
    translateIcon.style.backgroundColor = "black";
    translateIcon.style.padding = "0.5rem";
    translateIcon.style.zIndex = "10000";
    translateIcon.style.cursor = "pointer";
    translateIcon.textContent = "translate";
    translateIcon.style.color = "white";

    // Get button below selected text
    const range = window.getSelection().getRangeAt(0);
    const rect = range.getBoundingClientRect();
    translateIcon.style.left = `${rect.left + window.scrollX}px`;
    translateIcon.style.top = `${rect.bottom + window.scrollY + 5}px`;

    document.body.append(translateIcon);

    return translateIcon;
}

function removeTextContainer() {
    const existingTextContainer = document.getElementById("text-container");

    if(existingTextContainer) {
        existingTextContainer.remove();
    }
}

function removeTranslateIcon() {
    const existingTranslateIcon = document.getElementById("translate-icon");

    if(existingTranslateIcon) {
        existingTranslateIcon.remove();
    }
}