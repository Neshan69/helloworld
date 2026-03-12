
const btn    = document.getElementById('btn');
const mylist = document.getElementById('mylist');
let   count  = mylist.children.length;

btn.addEventListener('click', () => {
  count++;
  const li       = document.createElement('li');
  li.textContent = `Item ${count }`;
  mylist.appendChild(li);
});