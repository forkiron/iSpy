  let hoveredImage = null;
  let isCooldown = false;


  function closeContent() {
    console.log("closedcontent");
    const removeup = document.getElementById('poppy');
    if (removeup) {
      removeup.remove();
    }
  }

  function secondPopup() {
    console.log("open second popup");

    // Check if the popup already exists and remove it
    const existing = document.getElementById('secondpoppy');
    if (existing) {
      existing.remove();
    }

    const secondpop = document.createElement('div');
    secondpop.id = "secondpoppy";
    secondpop.className = "secondpopped";

    secondpop.innerHTML = `
      <div class="container">
        <img class="opening" src="${chrome.runtime.getURL('assets/loading.gif')}" alt="Logo" style="width:90%;height:90%; margin-left: 15%;" />
      </div>
    `;

    document.body.appendChild(secondpop);

  }

  function thirdPopup(aiPercentage) {
    console.log("open third popup");

    // Remove existing third popup if it exists
    const existingThird = document.getElementById('thirdpoppy');
    if (existingThird) {
      existingThird.remove();
    }

    // Remove second popup when third popup shows
    const existingSecond = document.getElementById('secondpoppy');
    if (existingSecond) {
      existingSecond.remove();
    }

    const resultImage = aiPercentage > 50
      ? chrome.runtime.getURL('assets/no.gif')
      : chrome.runtime.getURL('assets/yes.gif');

    const thirdpop = document.createElement('div');
    thirdpop.id = "thirdpoppy";
    thirdpop.className = "thirdpopped";

    thirdpop.innerHTML = `
      <div class="container" style="text-align: center;">
        <img src="${resultImage}" alt="Result" style="width:55%;height:55%; margin-top:45px;" />
        <p style="color:black; font-size: 1rem; text-align: center; margin-top: 10px;">
          AI-generated likelihood: ${aiPercentage.toFixed(2)}%
        </p>
        <div style="width: 80%; margin: 10px auto; height: 10px; background: #ccc; border-radius: 5px; overflow: hidden;">
          <div id="progressBar" style="height: 100%; width: 0%; background: green; transition: width 0.2s linear, background-color 0.2s linear;"></div>
        </div>
      </div>
    `;

    document.body.appendChild(thirdpop);

    // Animate progress bar as before
    const progressBar = thirdpop.querySelector('#progressBar');
    let width = 0;
    const target = Math.max(0, Math.min(100, aiPercentage));
    const duration = 2000;
    const steps = target;
    const intervalTime = duration / steps;

    const interval = setInterval(() => {
      width += 1;
      progressBar.style.width = width + '%';

      if (width > 75) {
        progressBar.style.backgroundColor = 'red';
      } else if (width > 50) {
        progressBar.style.backgroundColor = 'orange';
      } else {
        progressBar.style.backgroundColor = 'green';
      }

      if (width >= target) {
        clearInterval(interval);
      }
    }, intervalTime);

    // Remove third popup after 6 seconds and show second popup again
    setTimeout(() => {
      thirdpop.remove();
      console.log("third popup removed");
      secondPopup(); // Show second popup again
    }, 6000);
  }


  // Track the image currently under the mouse
  document.addEventListener('mouseover', (e) => {
    if (e.target.tagName === 'IMG') {
      hoveredImage = e.target;
    }
  });


  document.addEventListener('keydown', async (e) => {
    if (e.key.toLowerCase() === 's' && hoveredImage && !isCooldown) {
      isCooldown = true; // start cooldown
      const imageUrl = hoveredImage.src;
  
      closeContent();
      secondPopup();
      console.log("Sending image URL:", imageUrl);
  
      try {
        const response = await fetch('http://localhost:5000/check-ai', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: imageUrl })
        });
  
        const result = await response.json();
        console.log('AI % received:', result.ai_percentage);
  
        const aiPercent = typeof result.ai_percentage === 'number' ? result.ai_percentage : 0;
        thirdPopup(aiPercent);
  
      } catch (error) {
        console.error('Error checking AI:', error);
        alert('Failed to check image AI status.');
      }
  
      // Release cooldown after 6 seconds
      setTimeout(() => {
        isCooldown = false;
      }, 6000);
    }
  });
  
