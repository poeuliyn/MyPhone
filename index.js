/* ============================================================
   MyPhone v0.1.0 — มือถือจำลองสไตล์ iOS สำหรับ SillyTavern
   เขียนใหม่ทั้งหมด (ไม่ได้อิงโค้ดจาก extension อื่น)
   เฟสนี้: โครงมือถือ (ล็อกสกรีน/โฮม/ตั้งค่า/ปรับแต่งธีม) + แอปข้อความ (Messages)
   แอปอื่น (เฟสบุ๊ค/ดิสคอร์ด/กูเกิ้ล/อีเมล/ธนาคาร/ช็อปปิ้ง) จะเพิ่มในเฟสถัดไป
   ============================================================ */

const MP_MODULE = 'myphone';
const MP_VERSION = '0.2.0';

function ctx() {
 try { return SillyTavern.getContext(); } catch { return null; }
}

/* ── ไอคอน SVG (เส้น outline เรียบ ๆ แบบ SF Symbols) ── */
const MP_ICON = {
 phone: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6.6 10.8c1.4 2.8 3.8 5.2 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.4c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.4 0 .8-.2 1L6.6 10.8Z"/></svg>',
 back: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg>',
 chev: '<svg viewBox="0 0 8 14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 1l6 6-6 6"/></svg>',
 check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12l6 6L20 6"/></svg>',
 send: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 11.5 20.5 4 13 21.5l-2.5-7-7.5-3Z"/></svg>',
 wifi: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 18.5a1.6 1.6 0 1 1 0 3.2 1.6 1.6 0 0 1 0-3.2ZM7 14.8a7 7 0 0 1 10 0l-1.6 1.6a4.8 4.8 0 0 0-6.8 0L7 14.8Zm-3.6-3.7a11.6 11.6 0 0 1 17.2 0l-1.6 1.6a9.3 9.3 0 0 0-14 0L3.4 11Z"/></svg>',
 battery: '<svg viewBox="0 0 26 14" fill="none" stroke="currentColor" stroke-width="1.3"><rect x="1" y="1.5" width="21" height="11" rx="2.6"/><rect x="3" y="3.5" width="14" height="7" rx="1.3" fill="currentColor" stroke="none"/><path d="M24 5v4" stroke-linecap="round"/></svg>',
 signal: '<svg viewBox="0 0 20 14" fill="currentColor"><rect x="0" y="9" width="3.5" height="5" rx="1"/><rect x="5.5" y="6" width="3.5" height="8" rx="1"/><rect x="11" y="3" width="3.5" height="11" rx="1"/><rect x="16.5" y="0" width="3.5" height="14" rx="1"/></svg>',
 gear: '<svg viewBox="0 0 24 24" fill="#fff"><path d="M12 8.4a3.6 3.6 0 1 0 0 7.2 3.6 3.6 0 0 0 0-7.2Zm8.9 2.4-1.6-.4a7.4 7.4 0 0 0-.7-1.7l.9-1.4a1 1 0 0 0-.1-1.2l-1.4-1.4a1 1 0 0 0-1.2-.1l-1.4.9a7.4 7.4 0 0 0-1.7-.7l-.4-1.6a1 1 0 0 0-1-.8h-2a1 1 0 0 0-1 .8l-.4 1.6a7.4 7.4 0 0 0-1.7.7l-1.4-.9a1 1 0 0 0-1.2.1L2.1 6.4a1 1 0 0 0-.1 1.2l.9 1.4a7.4 7.4 0 0 0-.7 1.7l-1.6.4a1 1 0 0 0-.8 1v2a1 1 0 0 0 .8 1l1.6.4c.16.6.4 1.17.7 1.7l-.9 1.4a1 1 0 0 0 .1 1.2l1.4 1.4a1 1 0 0 0 1.2.1l1.4-.9c.53.3 1.1.54 1.7.7l.4 1.6a1 1 0 0 0 1 .8h2a1 1 0 0 0 1-.8l.4-1.6a7.4 7.4 0 0 0 1.7-.7l1.4.9a1 1 0 0 0 1.2-.1l1.4-1.4a1 1 0 0 0 .1-1.2l-.9-1.4c.3-.53.54-1.1.7-1.7l1.6-.4a1 1 0 0 0 .8-1v-2a1 1 0 0 0-.8-1Z"/></svg>',
 chat: '<svg viewBox="0 0 24 24" fill="#fff"><path d="M12 3C6.5 3 2 6.8 2 11.5c0 2.5 1.3 4.7 3.3 6.3-.2 1.2-.7 2.4-1.5 3.3 1.6-.1 3.2-.7 4.5-1.6 1.2.4 2.4.6 3.7.6 5.5 0 10-3.8 10-8.6S17.5 3 12 3Z"/></svg>',
 fb: '<svg viewBox="0 0 24 24" fill="#fff"><path d="M14 22v-8h2.7l.4-3.3H14V8.6c0-1 .3-1.6 1.7-1.6h1.8V4c-.3 0-1.4-.1-2.6-.1-2.6 0-4.4 1.6-4.4 4.5v2.3H8v3.3h2.5V22h3.5Z"/></svg>',
 discord: '<svg viewBox="0 0 24 24" fill="#fff"><path d="M18.9 5.7A16 16 0 0 0 14.9 4l-.3.6a13 13 0 0 1 3.5 1.3 14.6 14.6 0 0 0-12.2 0A13 13 0 0 1 9.4 4.6L9.1 4a16 16 0 0 0-4 1.7C2.6 9.4 2 13 2.3 16.6a16.2 16.2 0 0 0 4.9 2.5l.7-1.2a10 10 0 0 1-1.6-.8l.4-.3a11.6 11.6 0 0 0 10.6 0l.4.3c-.5.3-1 .6-1.6.8l.7 1.2a16.1 16.1 0 0 0 4.9-2.5c.4-4.1-.6-7.7-3-10.9ZM8.8 14.4c-.9 0-1.7-.9-1.7-1.9s.7-1.9 1.7-1.9 1.7.9 1.7 1.9-.8 1.9-1.7 1.9Zm6.4 0c-.9 0-1.7-.9-1.7-1.9s.8-1.9 1.7-1.9 1.7.9 1.7 1.9-.7 1.9-1.7 1.9Z"/></svg>',
 search: '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M20 20l-4.8-4.8"/></svg>',
 mail: '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linejoin="round"><rect x="2.5" y="5" width="19" height="14" rx="2.5"/><path d="M3 6.5 12 13l9-6.5"/></svg>',
 bank: '<svg viewBox="0 0 24 24" fill="#fff"><path d="M12 2 2 8h20L12 2Zm-8 8v9h3v-9H4Zm6.5 0v9h3v-9h-3ZM17 10v9h3v-9h-3ZM2 21h20v2H2v-2Z"/></svg>',
 bag: '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linejoin="round"><path d="M6 8h12l1 12.5a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 5 20.5L6 8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>',
};

/* ── ค่าเริ่มต้นของการตั้งค่า ── */
const MP_DEFAULTS = {
 theme: 'dark',              // dark | light
 accent: '#0a84ff',
 wallpaperId: 'aurora',
 wallpaperCustomUrl: '',
 iconTheme: 'classic',       // classic | mono | pastel | neon
 clockStyle: 'thin',         // thin | bold | mono | serif
 threads: {},                // contactId -> {messages:[{who,text,ts}], updatedAt}
};

const MP_WALLPAPERS = {
 aurora: 'linear-gradient(160deg,#0f2027,#203a43,#2c5364)',
 sunset: 'linear-gradient(160deg,#ff9966,#ff5e62)',
 mono:   'linear-gradient(160deg,#232526,#414345)',
 ocean:  'linear-gradient(160deg,#2193b0,#6dd5ed)',
 grape:  'linear-gradient(160deg,#41295a,#2f0743)',
 bloom:  'linear-gradient(160deg,#f7971e,#ffd200)',
};

const MP_ACCENTS = ['#0a84ff', '#ff375f', '#30d158', '#ff9f0a', '#bf5af2', '#64d2ff', '#ffd60a', '#8e8e93'];

/* ── สีไอคอนต่อธีม: key -> [เฉด1, เฉด2] ── */
const MP_ICON_THEMES = {
 classic: { messages: ['#63e560', '#2ed158'], settings: ['#8e8e93', '#636366'], facebook: ['#3b6fe0', '#1a4fc4'], discord: ['#8c9eff', '#5865f2'], google: ['#ffd54f', '#ff6f61'], mail: ['#5ac8fa', '#2f9de0'], bank: ['#2e8b57', '#1f5c3a'], shop: ['#ff9f0a', '#ff7a00'] },
 mono:    { messages: ['#9a9a9a', '#6b6b6b'], settings: ['#9a9a9a', '#6b6b6b'], facebook: ['#9a9a9a', '#6b6b6b'], discord: ['#9a9a9a', '#6b6b6b'], google: ['#9a9a9a', '#6b6b6b'], mail: ['#9a9a9a', '#6b6b6b'], bank: ['#9a9a9a', '#6b6b6b'], shop: ['#9a9a9a', '#6b6b6b'] },
 pastel:  { messages: ['#bdf5c4', '#8fe0a0'], settings: ['#d9d9e3', '#b8b8c4'], facebook: ['#b8d0ff', '#93b4f2'], discord: ['#cdd3ff', '#a9b1f2'], google: ['#ffe9a8', '#ffc3b0'], mail: ['#bfe9ff', '#9fd4f2'], bank: ['#bfe3cf', '#94c9ac'], shop: ['#ffd9a8', '#ffbf80'] },
 neon:    { messages: ['#00ffa3', '#00b377'], settings: ['#7dffea', '#20b2aa'], facebook: ['#00d1ff', '#0077b6'], discord: ['#c77dff', '#7b2ff7'], google: ['#fffb00', '#ff006e'], mail: ['#00e5ff', '#0091ea'], bank: ['#39ff14', '#0b8a00'], shop: ['#ff9e00', '#ff006e'] },
};

const MP_CLOCK_STYLES = [
 { id: 'thin', label: 'บาง (iOS ปกติ)', cls: 'mp-clock-thin' },
 { id: 'bold', label: 'หนา', cls: 'mp-clock-bold' },
 { id: 'mono', label: 'ตัวเลขดิจิทัล', cls: 'mp-clock-mono' },
 { id: 'serif', label: 'หัวเอียง', cls: 'mp-clock-serif' },
];

/* ── รายชื่อแอปบนโฮมสกรีน ── */
const MP_APPS = [
 { key: 'messages', name: 'ข้อความ', icon: MP_ICON.chat, ready: true },
 { key: 'facebook', name: 'เฟสบุ๊ค', icon: MP_ICON.fb, ready: false },
 { key: 'discord', name: 'ดิสคอร์ด', icon: MP_ICON.discord, ready: false },
 { key: 'google', name: 'ค้นหา', icon: MP_ICON.search, ready: false },
 { key: 'mail', name: 'อีเมล', icon: MP_ICON.mail, ready: false },
 { key: 'bank', name: 'ธนาคาร', icon: MP_ICON.bank, ready: false },
 { key: 'shop', name: 'ช็อปปิ้ง', icon: MP_ICON.bag, ready: false },
 { key: 'settings', name: 'ตั้งค่า', icon: MP_ICON.gear, ready: true },
];
const MP_DOCK_KEYS = ['messages', 'mail', 'shop', 'settings'];

/* ── การตั้งค่า: อ่าน/บันทึกผ่านระบบของ ST เอง (ไม่ใช้ localStorage) ── */
function getCfg() {
 const c = ctx();
 if (!c) return { ...MP_DEFAULTS };
 if (!c.extensionSettings[MP_MODULE]) c.extensionSettings[MP_MODULE] = {};
 const cfg = c.extensionSettings[MP_MODULE];
 for (const k in MP_DEFAULTS) {
  if (cfg[k] === undefined) cfg[k] = JSON.parse(JSON.stringify(MP_DEFAULTS[k]));
 }
 return cfg;
}
function saveCfg() {
 const c = ctx();
 if (c && typeof c.saveSettingsDebounced === 'function') c.saveSettingsDebounced();
}

/* ── สถานะหน้าจอปัจจุบัน ── */
const MP_STATE = { locked: true, stack: [{ screen: 'home' }], activeContactId: null, generating: false };
function mpCurrent() { return MP_STATE.stack[MP_STATE.stack.length - 1]; }
function mpPush(screen, params) { MP_STATE.stack.push({ screen, ...params }); render(); }
function mpPop() { if (MP_STATE.stack.length > 1) MP_STATE.stack.pop(); render(); }
function mpGoHome() { MP_STATE.stack = [{ screen: 'home' }]; render(); }

function esc(s) {
 return String(s ?? '').replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
}

/* ── โทสต์แจ้งเตือนสั้น ๆ ── */
let mpToastTimer = null;
function mpToast(msg) {
 const screen = document.querySelector('.myphone-screen');
 if (!screen) return;
 let t = screen.querySelector('.mp-toast');
 if (!t) { t = document.createElement('div'); t.className = 'mp-toast'; screen.appendChild(t); }
 t.textContent = msg;
 clearTimeout(mpToastTimer);
 mpToastTimer = setTimeout(() => t.remove(), 2200);
}

/* ============================================================
   การเจนข้อความผ่าน SillyTavern (ใช้ API หลักของ ST)
   ============================================================ */
function cleanReply(raw) {
 if (!raw) return '';
 let t = String(raw).trim();
 t = t.replace(/^["'“](.*)["'”]$/s, '$1'); // ตัดเครื่องหมายคำพูดครอบทั้งก้อน
 t = t.replace(/\*[^*]*\*/g, '').trim();   // ตัด *การกระทำ*
 return t;
}
async function mpGenerate(prompt) {
 const c = ctx();
 if (!c) throw new Error('ไม่พบ SillyTavern context');
 if (typeof c.generateQuietPrompt === 'function') {
  return await c.generateQuietPrompt({ quietPrompt: prompt, quietToLoud: false, skipWIAN: true });
 }
 if (typeof c.generateRaw === 'function') {
  return await c.generateRaw({ prompt });
 }
 throw new Error('SillyTavern เวอร์ชันนี้ไม่มีฟังก์ชันเจนข้อความที่รองรับ');
}

/* ── ดึงรายชื่อ "ผู้ติดต่อ" แบบอัตโนมัติจากแชทหลักของ ST ──
   กติกา: ตัวละครจะโผล่เป็นผู้ติดต่อเองถ้าเข้าเงื่อนไขข้อใดข้อหนึ่ง
   1) เคยพูดในแชทหลัก (เป็นเจ้าของข้อความ)
   2) ชื่อถูกเอ่ยถึงในเนื้อความของแชทหลัก (ใครพิมพ์ก็ได้ ผู้ใช้หรือตัวละครอื่น)
   3) เคยมีประวัติแชทกับเราในแอปนี้อยู่แล้ว (กันไม่ให้คนหายไปจากลิสต์หลังจากไม่ถูกพูดถึงแล้ว) */
function resolveAvatarUrl(avatar) {
 const c = ctx();
 try {
  if (c && typeof c.getThumbnailUrl === 'function') return c.getThumbnailUrl('avatar', avatar);
 } catch { /* fallthrough */ }
 return avatar ? `/characters/${encodeURIComponent(avatar)}` : '';
}
function buildPersonaText(ch) {
 const parts = [];
 if (ch.description) parts.push(ch.description);
 if (ch.personality) parts.push(`นิสัย: ${ch.personality}`);
 if (ch.scenario) parts.push(`ฉาก: ${ch.scenario}`);
 return parts.join('\n').slice(0, 2000);
}
function mainChatText() {
 const c = ctx();
 try { return (c.chat || []).map(m => (m && m.mes) ? String(m.mes) : '').join('\n'); }
 catch { return ''; }
}
function nameMentioned(name, chatMessages, fullText) {
 if (!name) return false;
 const spoke = chatMessages.some(m => m && m.name === name);
 if (spoke) return true;
 return fullText.toLowerCase().includes(name.trim().toLowerCase());
}
function getContacts() {
 const c = ctx();
 const cfg = getCfg();
 const list = [];
 if (!c) return list;
 try {
  const chatMessages = c.chat || [];
  const fullText = mainChatText();
  (c.characters || []).forEach((ch, idx) => {
   if (!ch || !ch.name) return;
   const id = 'char:' + (ch.avatar || idx);
   const hasThread = cfg.threads[id] && cfg.threads[id].messages.length > 0;
   if (!hasThread && !nameMentioned(ch.name, chatMessages, fullText)) return; // ยังไม่ถูกเอ่ยถึง ยังไม่โผล่ในลิสต์
   list.push({
    id,
    name: ch.name,
    avatar: resolveAvatarUrl(ch.avatar),
    persona: buildPersonaText(ch),
   });
  });
 } catch (e) { console.warn('[myphone] getContacts', e); }
 return list;
}
function getContact(id) { return getContacts().find(x => x.id === id) || null; }

function getThread(contactId) {
 const cfg = getCfg();
 if (!cfg.threads[contactId]) cfg.threads[contactId] = { messages: [], updatedAt: 0 };
 return cfg.threads[contactId];
}

function buildPrompt(contact, history) {
 const c = ctx();
 const userName = (c && c.name1) || 'ผู้ใช้';
 const historyText = history.slice(-20).map(m => `${m.who === 'me' ? userName : contact.name}: ${m.text}`).join('\n');
 return [
  `คุณสวมบทบาทเป็น "${contact.name}" กำลังคุยกับ "${userName}" ผ่านแอปแชทข้อความในมือถือ`,
  contact.persona ? `ข้อมูลตัวละคร:\n${contact.persona}` : '',
  'กติกา: ตอบสั้น 1-3 บรรทัดแบบพิมพ์แชทจริง ห้ามใส่ *การกระทำ* ห้ามบรรยายฉากหรือน้ำเสียง ห้ามใส่เครื่องหมายคำพูดครอบประโยค ตอบเป็นภาษาไทยแบบเป็นกันเอง',
  `บทสนทนาล่าสุด:\n${historyText || '(ยังไม่มีข้อความ)'}`,
  `${contact.name}:`,
 ].filter(Boolean).join('\n\n');
}

async function mpSendMessage(contactId, text) {
 const contact = getContact(contactId);
 if (!contact || !text.trim() || MP_STATE.generating) return;
 const thread = getThread(contactId);
 thread.messages.push({ who: 'me', text: text.trim(), ts: Date.now() });
 thread.updatedAt = Date.now();
 saveCfg();
 MP_STATE.generating = true;
 render();
 try {
  const prompt = buildPrompt(contact, thread.messages);
  const raw = await mpGenerate(prompt);
  const reply = cleanReply(raw);
  thread.messages.push({ who: 'them', text: reply || '(ไม่ได้รับคำตอบ)', ts: Date.now(), isError: !reply });
  thread.updatedAt = Date.now();
 } catch (e) {
  console.error('[myphone] gen failed', e);
  thread.messages.push({ who: 'them', text: 'ส่งข้อความไม่สำเร็จ: ' + (e && e.message ? e.message : 'เกิดข้อผิดพลาด'), ts: Date.now(), isError: true });
 } finally {
  MP_STATE.generating = false;
  saveCfg();
  render();
 }
}

/* ============================================================
   การ apply ธีม/วอลเปเปอร์/สีเน้น/สไตล์นาฬิกา ลงบนตัวเฟรม
   ============================================================ */
function applyTheming() {
 const cfg = getCfg();
 const frame = document.querySelector('.myphone-frame');
 if (!frame) return;
 frame.dataset.theme = cfg.theme;
 frame.style.setProperty('--accent', cfg.accent);
 const wp = cfg.wallpaperCustomUrl ? `url("${cfg.wallpaperCustomUrl}")` : (MP_WALLPAPERS[cfg.wallpaperId] || MP_WALLPAPERS.aurora);
 frame.style.setProperty('--ph-wallpaper', wp);
}

function iconStyleFor(appKey) {
 const cfg = getCfg();
 const pal = MP_ICON_THEMES[cfg.iconTheme] || MP_ICON_THEMES.classic;
 const g = pal[appKey] || ['#8e8e93', '#636366'];
 return `background:linear-gradient(160deg, ${g[0]}, ${g[1]});`;
}

function fmtTime(ts) {
 const d = new Date(ts);
 return d.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });
}
function fmtClock() {
 const d = new Date();
 return d.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', hour12: false });
}
function fmtDate() {
 const d = new Date();
 return d.toLocaleDateString('th-TH', { weekday: 'long', day: 'numeric', month: 'long' });
}

/* ============================================================
   Render — วาดหน้าจอปัจจุบันทั้งหมดใหม่ทุกครั้ง (เรียบง่าย พอสำหรับมือถือจำลอง)
   ============================================================ */
function render() {
 const root = document.getElementById('myphone-overlay');
 if (!root || !root.classList.contains('open')) return;
 const cfg = getCfg();
 applyTheming();

 const screen = document.querySelector('.myphone-screen');
 if (!screen) return;

 if (MP_STATE.locked) {
  screen.innerHTML = renderStatusBar() + renderLock(cfg);
  return;
 }

 const cur = mpCurrent();
 let body = '';
 if (cur.screen === 'home') body = renderHome(cfg);
 else if (cur.screen === 'messages-list') body = renderMessagesList();
 else if (cur.screen === 'messages-thread') body = renderMessagesThread(cur.contactId);
 else if (cur.screen === 'settings') body = renderSettingsHome(cfg);
 else if (cur.screen === 'settings-wallpaper') body = renderSettingsWallpaper(cfg);
 else if (cur.screen === 'settings-theme') body = renderSettingsTheme(cfg);
 else if (cur.screen === 'settings-accent') body = renderSettingsAccent(cfg);
 else if (cur.screen === 'settings-icontheme') body = renderSettingsIconTheme(cfg);
 else if (cur.screen === 'settings-clock') body = renderSettingsClock(cfg);
 else body = renderHome(cfg);

 screen.innerHTML = (cur.screen === 'home' ? '' : renderStatusBar()) + body + (cur.screen === 'home' ? '' : '<div class="mp-home-indicator"></div>');

 if (cur.screen === 'messages-thread') {
  const c = screen.querySelector('.mp-content');
  if (c) c.scrollTop = c.scrollHeight;
  const ta = screen.querySelector('.mp-inputbar textarea');
  if (ta) ta.focus();
 }
}

function renderStatusBar() {
 return `
 <div class="myphone-notch"></div>
 <div class="myphone-statusbar">
  <div>${fmtClock()}</div>
  <div class="mp-icons">${MP_ICON.signal}${MP_ICON.wifi}${MP_ICON.battery}</div>
 </div>`;
}

function renderLock(cfg) {
 const style = MP_CLOCK_STYLES.find(s => s.id === cfg.clockStyle) || MP_CLOCK_STYLES[0];
 return `
 <div class="myphone-lock" id="mp-lock-tap">
  <div class="myphone-lock-clock ${style.cls}">${fmtClock()}</div>
  <div class="myphone-lock-date">${fmtDate()}</div>
  <div class="myphone-lock-hint"><div class="chev">︿</div>ปัดขึ้นเพื่อปลดล็อก</div>
 </div>`;
}

function renderAppIcon(app) {
 const badge = app.ready ? '' : '<div class="mp-soon-dot">…</div>';
 return `
 <div class="mp-app" data-app="${app.key}">
  <div class="mp-app-icon" style="${iconStyleFor(app.key)}">${app.icon}${badge}</div>
  <div class="mp-app-label">${esc(app.name)}</div>
 </div>`;
}

function renderHome(cfg) {
 const grid = MP_APPS.map(renderAppIcon).join('');
 const dock = MP_DOCK_KEYS.map(k => renderAppIcon(MP_APPS.find(a => a.key === k))).join('');
 return `
 <div class="myphone-home">
  ${renderStatusBar()}
  <div class="mp-app-grid">${grid}</div>
  <div class="mp-dock">${dock}</div>
  <div class="myphone-home-spacer"></div>
 </div>
 <div class="mp-home-indicator"></div>`;
}

function navbar(title, opts) {
 opts = opts || {};
 return `
 <div class="mp-navbar">
  ${opts.back !== false ? `<div class="mp-navback" data-nav="back">${MP_ICON.back}<span>${esc(opts.backLabel || 'กลับ')}</span></div>` : ''}
  <div class="mp-navbar-title">${esc(title)}</div>
  ${opts.action ? `<div class="mp-navaction" data-action="${opts.action}">${esc(opts.actionLabel || '')}</div>` : ''}
 </div>`;
}

/* ── แอปข้อความ: รายชื่อผู้ติดต่อ ── */
function renderMessagesList() {
 const contacts = getContacts();
 const cfg = getCfg();
 const rows = contacts
  .map(ct => ({ ct, thread: cfg.threads[ct.id] }))
  .sort((a, b) => (b.thread?.updatedAt || 0) - (a.thread?.updatedAt || 0))
  .map(({ ct, thread }) => {
   const last = thread && thread.messages.length ? thread.messages[thread.messages.length - 1] : null;
   const preview = last ? (last.who === 'me' ? 'คุณ: ' : '') + last.text : 'แตะเพื่อเริ่มแชท';
   const initial = esc((ct.name || '?').slice(0, 1).toUpperCase());
   const avatarStyle = ct.avatar ? `background-image:url('${ct.avatar}')` : '';
   return `
   <div class="mp-contact-row" data-contact="${esc(ct.id)}">
    <div class="mp-avatar" style="${avatarStyle}">${ct.avatar ? '' : initial}</div>
    <div class="mp-contact-main">
     <div class="mp-contact-name">${esc(ct.name)}</div>
     <div class="mp-contact-preview">${esc(preview)}</div>
    </div>
    ${last ? `<div class="mp-contact-time">${fmtTime(last.ts)}</div>` : ''}
   </div>`;
  }).join('');
 return `
 <div class="mp-app-screen">
  ${navbar('ข้อความ', { backLabel: 'หน้าหลัก' })}
  <div class="mp-content">
   ${rows || `<div class="mp-empty">ยังไม่มีใครถูกเอ่ยชื่อในแชทหลักเลย<br>พอมีตัวละครไหนพูดหรือถูกพูดถึงในเนื้อเรื่องหลักของ ST ชื่อนั้นจะโผล่ที่นี่ให้เองอัตโนมัติ</div>`}
  </div>
 </div>`;
}

/* ── แอปข้อความ: หน้าแชท ── */
function renderMessagesThread(contactId) {
 const contact = getContact(contactId);
 if (!contact) return renderMessagesList();
 const thread = getThread(contactId);
 const bubbles = thread.messages.map(m => `<div class="mp-bubble ${m.who === 'me' ? 'me' : 'them'}${m.isError ? ' error' : ''}">${esc(m.text)}</div>`).join('');
 const typing = MP_STATE.generating ? `<div class="mp-bubble them typing"><div class="mp-dot"></div><div class="mp-dot"></div><div class="mp-dot"></div></div>` : '';
 return `
 <div class="mp-app-screen">
  ${navbar(contact.name, { backLabel: 'ข้อความ' })}
  <div class="mp-content"><div class="mp-thread">${bubbles || `<div class="mp-empty">เริ่มทักทาย ${esc(contact.name)} ได้เลย</div>`}${typing}</div></div>
  <div class="mp-inputbar">
   <textarea rows="1" placeholder="ข้อความ..." ${MP_STATE.generating ? 'disabled' : ''}></textarea>
   <div class="mp-send-btn${MP_STATE.generating ? ' disabled' : ''}" data-action="send">${MP_ICON.send}</div>
  </div>
 </div>`;
}

/* ── ตั้งค่า: หน้าแรก ── */
function renderSettingsHome(cfg) {
 const wpLabel = cfg.wallpaperCustomUrl ? 'กำหนดเอง' : (Object.keys(MP_WALLPAPERS).find(k => k === cfg.wallpaperId) ? wallpaperLabel(cfg.wallpaperId) : 'Aurora');
 const clockLabel = (MP_CLOCK_STYLES.find(s => s.id === cfg.clockStyle) || {}).label || '';
 const iconLabel = { classic: 'คลาสสิก', mono: 'โมโนโครม', pastel: 'พาสเทล', neon: 'นีออน' }[cfg.iconTheme] || 'คลาสสิก';
 return `
 <div class="mp-app-screen">
  ${navbar('ตั้งค่า', { backLabel: 'หน้าหลัก' })}
  <div class="mp-content">
   <div class="mp-group-label">รูปลักษณ์</div>
   <div class="mp-group">
    <div class="mp-cell" data-nav="settings-theme"><div class="mp-cell-label">โหมดสี</div><div class="mp-cell-value">${cfg.theme === 'dark' ? 'มืด' : 'สว่าง'} ${MP_ICON.chev}</div></div>
    <div class="mp-cell" data-nav="settings-accent"><div class="mp-cell-label">สีเน้น</div><div class="mp-cell-value"><span style="display:inline-block;width:16px;height:16px;border-radius:50%;background:${cfg.accent}"></span> ${MP_ICON.chev}</div></div>
    <div class="mp-cell" data-nav="settings-wallpaper"><div class="mp-cell-label">วอลเปเปอร์</div><div class="mp-cell-value">${esc(wpLabel)} ${MP_ICON.chev}</div></div>
    <div class="mp-cell" data-nav="settings-icontheme"><div class="mp-cell-label">ธีมไอคอนแอป</div><div class="mp-cell-value">${esc(iconLabel)} ${MP_ICON.chev}</div></div>
    <div class="mp-cell" data-nav="settings-clock"><div class="mp-cell-label">รูปแบบนาฬิกา</div><div class="mp-cell-value">${esc(clockLabel)} ${MP_ICON.chev}</div></div>
   </div>
   <div class="mp-hint">MyPhone v${MP_VERSION} — โครงมือถือ + แอปข้อความ (แอปอื่นกำลังจะตามมา)</div>
  </div>
 </div>`;
}
function wallpaperLabel(id) {
 return { aurora: 'Aurora', sunset: 'Sunset', mono: 'Mono', ocean: 'Ocean', grape: 'Grape', bloom: 'Bloom' }[id] || id;
}

function renderSettingsTheme(cfg) {
 return `
 <div class="mp-app-screen">
  ${navbar('โหมดสี', { backLabel: 'ตั้งค่า' })}
  <div class="mp-content">
   <div class="mp-group" style="margin-top:16px;">
    <div class="mp-cell" data-set-theme="dark"><div class="mp-cell-label">มืด (Dark)</div>${cfg.theme === 'dark' ? MP_ICON.check : ''}</div>
    <div class="mp-cell" data-set-theme="light"><div class="mp-cell-label">สว่าง (Light)</div>${cfg.theme === 'light' ? MP_ICON.check : ''}</div>
   </div>
  </div>
 </div>`;
}

function renderSettingsAccent(cfg) {
 const swatches = MP_ACCENTS.map(c => `<div class="mp-swatch mp-color-swatch${cfg.accent === c ? ' active' : ''}" style="background:${c}" data-set-accent="${c}">${cfg.accent === c ? `<span class="mp-check">${MP_ICON.check}</span>` : ''}</div>`).join('');
 return `
 <div class="mp-app-screen">
  ${navbar('สีเน้น', { backLabel: 'ตั้งค่า' })}
  <div class="mp-content">
   <div class="mp-swatch-grid">${swatches}</div>
   <div class="mp-hint">สีนี้จะใช้กับปุ่ม ลิงก์ และข้อความที่คุณส่งในแชท</div>
  </div>
 </div>`;
}

function renderSettingsWallpaper(cfg) {
 const wp = cfg.wallpaperCustomUrl ? `url("${cfg.wallpaperCustomUrl}")` : MP_WALLPAPERS[cfg.wallpaperId];
 const swatches = Object.keys(MP_WALLPAPERS).map(id => `<div class="mp-swatch${!cfg.wallpaperCustomUrl && cfg.wallpaperId === id ? ' active' : ''}" style="background:${MP_WALLPAPERS[id]}" data-set-wallpaper="${id}">${!cfg.wallpaperCustomUrl && cfg.wallpaperId === id ? `<span class="mp-check">${MP_ICON.check}</span>` : ''}</div>`).join('');
 return `
 <div class="mp-app-screen">
  ${navbar('วอลเปเปอร์', { backLabel: 'ตั้งค่า' })}
  <div class="mp-content">
   <div class="mp-wallpaper-preview" style="background-image:${wp}"></div>
   <div class="mp-swatch-grid">${swatches}</div>
   <div class="mp-group-label">หรือใส่ลิงก์รูปเอง</div>
   <div class="mp-group">
    <div class="mp-cell"><input class="mp-input" style="text-align:left" id="mp-wallpaper-url" placeholder="วางลิงก์รูปภาพ" value="${esc(cfg.wallpaperCustomUrl)}"></div>
   </div>
  </div>
 </div>`;
}

function renderSettingsIconTheme(cfg) {
 const opts = [
  { id: 'classic', label: 'คลาสสิก' },
  { id: 'mono', label: 'โมโนโครม' },
  { id: 'pastel', label: 'พาสเทล' },
  { id: 'neon', label: 'นีออน' },
 ];
 const rows = opts.map(o => {
  const pal = MP_ICON_THEMES[o.id];
  const preview = ['messages', 'facebook', 'discord', 'shop'].map(k => `<div style="width:22px;height:22px;border-radius:6px;background:linear-gradient(160deg,${pal[k][0]},${pal[k][1]})"></div>`).join('');
  return `<div class="mp-cell" data-set-icontheme="${o.id}"><div class="mp-cell-label">${o.label}</div><div class="mp-cell-value" style="gap:4px">${preview} ${cfg.iconTheme === o.id ? MP_ICON.check : ''}</div></div>`;
 }).join('');
 return `
 <div class="mp-app-screen">
  ${navbar('ธีมไอคอนแอป', { backLabel: 'ตั้งค่า' })}
  <div class="mp-content"><div class="mp-group" style="margin-top:16px;">${rows}</div></div>
 </div>`;
}

function renderSettingsClock(cfg) {
 const rows = MP_CLOCK_STYLES.map(s => `
  <div class="mp-cell" data-set-clock="${s.id}">
   <div class="mp-cell-label ${s.cls}" style="font-size:20px;">${fmtClock()}</div>
   <div class="mp-cell-value">${s.label} ${cfg.clockStyle === s.id ? MP_ICON.check : ''}</div>
  </div>`).join('');
 return `
 <div class="mp-app-screen">
  ${navbar('รูปแบบนาฬิกา', { backLabel: 'ตั้งค่า' })}
  <div class="mp-content"><div class="mp-group" style="margin-top:16px;">${rows}</div></div>
 </div>`;
}

/* ============================================================
   เปิด/ปิดมือถือ + event delegation ทั้งหมด
   ============================================================ */
function openPhone() {
 const overlay = document.getElementById('myphone-overlay');
 if (!overlay) return;
 overlay.classList.add('open');
 MP_STATE.locked = true;
 MP_STATE.stack = [{ screen: 'home' }];
 render();
}
function closePhone() {
 const overlay = document.getElementById('myphone-overlay');
 if (overlay) overlay.classList.remove('open');
}

function wireEvents(overlay) {
 overlay.addEventListener('click', async (e) => {
  if (e.target === overlay || e.target.closest('#myphone-close')) { closePhone(); return; }
  if (e.target.closest('#mp-lock-tap')) { MP_STATE.locked = false; render(); return; }

  const app = e.target.closest('.mp-app');
  if (app) {
   const key = app.dataset.app;
   const def = MP_APPS.find(a => a.key === key);
   if (!def) return;
   if (!def.ready) { mpToast(`"${def.name}" กำลังจะมาในเวอร์ชันถัดไป`); return; }
   if (key === 'messages') mpPush('messages-list');
   else if (key === 'settings') mpPush('settings');
   return;
  }

  const nav = e.target.closest('[data-nav]');
  if (nav) {
   const to = nav.dataset.nav;
   if (to === 'back') mpPop();
   else mpPush(to);
   return;
  }

  const contactRow = e.target.closest('[data-contact]');
  if (contactRow) { mpPush('messages-thread', { contactId: contactRow.dataset.contact }); return; }

  const themeBtn = e.target.closest('[data-set-theme]');
  if (themeBtn) { getCfg().theme = themeBtn.dataset.setTheme; saveCfg(); render(); return; }

  const accentBtn = e.target.closest('[data-set-accent]');
  if (accentBtn) { getCfg().accent = accentBtn.dataset.setAccent; saveCfg(); render(); return; }

  const wpBtn = e.target.closest('[data-set-wallpaper]');
  if (wpBtn) { const cfg = getCfg(); cfg.wallpaperId = wpBtn.dataset.setWallpaper; cfg.wallpaperCustomUrl = ''; saveCfg(); render(); return; }

  const iconBtn = e.target.closest('[data-set-icontheme]');
  if (iconBtn) { getCfg().iconTheme = iconBtn.dataset.setIcontheme; saveCfg(); render(); return; }

  const clockBtn = e.target.closest('[data-set-clock]');
  if (clockBtn) { getCfg().clockStyle = clockBtn.dataset.setClock; saveCfg(); render(); return; }

  const sendBtn = e.target.closest('[data-action="send"]');
  if (sendBtn) {
   const cur = mpCurrent();
   if (cur.screen !== 'messages-thread') return;
   const ta = overlay.querySelector('.mp-inputbar textarea');
   const text = ta ? ta.value : '';
   if (!text.trim()) return;
   if (ta) ta.value = '';
   mpSendMessage(cur.contactId, text);
   return;
  }
 });

 overlay.addEventListener('keydown', (e) => {
  if (e.target.matches('.mp-inputbar textarea') && e.key === 'Enter' && !e.shiftKey) {
   e.preventDefault();
   overlay.querySelector('[data-action="send"]')?.click();
  }
 });

 overlay.addEventListener('change', (e) => {
  if (e.target.id === 'mp-wallpaper-url') {
   const cfg = getCfg();
   cfg.wallpaperCustomUrl = e.target.value.trim();
   saveCfg();
   render();
  }
 });
}

function buildSkeleton() {
 if (document.getElementById('myphone-overlay')) return;

 const fab = document.createElement('div');
 fab.id = 'myphone-fab';
 fab.innerHTML = MP_ICON.phone;
 fab.addEventListener('click', openPhone);
 document.body.appendChild(fab);

 const overlay = document.createElement('div');
 overlay.id = 'myphone-overlay';
 overlay.innerHTML = `
  <div class="myphone-frame">
   <div id="myphone-close"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg></div>
   <div class="myphone-screen"></div>
  </div>`;
 document.body.appendChild(overlay);
 wireEvents(overlay);

 // นาฬิกาเดินต่อเนื่องขณะเปิดมือถืออยู่ (อัปเดตทุก 15 วิ พอสำหรับดูเวลา ไม่กินทรัพยากร)
 setInterval(() => { if (overlay.classList.contains('open')) render(); }, 15000);
}

/* ── ฟังอีเวนต์แชทหลักของ ST เพื่อรีเฟรชรายชื่อผู้ติดต่อแบบสด ──
   (ถ้ามีข้อความใหม่ที่เอ่ยชื่อใครระหว่างเปิดมือถืออยู่ จะโผล่ในลิสต์ทันทีไม่ต้องปิดเปิดใหม่) */
function hookMainChatEvents() {
 const c = ctx();
 if (!c || !c.eventSource || !c.event_types) { console.warn('[myphone] ไม่พบ eventSource ของ ST — รายชื่อผู้ติดต่อจะอัปเดตตอนเปิดแอปใหม่เท่านั้น'); return; }
 const refresh = () => {
  const overlay = document.getElementById('myphone-overlay');
  if (overlay && overlay.classList.contains('open')) render();
 };
 const watchEvents = ['MESSAGE_RECEIVED', 'MESSAGE_SENT', 'CHAT_CHANGED', 'MESSAGE_DELETED', 'MESSAGE_EDITED'];
 watchEvents.forEach(key => {
  const evt = c.event_types[key];
  if (evt) { try { c.eventSource.on(evt, refresh); } catch (e) { console.warn('[myphone] hook event failed', key, e); } }
 });
}

jQuery(async () => {
 buildSkeleton();
 hookMainChatEvents();
 console.log(`[myphone] v${MP_VERSION} loaded`);
});
