<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import type {Translation} from "./domain/Translation.ts";

const selectedText = ref<string>("");

/* EVENT LISTENNER */

const handleMouseUp = () => {
  const text = window.getSelection()?.toString().trim();
  if (text) {
    selectedText.value = text; // Update reactive variable
    showTranslateIcon();
  }
};

/* DISPLAY */
const showTranslateIcon = () => {
  removeTranslateIcon();

  const translateIcon = document.createElement("div");
  translateIcon.id = "translate-icon";
  translateIcon.style.position = "absolute";
  translateIcon.style.borderRadius = "20px";
  translateIcon.style.backgroundColor = "black";
  translateIcon.style.padding = "0.5rem";
  translateIcon.style.zIndex = "10000";
  translateIcon.style.cursor = "pointer";
  translateIcon.style.color = "white";
  translateIcon.textContent = "Translate";

  const range = window.getSelection()?.getRangeAt(0);
  if (!range) return;

  const rect = range.getBoundingClientRect();
  translateIcon.style.left = `${rect.left + window.scrollX}px`;
  translateIcon.style.top = `${rect.bottom + window.scrollY + 5}px`;

  translateIcon.addEventListener("click", async () => {
    await translateSelectedText();
    removeTranslateIcon();
  });

  document.body.append(translateIcon);

  const handleOutsideClick = (event: MouseEvent) => {
    console.log("Outside click");
    console.log("getSelection: "+ window.getSelection()?.toString().trim());
    const translateIcon = document.getElementById('translate-icon')
    if (!window.getSelection()?.toString().trim() && translateIcon) {
      removeTranslateIcon();
      document.removeEventListener("click", handleOutsideClick); // Clean up
    }
  };

  document.addEventListener("click", handleOutsideClick);
};

const translateSelectedText = async () => {
  if(!window.getSelection()) {
    return;
  }

  //const textContainer = buildTextContainer();

  // Create the main container
  const textContainer = document.createElement("div");
  textContainer.className = "text-container";
  textContainer.style.position = "absolute";
  textContainer.style.backgroundColor = "black";
  textContainer.style.color = "white";
  textContainer.style.zIndex = "10000";
  textContainer.style.padding = "1rem";

  // Create the spans
  const firstSpan = document.createElement("span");
  firstSpan.className = "text-container--first";
  firstSpan.textContent = "auto";

  const secondSpan = document.createElement("span");
  secondSpan.className = "text-container--second";
  secondSpan.textContent = "french";

  const thirdSpan = document.createElement("span");
  thirdSpan.textContent = selectedText.value; // Before trad

  const fourthSpan = document.createElement("span");

  Object.assign(textContainer.style, {
    display: "grid",
    gridGap: "1rem",
    gridTemplateColumns: "repeat(2, 1fr)",
    gridTemplateRows: "repeat(2, 1fr)",
  });

  const range = window.getSelection()!.getRangeAt(0);
  const rect = range.getBoundingClientRect();
  textContainer.style.left = `${rect.left - window.scrollX}px`;
  textContainer.style.top = `${rect.bottom - window.scrollY}px`;

  // Append spans to the container
  textContainer.appendChild(firstSpan);
  textContainer.appendChild(secondSpan);
  textContainer.appendChild(thirdSpan);
  textContainer.appendChild(fourthSpan);

  // Fetch translated text
  try {
    const res = await fetch("http://localhost:5000/translate", {
      method: "POST",
      body: JSON.stringify({
        q: selectedText.value,
        source: "auto",
        target: "en",
      }),
      headers: { "Content-Type": "application/json" },
    });

    const translation: Translation = await res.json();
    fourthSpan.textContent = translation.translatedText; // After trad
    //textContainer.textContent = translation.translatedText;
  } catch (error) {
    textContainer.textContent = "Error translating text.";
    console.error("Translation error:", error);
  }

  document.body.append(textContainer);
};

/* CLEAN UP FUNCTION */
const removeTranslateIcon = () => {
  const existingTranslateIcon = document.getElementById("translate-icon");
  console.log(existingTranslateIcon);
  if (existingTranslateIcon) {
    //existingTranslateIcon.remove();
    existingTranslateIcon.outerHTML = "";
  }
};

const removeTextContainer = () => {
  const existingTextContainer = document.getElementById("text-container");
  if (existingTextContainer) {
    existingTextContainer.remove();
  }
};

onMounted(() => {
  document.addEventListener("mouseup", handleMouseUp);
});

onBeforeUnmount(() => {
  document.removeEventListener("mouseup", handleMouseUp);
  removeTranslateIcon();
  removeTextContainer();
});

</script>

<template>
  <h1>Bienvenue dans maxtranslator extension ! </h1>
</template>

<style scoped>

</style>
