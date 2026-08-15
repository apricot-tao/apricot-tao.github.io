const quotes = [
  {
    author: "Friedrich Nietzsche / 尼采",
    text: "一个人知道自己为什么而活，就可以忍受几乎任何一种生活。",
    source: "《偶像的黄昏》· 格言 12",
  },
  {
    author: "Jean-Paul Sartre / 萨特",
    text: "存在先于本质。人首先存在、出现，然后才定义自己。",
    source: "《存在主义是一种人道主义》",
  },
  {
    author: "Albert Camus / 加缪",
    text: "在隆冬，我终于发现，我身上有一个不可战胜的夏天。",
    source: "《重返蒂巴萨》",
  },
  {
    author: "Martin Heidegger / 海德格尔",
    text: "语言是存在之家；人栖居于语言的寓所之中。",
    source: "《关于人道主义的书信》",
  },
  {
    author: "Zhuangzi / 庄子",
    text: "天地与我并生，而万物与我为一。",
    source: "《庄子 · 齐物论》",
  },
  {
    author: "Śākyamuni / 释迦牟尼",
    text: "诸行无常；以智慧如实观照，便能离苦而向清净。",
    source: "《法句经》· 第 277 偈",
  },
];

const journalEntries = {
  "2026-03-12": { title: "u", content: "这是内容1" },
  "2016-03-12": { title: "n", content: "这是内容2" },
};

const landing = document.querySelector("#landing");
const shell = document.querySelector("#site-shell");
const quoteText = document.querySelector("#quote-text");
const quoteAuthor = document.querySelector("#quote-author");
const quoteSource = document.querySelector("#quote-source");
let currentQuote = -1;

function showRandomQuote() {
  const isInitial = currentQuote === -1;
  let next;
  do next = Math.floor(Math.random() * quotes.length);
  while (quotes.length > 1 && next === currentQuote);
  currentQuote = next;
  const target = [quoteText, quoteAuthor, quoteSource];
  target.forEach((el) => { el.style.opacity = "0"; el.style.transform = "translateY(4px)"; });
  window.setTimeout(() => {
    quoteText.textContent = `“${quotes[next].text}”`;
    quoteAuthor.textContent = quotes[next].author;
    quoteSource.textContent = quotes[next].source;
    target.forEach((el) => { el.style.opacity = "1"; el.style.transform = "none"; });
  }, isInitial ? 0 : 180);
}

function enterSite() {
  landing.classList.add("hidden");
  shell.classList.add("visible");
  shell.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "auto";
  window.scrollTo({ top: 0, behavior: "smooth" });
  window.setTimeout(revealVisible, 350);
}

function showCover() {
  landing.classList.remove("hidden");
  shell.classList.remove("visible");
  shell.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "hidden";
  window.scrollTo(0, 0);
  showRandomQuote();
}

document.querySelector("#enter-site").addEventListener("click", enterSite);
document.querySelector("#shuffle-quote").addEventListener("click", showRandomQuote);
document.querySelector("#back-to-cover").addEventListener("click", showCover);
document.body.style.overflow = "hidden";
showRandomQuote();

const nav = document.querySelector(".nav");
const menuButton = document.querySelector("#menu-button");
menuButton.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(open));
});

function navigateTo(pageName) {
  document.querySelectorAll("[data-page-panel]").forEach((panel) => {
    panel.classList.toggle("active", panel.dataset.pagePanel === pageName);
  });
  document.querySelectorAll(".nav__item").forEach((item) => {
    item.classList.toggle("active", item.dataset.page === pageName);
  });
  nav.classList.remove("open");
  menuButton.setAttribute("aria-expanded", "false");
  history.replaceState(null, "", `#${pageName}`);
  const top = document.querySelector(".pages").offsetTop - 72;
  window.scrollTo({ top, behavior: "smooth" });
  window.setTimeout(revealVisible, 80);
}

document.querySelectorAll(".nav__item").forEach((button) => {
  button.addEventListener("click", () => navigateTo(button.dataset.page));
});
document.querySelectorAll("[data-jump]").forEach((button) => {
  button.addEventListener("click", () => navigateTo(button.dataset.jump));
});

function updateClock() {
  const now = new Date();
  document.querySelector("#live-time").textContent = new Intl.DateTimeFormat("zh-CN", {
    hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "Asia/Shanghai",
  }).format(now);
  document.querySelector("#live-date").textContent = `NANJING · ${new Intl.DateTimeFormat("en-GB", {
    weekday: "long", day: "2-digit", month: "short", timeZone: "Asia/Shanghai",
  }).format(now).toUpperCase()}`;
}
updateClock();
window.setInterval(updateClock, 30000);

let calendarCursor = new Date(2026, 2, 1);
let selectedDate = "2026-03-12";
const calendarLabel = document.querySelector("#calendar-label");
const calendarDays = document.querySelector("#calendar-days");

function pad(value) { return String(value).padStart(2, "0"); }
function dateKey(year, month, day) { return `${year}-${pad(month + 1)}-${pad(day)}`; }

function renderCalendar() {
  const year = calendarCursor.getFullYear();
  const month = calendarCursor.getMonth();
  calendarLabel.textContent = `${calendarCursor.toLocaleDateString("en-US", { month: "long" })} · ${year}`;
  calendarDays.innerHTML = "";
  const firstOffset = (new Date(year, month, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrev = new Date(year, month, 0).getDate();

  for (let cell = 0; cell < 42; cell += 1) {
    let day = cell - firstOffset + 1;
    let cellMonth = month;
    let cellYear = year;
    let outside = false;
    if (day < 1) { cellMonth -= 1; day = daysInPrev + day; outside = true; }
    if (day > daysInMonth) { cellMonth += 1; day -= daysInMonth; outside = true; }
    if (cellMonth < 0) { cellMonth = 11; cellYear -= 1; }
    if (cellMonth > 11) { cellMonth = 0; cellYear += 1; }
    const key = dateKey(cellYear, cellMonth, day);
    const button = document.createElement("button");
    button.type = "button";
    button.className = "calendar-day";
    button.textContent = day;
    button.setAttribute("aria-label", key);
    if (outside) button.classList.add("outside");
    if (journalEntries[key]) button.classList.add("has-event");
    if (key === selectedDate) button.classList.add("selected");
    button.addEventListener("click", () => selectDate(key, true));
    calendarDays.appendChild(button);
  }
}

function selectDate(key, fromCalendar = false) {
  selectedDate = key;
  const entry = journalEntries[key] || { title: "嗯，很平凡的一天", content: "没有特别的记录。风经过，云也经过，这一天安静地成为了过去。" };
  document.querySelector("#selected-date").textContent = key.split("-").join(" — ");
  document.querySelector("#selected-title").textContent = entry.title;
  document.querySelector("#selected-content").textContent = entry.content;
  document.querySelectorAll(".event").forEach((event) => event.classList.toggle("active", event.dataset.date === key));
  if (!fromCalendar) {
    const [year, month] = key.split("-").map(Number);
    calendarCursor = new Date(year, month - 1, 1);
  }
  renderCalendar();
  document.querySelector("#day-card").animate(
    [{ opacity: .55, transform: "translateY(5px)" }, { opacity: 1, transform: "none" }],
    { duration: 320, easing: "ease-out" },
  );
}

document.querySelector("#prev-month").addEventListener("click", () => {
  calendarCursor = new Date(calendarCursor.getFullYear(), calendarCursor.getMonth() - 1, 1);
  renderCalendar();
});
document.querySelector("#next-month").addEventListener("click", () => {
  calendarCursor = new Date(calendarCursor.getFullYear(), calendarCursor.getMonth() + 1, 1);
  renderCalendar();
});
document.querySelectorAll(".event").forEach((event) => {
  event.addEventListener("click", () => selectDate(event.dataset.date));
});
renderCalendar();

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => { if (entry.isIntersecting) entry.target.classList.add("is-visible"); });
}, { threshold: .08 });
document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
function revealVisible() {
  document.querySelectorAll(".page.active .reveal").forEach((element) => element.classList.add("is-visible"));
}

window.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && !landing.classList.contains("hidden")) enterSite();
  if (event.key === "Escape" && landing.classList.contains("hidden")) showCover();
});
