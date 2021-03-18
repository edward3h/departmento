var existingContainer = document.querySelector('.title__bookmarklet');

if (existingContainer) { 
  existingContainer.remove();
}

var titleContainer = document.createElement('div');

titleContainer.className = 'title__bookmarklet';
titleContainer.style.textAlign = 'center';
titleContainer.style.fontSize = '16px';
titleContainer.style.fontFamily = 'Arial';
titleContainer.style.padding = '20px';
titleContainer.style.backgroundColor = 'lightyellow';
titleContainer.style.position = 'absolute';
titleContainer.style.left = 0;
titleContainer.style.top = 0;
titleContainer.style.width = '100vw';
titleContainer.style.zIndex = '99999';

titleContainer.textContent = document.title;

document.body.appendChild(titleContainer);