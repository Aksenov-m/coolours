const cols = document.querySelectorAll(".col");
const col = document.querySelector(".col");
const body = document.querySelector("body");

// for (const task of cols) {
//   task.draggable = true;
// }

document.addEventListener("mousedown", (event) => {
  const type = event.target.dataset.type;
  if (type === "moved") {
    const col = event.target.tagName.toLowerCase() === "i" ? event.target.parentNode.parentElement : event.target.parentElement;
    col.draggable = true;
    // event.preventDefault();
  }
  return
});

body.addEventListener("dragstart", (event) => {
  event.target.classList.add("selected");
});

body.addEventListener("dragend", (event) => {
  event.target.classList.remove("selected");
  event.target.draggable = false;
});

body.addEventListener("drop", (event) => {
  event.preventDefault();
  const cols = document.querySelectorAll(".col");
  const colors = [];
  cols.forEach((col) => {
    const text = col.querySelector("h2");
    colors.push(text.textContent.slice(0));
  });
  updateColorsHash(colors);
});

body.addEventListener("dragover", (event) => {
  // Разрешаем сбрасывать элементы в эту область
  event.preventDefault();

  // Находим перемещаемый элемент
  const activeElement = body.querySelector(".selected");
  // Находим элемент, над которым в данный момент находится курсор
  const currentElement = event.target.tagName.toLowerCase() === "i" ? event.target.parentNode.parentElement : event.target.parentElement;
  // Проверяем, что событие сработало:
  // 1. не на том элементе, который мы перемещаем,
  // 2. именно на элементе списка
  const isMoveable = activeElement !== currentElement && currentElement.classList.contains("col");

  // Если нет, прерываем выполнение функции
  if (!isMoveable) {
    return;
  }

  // Находим элемент, перед которым будем вставлять
  const nextElement = currentElement === activeElement.nextElementSibling ? currentElement.nextElementSibling : currentElement;
  // Вставляем activeElement перед nextElement
  body.insertBefore(activeElement, nextElement);
  
});

// const getNextElement = (cursorPosition, currentElement) => {
//   // Получаем объект с размерами и координатами
//   const currentElementCoord = currentElement.getBoundingClientRect();
//   // Находим вертикальную координату центра текущего элемента
//   const currentElementCenter = currentElementCoord.y + currentElementCoord.height / 2;

//   // Если курсор выше центра элемента, возвращаем текущий элемент
//   // В ином случае — следующий DOM-элемент
//   const nextElement = (cursorPosition < currentElementCenter) ?
//       currentElement :
//       currentElement.nextElementSibling;

//   return nextElement;
// };

// body.addEventListener("dragover", (event) => {
//   // Разрешаем сбрасывать элементы в эту область
//   event.preventDefault();

//   // Находим перемещаемый элемент
//   const activeElement = body.querySelector(".selected");
//   // Находим элемент, над которым в данный момент находится курсор
//   const currentElement = event.target.tagName.toLowerCase() === "i" ? event.target.parentNode.parentElement : event.target.parentElement;
//   // Проверяем, что событие сработало:
//   // 1. не на том элементе, который мы перемещаем,
//   // 2. именно на элементе списка
//   const isMoveable = activeElement !== currentElement &&
//     currentElement.classList.contains("col");

//   // Если нет, прерываем выполнение функции
//   if (!isMoveable) {
//     return;
//   }

//   /// evt.clientY — вертикальная координата курсора в момент,
//   // когда сработало событие
//   const nextElement = getNextElement(event.clientY, currentElement);

//   // Проверяем, нужно ли менять элементы местами
//   if (
//     nextElement &&
//     activeElement === nextElement.previousElementSibling ||
//     activeElement === nextElement
//   ) {
//     // Если нет, выходим из функции, чтобы избежать лишних изменений в DOM
//     return;
//   }

//   body.insertBefore(activeElement, nextElement);
// });

document.addEventListener("keydown", (event) => {
  event.preventDefault();
  if (event.code.toLowerCase() === "space") {
    setRandomColors();
  }
});

document.addEventListener("click", (event) => {
  const type = event.target.dataset.type;
  if (type === "lock") {
    const node = event.target.tagName.toLowerCase() === "i" ? event.target : event.target.children[0];
    node.classList.toggle("fa-lock-open");
    node.classList.toggle("fa-lock");
  } else if (type === "copy") {
    copyToClickboard(event.target.textContent);
  }
});

function genereteRandomColor() {
  const hexCodes = "0123456789ABCDEF";
  let color = "";
  for (let i = 0; i < 6; i++) {
    color += hexCodes[Math.floor(Math.random() * hexCodes.length)];
  }
  return "#" + color;
}

function copyToClickboard(text) {
  return navigator.clipboard.writeText(text);
}

function setRandomColors(isInitial) {
  const colors = isInitial ? getColorsFromHash() : [];

  cols.forEach((col, index) => {
    const isLocted = col.querySelector("#lock").classList.contains("fa-lock");
    const text = col.querySelector("h2");
    const button = col.querySelector("#button");
    if (isLocted) {
      colors.push(text.textContent);
      return;
    }

    const color = isInitial ? (colors[index] ? colors[index] : chroma.random()) : chroma.random();

    if (!isInitial) {
      colors.push(color);
    }

    text.textContent = color;

    col.style.background = color;

    setTextColor(text, color);
    setTextColor(button, color);
  });

  updateColorsHash(colors);
}

function setTextColor(tex, color) {
  const luminance = chroma(color).luminance();
  tex.style.color = luminance > 0.5 ? "black" : "white";
}

function updateColorsHash(colors = []) {
  document.location.hash = colors
    .map((col) => {
      return col.toString().substring(1);
    })
    .join("-");
}

function getColorsFromHash() {
  if (document.location.hash.length > 1) {
    return document.location.hash
      .substring(1)
      .split("-")
      .map((color) => "#" + color);
  }
  return [];
}

setRandomColors(true);

