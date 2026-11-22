(() => {
  const $ = (id) => document.getElementById(id);
  const STORAGE_KEY = "tminus-lockscreen-v2";
  const defaultMilestones = [
    { tag: "T−14 DAYS", task: "Finalize project architecture", done: true },
    { tag: "T−10 DAYS", task: "Build core UI and APIs", done: true },
    { tag: "T−7 DAYS", task: "Complete testing and bug fixes", done: true },
    { tag: "T−3 DAYS", task: "Deploy live and write documentation", done: true },
    { tag: "T−1 DAY", task: "Final review and polish", done: true },
    { tag: "T−0 DAYS", task: "Submit project", done: false }
  ];

  let state = {
    goal: "PORTFOLIO LAUNCH",
    deadline: "",
    theme: "violet",
    milestones: defaultMilestones,
    photo: ""
  };

  const goalInput = $("goal-input");
  const deadlineInput = $("deadline-input");
  const themeSelect = $("theme-select");
  const milestoneInputs = $("milestone-inputs");
  const previewList = $("preview-list");
  const lockscreen = $("lockscreen");

  function loadState() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (saved && typeof saved === "object") {
        state = { ...state, ...saved };
        if (!Array.isArray(state.milestones)) state.milestones = defaultMilestones;
      }
    } catch (error) {
      console.warn("Could not load saved T-Minus settings.", error);
    }
    goalInput.value = state.goal || "";
    deadlineInput.value = state.deadline || "";
    themeSelect.value = state.theme || "violet";
    applyPhoto();
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.warn("Browser storage is full. Try a smaller background photo.", error);
      alert("Could not save this photo. Please choose a smaller image.");
    }
  }

  function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, (char) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[char]));
  }

  function getCountdown() {
    if (!state.deadline) return "SET YOUR DEADLINE";
    const target = new Date(`${state.deadline}T23:59:59`);
    if (Number.isNaN(target.getTime())) return "SET YOUR DEADLINE";
    const today = new Date();
    const startToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const targetDay = new Date(target.getFullYear(), target.getMonth(), target.getDate());
    const days = Math.ceil((targetDay - startToday) / 86400000);
    if (days > 0) return `T− ${String(days).padStart(2, "0")} DAYS`;
    if (days === 0) return "T− 00 DAYS · TODAY";
    return `T+ ${String(Math.abs(days)).padStart(2, "0")} DAYS`;
  }

  function updateClock() {
    const now = new Date();
    $("clock-time").textContent = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
    $("clock-date").textContent = now.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" });
    $("status-date").textContent = now.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" }).toUpperCase();
    $("countdown-chip").textContent = getCountdown();
  }

  function renderEditor() {
    milestoneInputs.innerHTML = "";
    state.milestones.forEach((item, index) => {
      const row = document.createElement("div");
      row.className = "milestone-row";
      row.innerHTML = `
        <input type="checkbox" aria-label="Mark milestone complete" ${item.done ? "checked" : ""}>
        <input type="text" maxlength="90" aria-label="Milestone ${index + 1}" value="${escapeHTML(`${item.tag} | ${item.task}`)}">
        <button class="delete-button" type="button" aria-label="Delete milestone">×</button>`;
      const [check, textInput, remove] = row.children;
      check.addEventListener("change", () => {
        state.milestones[index].done = check.checked;
        saveState(); renderPreview(); updateProgress();
      });
      textInput.classList.toggle("completed-input", item.done);
      textInput.addEventListener("input", () => {
        const parts = textInput.value.split("|");
        state.milestones[index].tag = (parts.shift() || "").trim();
        state.milestones[index].task = parts.join("|").trim();
        saveState(); renderPreview(); updateProgress();
      });
      remove.addEventListener("click", () => {
        state.milestones.splice(index, 1);
        saveState(); renderAll();
      });
      milestoneInputs.appendChild(row);
    });
  }

  function renderPreview() {
    $("preview-title").innerHTML = `T-MINUS COUNTDOWN:<br>${escapeHTML(state.goal.trim() || "YOUR NEXT GOAL")}`;
    previewList.innerHTML = "";
    state.milestones.forEach((item, index) => {
      const li = document.createElement("li");
      li.className = item.done ? "done" : "";
      li.innerHTML = `<span class="check-symbol">${item.done ? "☑" : "☐"}</span>
        <span class="milestone-copy"><span class="milestone-tag">${escapeHTML(item.tag)}</span>${escapeHTML(item.task)}</span>`;
      li.title = "Tap to toggle completion";
      li.addEventListener("click", () => {
        state.milestones[index].done = !state.milestones[index].done;
        saveState(); renderAll();
      });
      previewList.appendChild(li);
    });
    updateProgress();
    updateClock();
  }

  function updateProgress() {
    const total = state.milestones.length;
    const completed = state.milestones.filter((item) => item.done).length;
    const percent = total ? Math.round((completed / total) * 100) : 0;
    $("progress-label").textContent = `${completed} / ${total} COMPLETE`;
    $("progress-bar").style.width = `${percent}%`;
    $("completion-count").textContent = `${percent}% DONE`;
  }

  function applyPhoto() {
    if (state.photo) {
      lockscreen.classList.add("has-photo");
      lockscreen.style.setProperty("--wallpaper", `url("${state.photo}")`);
      $("remove-photo").hidden = false;
    } else {
      lockscreen.classList.remove("has-photo");
      lockscreen.style.removeProperty("--wallpaper");
      $("remove-photo").hidden = true;
    }
  }


  function downloadWallpaper() {
    const button = $("download-wallpaper");
    button.disabled = true;
    button.textContent = "Preparing your wallpaper…";
    const canvas = document.createElement("canvas");
    canvas.width = 1080;
    canvas.height = 1920;
    const ctx = canvas.getContext("2d");
    const accentMap = {
      violet: "#a78bfa", cyan: "#67d9ef", orange: "#ffad70", lime: "#c1f27b"
    };
    const accent = accentMap[state.theme] || accentMap.violet;

    const draw = (photoImage) => {
      const gradient = ctx.createLinearGradient(0, 0, 1080, 1920);
      gradient.addColorStop(0, "#292044");
      gradient.addColorStop(.48, "#121c2c");
      gradient.addColorStop(1, "#0b0d16");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 1080, 1920);

      if (photoImage) {
        const scale = Math.max(1080 / photoImage.width, 1920 / photoImage.height);
        const w = photoImage.width * scale, h = photoImage.height * scale;
        ctx.save();
        ctx.globalAlpha = .68;
        ctx.drawImage(photoImage, (1080 - w) / 2, (1920 - h) / 2, w, h);
        ctx.restore();
      } else {
        const glow = ctx.createRadialGradient(220, 320, 20, 300, 360, 780);
        glow.addColorStop(0, accent + "88");
        glow.addColorStop(1, "#11121c00");
        ctx.fillStyle = glow;
        ctx.fillRect(0, 0, 1080, 1920);
        const glow2 = ctx.createRadialGradient(920, 1200, 10, 900, 1200, 650);
        glow2.addColorStop(0, "#1c718066");
        glow2.addColorStop(1, "#11121c00");
        ctx.fillStyle = glow2;
        ctx.fillRect(0, 0, 1080, 1920);
      }

      const shade = ctx.createLinearGradient(0, 0, 0, 1920);
      shade.addColorStop(0, "#08091455");
      shade.addColorStop(.4, "#08091466");
      shade.addColorStop(1, "#080914e8");
      ctx.fillStyle = shade;
      ctx.fillRect(0, 0, 1080, 1920);

      const now = new Date();
      const time = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
      const date = now.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" });

      ctx.textAlign = "center";
      ctx.fillStyle = "#ffffffd9";
      ctx.font = "500 30px Arial";
      ctx.fillText(now.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" }).toUpperCase(), 540, 105);
      ctx.fillStyle = "#ffffff";
      ctx.font = "500 190px Arial";
      ctx.fillText(time, 540, 390);
      ctx.fillStyle = "#ffffffcc";
      ctx.font = "36px Arial";
      ctx.fillText(date, 540, 455);
      ctx.font = "26px monospace";
      ctx.fillStyle = "#ffffff";
      ctx.fillText(getCountdown(), 540, 525);

      const cardX = 90, cardY = 700, cardW = 900, cardH = 1010;
      ctx.fillStyle = "#ffffff20";
      ctx.strokeStyle = "#ffffff70";
      ctx.lineWidth = 3;
      roundedRect(ctx, cardX, cardY, cardW, cardH, 44);
      ctx.fill();
      ctx.stroke();

      ctx.textAlign = "left";
      ctx.fillStyle = accent;
      ctx.font = "500 25px monospace";
      ctx.fillText("T H E   M I S S I O N", 145, 780);
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 57px Arial";
      const title = `T-MINUS COUNTDOWN: ${state.goal.trim() || "YOUR NEXT GOAL"}`;
      const titleLines = wrapText(ctx, title.toUpperCase(), 790);
      let titleY = 875;
      titleLines.slice(0, 2).forEach(line => {
        ctx.fillText(line, 145, titleY);
        titleY += 68;
      });
      ctx.strokeStyle = "#ffffff55";
      ctx.beginPath(); ctx.moveTo(145, titleY + 15); ctx.lineTo(935, titleY + 15); ctx.stroke();

      const available = state.milestones.slice(0, 9);
      let y = titleY + 95;
      ctx.font = "bold 25px monospace";
      available.forEach((item) => {
        ctx.fillStyle = accent;
        ctx.font = "34px Arial";
        ctx.fillText(item.done ? "☑" : "☐", 145, y);
        ctx.fillStyle = "#ffffffa8";
        ctx.font = "21px monospace";
        ctx.fillText(String(item.tag || "").toUpperCase().slice(0, 40), 205, y - 4);
        ctx.fillStyle = item.done ? "#ffffff88" : "#ffffff";
        ctx.font = "29px Arial";
        const taskLines = wrapText(ctx, item.task || "", 700);
        taskLines.slice(0, 2).forEach((line, lineIndex) => ctx.fillText(line, 205, y + 34 + lineIndex * 34));
        y += 105 + Math.max(0, taskLines.length - 1) * 28;
      });

      const completed = state.milestones.filter(item => item.done).length;
      const percent = state.milestones.length ? Math.round(completed / state.milestones.length * 100) : 0;
      ctx.strokeStyle = "#ffffff55";
      ctx.beginPath(); ctx.moveTo(145, 1625); ctx.lineTo(935, 1625); ctx.stroke();
      ctx.fillStyle = "#ffffffaa";
      ctx.font = "20px monospace";
      ctx.fillText("STAY FOCUSED.", 145, 1675);
      ctx.textAlign = "right";
      ctx.fillText(`${percent}% DONE`, 935, 1675);
      ctx.textAlign = "center";
      ctx.fillStyle = "#ffffff99";
      ctx.font = "18px monospace";
      ctx.fillText("ONE STEP AT A TIME", 540, 1810);

      canvas.toBlob((blob) => {
        if (!blob) {
          alert("Could not create the wallpaper. Please try again.");
          button.disabled = false;
          button.textContent = "↓ Download 1080 × 1920 wallpaper";
          return;
        }
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "t-minus-lock-screen-1080x1920.png";
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
        button.disabled = false;
        button.textContent = "↓ Download 1080 × 1920 wallpaper";
      }, "image/png");
    };

    function roundedRect(context, x, y, width, height, radius) {
      context.beginPath();
      context.roundRect(x, y, width, height, radius);
    }
    function wrapText(context, text, maxWidth) {
      const words = String(text).split(/\s+/);
      const lines = [];
      let line = "";
      words.forEach(word => {
        const test = line ? `${line} ${word}` : word;
        if (context.measureText(test).width > maxWidth && line) {
          lines.push(line); line = word;
        } else line = test;
      });
      if (line) lines.push(line);
      return lines;
    }

    if (state.photo) {
      const image = new Image();
      image.onload = () => draw(image);
      image.onerror = () => draw(null);
      image.src = state.photo;
    } else {
      draw(null);
    }
  }

  function renderAll() {
    renderEditor();
    renderPreview();
  }

  goalInput.addEventListener("input", () => {
    state.goal = goalInput.value;
    saveState(); renderPreview();
  });
  deadlineInput.addEventListener("change", () => {
    state.deadline = deadlineInput.value;
    saveState(); updateClock();
  });
  themeSelect.addEventListener("change", () => {
    state.theme = themeSelect.value;
    document.documentElement.dataset.theme = state.theme;
    saveState();
  });
  $("add-btn").addEventListener("click", () => {
    state.milestones.push({ tag: "NEW MILESTONE", task: "Add your next task", done: false });
    saveState(); renderAll();
    const inputs = milestoneInputs.querySelectorAll('input[type="text"]');
    inputs[inputs.length - 1]?.focus();
  });
  $("photo-input").addEventListener("change", (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Please choose an image file.");
      return;
    }
    if (file.size > 3 * 1024 * 1024) {
      alert("Please choose an image under 3 MB for reliable browser storage.");
      event.target.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      state.photo = reader.result;
      saveState(); applyPhoto();
    };
    reader.readAsDataURL(file);
  });
  $("download-wallpaper").addEventListener("click", downloadWallpaper);
  $("remove-photo").addEventListener("click", () => {
    state.photo = "";
    $("photo-input").value = "";
    saveState(); applyPhoto();
  });

  loadState();
  document.documentElement.dataset.theme = state.theme;
  renderAll();
  updateClock();
  window.setInterval(updateClock, 1000);
})();