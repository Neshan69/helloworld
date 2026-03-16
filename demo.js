
// ---- Resolve duplicate declarations, ensure preloader removes even if 'load' never fires (failsafe) ----

const btn      = document.getElementById('btn');
const mylist   = document.getElementById('mylist');
let   count    = mylist.children.length;

// Graph elements may not exist, so optional chaining
const countBar = document.getElementById('count-bar');
const barCount = document.getElementById('bar-count');

// Preloader removal: try on window 'load', but also use a failsafe to always remove after 3s.
function removePreloader() {
  const preloader = document.getElementById('preloader');
  if (preloader) {
    preloader.style.transition = 'opacity 3s';
    preloader.style.opacity = '0'; // Start fade-out
    setTimeout(() => {
      preloader.remove();
    }, 700); // Wait for fade
  }
}

window.addEventListener('load', removePreloader);
// Failsafe: forcibly remove preloader after 3s if 'load' did not fire (e.g. JS error or slow assets).
setTimeout(removePreloader, 3000);

btn.addEventListener('click', () => {
  count++;
  const li       = document.createElement('li');
  li.textContent = `Item ${count}`;
  mylist.appendChild(li);
});

function updateBar() {
  const n = mylist.children.length;
  // scale: 24px + (n-1)*12px (min height 24)
  let newH = 24 + (n-1) * 12;
  if (newH > 80) newH = 80; // cap at 80px for visual
  if (countBar) countBar.style.height = newH + 'px';
  if (barCount) barCount.textContent  = n;
}
// On item add, update visuals!
btn.addEventListener('click', updateBar);

// For direct DOM manipulation (in case initial items changed)
new MutationObserver(updateBar).observe(mylist, { childList: true });
