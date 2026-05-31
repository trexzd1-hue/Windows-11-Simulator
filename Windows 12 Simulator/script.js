// =============================
// إدارة الثيمات (Dark/Light)
// =============================
function changeTheme() {
    const theme = document.getElementById('themeSelect').value;
    document.body.setAttribute('data-theme', theme);

    const desktop = document.getElementById('desktop');

    if (theme === "dark") {
        desktop.style.backgroundImage = "url('assets/WindowsDarkWpaper.jpg')";
    } else {
        desktop.style.backgroundImage = "url('assets/WindowsLightWpaper.jpg')";
    }
}


// =============================
// إعداد وتغيير الخلفيات المخصص
// =============================
function changeWallpaper() {
    const wp = document.getElementById('wpSelect').value;
    const desktop = document.getElementById('desktop');

    if (wp === "auto") {
        changeTheme(); // يرجع الخلفية حسب الثيم
    } else {
        desktop.style.backgroundImage = `url('assets/${wp}')`;
    }
}


// =============================
// نظام اللغات والترجمة الشامل
// =============================
const dictionary = {
    en: {
        thisPc: "This PC",
        recycleBin: "Recycle Bin",
        pinned: "Pinned",
        browser: "Microsoft Store",
        store: "Microsoft Store",
        settings: "Settings",
        systemSettings: "Settings",
        theme: "Theme",
        dark: "Dark",
        light: "Light",
        language: "Language",
        noResults: "No results found",
        documents: "Documents",
        downloads: "Downloads",
        searchPlaceholder: "Type here to search..."
    },
    ar: {
        thisPc: "هذا الكمبيوتر",
        recycleBin: "سلة المحذوفات",
        pinned: "المثبتة",
        browser: "المتصفح",
        store: "المتجر",
        settings: "الإعدادات",
        systemSettings: "إعدادات النظام",
        theme: "المظهر",
        dark: "داكن",
        light: "فاتح",
        language: "اللغة",
        noResults: "لاتوجد نتائج",
        documents: "المستندات",
        downloads: "التنزيلات",
        searchPlaceholder: "اكتب هنا للبحث..."
    }
};

function changeLanguage() {
    const lang = document.getElementById('langSelect').value;
    
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';

    document.querySelectorAll('[data-translate]').forEach(el => {
        const key = el.getAttribute('data-translate');
        el.innerText = dictionary[lang][key];
    });

    document.querySelectorAll('[data-placeholder]').forEach(el => {
        const key = el.getAttribute('data-placeholder');
        el.placeholder = dictionary[lang][key];
    });
}

// =============================
// قائمة ابدأ والساعة
// =============================
function toggleStartMenu() {
    document.getElementById('startMenu').classList.toggle('active');
}

document.getElementById('desktop').addEventListener('click', (e) => {
    const startMenu = document.getElementById('startMenu');
    if (!startMenu.contains(e.target) && e.target.id !== 'startBtn' && !e.target.closest('#startBtn')) {
        startMenu.classList.remove('active');
    }
});

function updateClock() {
    const now = new Date();
    const lang = document.documentElement.lang === 'ar' ? 'ar-EG' : 'en-US';
    
    document.querySelector('.clock .time').innerText = now.toLocaleTimeString(lang, { hour: '2-digit', minute: '2-digit' });
    document.querySelector('.clock .date').innerText = now.toLocaleDateString(lang);
}
setInterval(updateClock, 1000);
updateClock();

// =============================
// إدارة النوافذ الاحترافية (فتح / تصغير / إغلاق / سحب)
// =============================
let highestZIndex = 10;

function openWindow(id) {
    const win = document.getElementById(id);
    const taskBtn = document.getElementById(`task-${id}`);
    
    win.classList.remove('minimized');
    win.style.display = 'flex';
    setTimeout(() => win.classList.add('show'), 10); // تأخير بسيط لتفعيل أنيميشن السلاسة
    
    if (taskBtn) {
        taskBtn.classList.add('running', 'active-win');
    }
    bringToFront(win);
}

function closeWindow(id) {
    const win = document.getElementById(id);
    const taskBtn = document.getElementById(`task-${id}`);
    
    win.classList.remove('show');
    setTimeout(() => { win.style.display = 'none'; }, 150); // إخفاء بعد انتهاء الأنيميشن
    
    if (taskBtn) {
        taskBtn.classList.remove('running', 'active-win');
    }
}

function minimizeWindow(id) {
    const win = document.getElementById(id);
    const taskBtn = document.getElementById(`task-${id}`);
    
    win.classList.add('minimized');
    if (taskBtn) {
        taskBtn.classList.remove('active-win');
    }
}

// وظيفة عند الضغط على الأيقونة في شريط المهام السفلي (تصغير/تكبير ذكي)
function toggleWindow(id) {
    const win = document.getElementById(id);
    if (win.classList.contains('show') && !win.classList.contains('minimized')) {
        minimizeWindow(id);
    } else {
        openWindow(id);
    }
}

function bringToFront(windowElement) {
    highestZIndex++;
    windowElement.style.zIndex = highestZIndex;
    
    // تحديث الأيقونة النشطة أسفل شريط المهام
    document.querySelectorAll('.taskbar-btn').forEach(btn => btn.classList.remove('active-win'));
    const taskBtn = document.getElementById(`task-${windowElement.id}`);
    if (taskBtn) taskBtn.classList.add('active-win');
}

// تفعيل ميزة السحب الذكي (Drag) للنوافذ من الشريط العلوي
document.querySelectorAll('.window').forEach(win => {
    const titleBar = win.querySelector('.title-bar');
    let isDragging = false;
    let offsetX, offsetY;

    win.addEventListener('mousedown', () => bringToFront(win));

    titleBar.addEventListener('mousedown', (e) => {
        // عدم تفعيل السحب إذا ضغط المستخدم على أزرار التحكم (X أو ─)
        if (e.target.closest('.win-btn')) return;
        
        isDragging = true;
        offsetX = e.clientX - win.offsetLeft;
        offsetY = e.clientY - win.offsetTop;
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        let newX = e.clientX - offsetX;
        let newY = e.clientY - offsetY;
        
        if (newY < 0) newY = 0; // حماية حتى لا تختفي النافذة تحت شريط المتصفح العلوي

        win.style.left = `${newX}px`;
        win.style.top = `${newY}px`;
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });
});
window.onload = () => {
    // تشغيل صوت الترحيب
    const audio = document.getElementById("welcomeSound");
    audio.volume = 1.0;
    audio.play().catch(() => {});

    // إظهار نافذة الترحيب
    const welcome = document.getElementById("welcome-window");
    welcome.classList.add("show");
    welcome.style.display = "flex";

    bringToFront(welcome);
};

function closeWelcome() {
    const welcome = document.getElementById("welcome-window");
    welcome.classList.remove("show");
    setTimeout(() => welcome.style.display = "none", 150);
}
