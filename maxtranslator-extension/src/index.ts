import {Position} from "./domain/Position";
import { TranslatorService } from "./service/translatorService";

window.addEventListener("load", function(){
  const imgTag = document.getElementById('logo') as HTMLImageElement || null;
  console.log("IMAGE : "+ document.getElementById('logo'));
  if(imgTag){
    imgTag.src = chrome.runtime.getURL('assets/resource/translate-icon.png');
  }
});

document.addEventListener("click", async (event) => {
  // Outside click

  const translateIcon = document.getElementById('translate-icon')
  if (!window.getSelection()?.toString().trim() && translateIcon) {
    removeTranslateIcon();
  }

  const existingTextContainer = document.querySelector('.text-container');
  if(existingTextContainer && !existingTextContainer.contains(event.target as Node)) {
    removeTextContainer();
  }

  // Display all lang
  const selectedLang = document.getElementById("selected-lang");
  if(selectedLang && selectedLang.contains(event.target as Node)){
    console.log('Click on selected lang')
    const allLang = await TranslatorService.getAllLang();
    const ul = document.getElementById('lang-list');
    if(ul && !ul.hasChildNodes()) {
      console.log('ADD lis')
      allLang.forEach(lang => {
        const li = document.createElement('li');
        li.id = lang.name;
        li.textContent = lang.name;
        ul.appendChild(li);
      })
    }
  }
});

document.addEventListener('mouseup', () => {
  const selectedText = window.getSelection()?.toString().trim();

  if(selectedText) {
    const selectedTextPosition = getPositionNearToSelection();
    const translateIcon = getTranslateIcon(selectedTextPosition);

    translateIcon.addEventListener("click", async () => {
      const translation = await TranslatorService.translation(selectedText);

      fetch(chrome.runtime.getURL("src/component/translatorContainer.html"))
        .then((response) => response.text())
        .then((html) => {
          const container = document.createElement("div");
          container.style.position = "absolute";

          container.style.left = `${selectedTextPosition.x}px`;
          container.style.top = `${selectedTextPosition.y}px`;
          container.innerHTML = html;

          document.body.appendChild(container);

          const thirdSpan = container.querySelector(".text-container--selected-text");
          const fourthSpan = container.querySelector(".text-container--translated-text");

          if(thirdSpan && fourthSpan) {
            thirdSpan.textContent = selectedText; // Replace with actual text
            fourthSpan.textContent = translation.translatedText; // Replace with translation
          }
        });

      removeTranslateIcon();
    })
  }
})

function getTranslateIcon(position: Position) {
  removeTextContainer();
  removeTranslateIcon();

  const translateIcon = document.createElement("div");
  translateIcon.id="translate-icon";
  translateIcon.style.position = "absolute"
  translateIcon.style.border = "solid 1px"
  translateIcon.style.borderRadius = "10px"
  translateIcon.style.backgroundColor = "#FFB7B2";
  translateIcon.style.padding = "0.5rem";
  translateIcon.style.zIndex = "10000";
  translateIcon.style.cursor = "pointer";
  translateIcon.textContent = "translate";
  translateIcon.style.color = "black";

  // Get button below selected text
  translateIcon.style.left = `${position.x}px`;
  translateIcon.style.top = `${position.y}px`;

  document.body.append(translateIcon);

  return translateIcon;
}

function getPositionNearToSelection(): Position {
  const range = window.getSelection()?.getRangeAt(0);
  if(!range) {
    throw new Error('There is no selection');
  }

  const rect = range.getBoundingClientRect();

  return {x: rect.left + window.scrollX, y: rect.bottom + window.scrollY + 5}
}

function removeTextContainer() {
  const existingTextContainer = document.querySelector('.text-container');
  if(existingTextContainer) {
    existingTextContainer.outerHTML = "";
  }
}

function removeTranslateIcon() {
  const existingTranslateIcon = document.getElementById("translate-icon");

  if(existingTranslateIcon) {
    existingTranslateIcon.outerHTML = "";
  }
}