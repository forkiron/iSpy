console.log('Piece of Honey content script loaded!');

function createWaveTabAndPopup() {
  // Create the small wave tab on the left side
  const waveTab = document.createElement('div');
  waveTab.id = 'waveTab';

  // Basic inline styles only for waveTab so it doesn't inherit your popup styles
  Object.assign(waveTab.style, {
    position: 'fixed',
    top: '40%',
    left: '0',
    width: '50px',
    height: '120px',
    cursor: 'pointer',
    zIndex: 2147483647,
    background: 'transparent',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  });

  waveTab.innerHTML = `
    <img src="${chrome.runtime.getURL('assets/wave.png')}" alt="Wave Tab" style="margin-top: 250px; margin-left: 30px" />
  `;

  document.body.appendChild(waveTab);

  // Create the big popup (your original popup) but hidden initially
  const popup = document.createElement('div');
  popup.id = 'poppy'; 
  popup.className = 'custom-popup';
  popup.style.backgroundImage = `url(${chrome.runtime.getURL("assets/shade.png")})`;
  popup.style.display = 'none';  // hide initially

  popup.innerHTML = `
    <div class="container">
      <div class="card">
        <div class="card-content">
          <h1>ISpy...</h1>
          <p>with my little AI</p>
          <p class="txth">Hover over an image and click "s" to begin</p>
        </div>
      </div>
      <img class="opening" src="${chrome.runtime.getURL('assets/opening.gif')}" alt="Logo" style="width:100%;height:100%; margin-left: 10%;" />
    </div>
  `;

  document.body.appendChild(popup);

  // Show popup when hovering over wave tab
  waveTab.addEventListener('mouseenter', () => {
    popup.style.display = 'flex';  // show with flex to keep CSS layout
  });

  // Hide popup when mouse leaves popup area
  popup.addEventListener('mouseleave', () => {
    popup.style.display = 'none';
  });

  // Also hide popup if leaving wave tab without entering popup
  waveTab.addEventListener('mouseleave', (e) => {
    const toElement = e.relatedTarget || e.toElement;
    if (!popup.contains(toElement)) {
      popup.style.display = 'none';
    }
  });
}

// Run after 3 seconds to load wave tab and popup
setTimeout(() => {
  createWaveTabAndPopup();
}, 3000);
