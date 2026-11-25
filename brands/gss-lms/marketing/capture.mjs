// Takes the real screens used in the campaign from a running demo school (npm run demo:multi, http://demo.localhost:4300).
// Nothing is mocked: every picture is the app as it is. Usage: node marketing/capture.mjs
import { chromium } from "playwright";
import fs from "node:fs";
const BASE = process.env.BASE || "http://demo.localhost:4300", API = "http://127.0.0.1:4300/api/v1";
const tok = async (role) => (await (await fetch(`${API}/auth/login-demo?role=${role}`, { method: "POST", headers: { "X-Forwarded-Host": "demo.localhost" } })).json()).data.access_token;
const get = async (role, path) => (await (await fetch(API + path, { headers: { Authorization: `Bearer ${T[role]}`, "X-Forwarded-Host": "demo.localhost" } })).json()).data;
const T = { admin: await tok("admin"), teacher: await tok("teacher"), learner: await tok("learner"), guardian: await tok("guardian") };
const myCourse = (await get("teacher", "/courses?limit=5"))?.[0]; const courseId = myCourse?.id ?? myCourse?._id;
const DESK = { w: 1280, h: 800 }, PHONE = { w: 390, h: 844 };
const b = await chromium.launch({ args: ["--no-sandbox"], executablePath: process.env.CHROMIUM_PATH || "/opt/pw-browsers/chromium" });
async function shot(name, role, path, vp, act) {
  const ctx = await b.newContext({ viewport: { width: vp.w, height: vp.h }, deviceScaleFactor: vp === PHONE ? 2 : vp.w > 1400 ? 1.2 : 1.5, serviceWorkers: "block" });
  if (role) await ctx.addInitScript((x) => { localStorage.setItem("auth_token", x); localStorage.setItem("gss-low-data", "0"); }, T[role]);
  const p = await ctx.newPage();
  await p.addStyleTag({ content: "app-toast{display:none!important}" }).catch(() => {});
  await p.goto(BASE + path, { waitUntil: "domcontentloaded" }); await p.waitForTimeout(3800);
  await p.addStyleTag({ content: "app-toast, [aria-live]>app-toast{display:none!important} *{caret-color:transparent}" });
  if (act) await act(p);
  await p.waitForTimeout(900);
  await p.screenshot({ path: `marketing/raw/${name}.png` });
  await ctx.close(); console.log("ok", name);
}
const scrollTo = (sel) => async (p) => { await p.locator(sel).first().scrollIntoViewIfNeeded().catch(() => {}); await p.evaluate((s) => document.querySelector("[aria-label='Page content']")?.scrollBy(0, 0), sel); };
const click = (re, role = "button") => async (p) => { await p.getByRole(role, { name: re }).first().click().catch(() => {}); };

// school leaders
await shot("admin-dashboard", "admin", "/app/admin/dashboard", DESK);
await shot("admin-fees", "admin", "/app/admin/fees", DESK);
await shot("admin-reports", "admin", "/app/admin/reports", DESK);
await shot("admin-classes", "admin", "/app/admin/classes", DESK);
await shot("admin-insights", "admin", "/app/admin/insights", DESK);
await shot("admin-exams", "admin", "/app/admin/exams", DESK, async (p) => { await p.locator('select[aria-label="Exam"]').selectOption({ index: 1 }); await p.waitForTimeout(1500); });
await shot("admin-timetable", "admin", "/app/admin/timetable", { w: 1600, h: 1000 }, async (p) => { await p.getByRole("button", { name: /Generate timetable/ }).click(); await p.waitForTimeout(2500); await p.evaluate(() => { const c = document.querySelector("[aria-label='Page content']"); const t = document.querySelector("[aria-label='Weekly timetable']"); if (c && t) c.scrollTop = t.getBoundingClientRect().top - c.getBoundingClientRect().top + c.scrollTop - 90; }); });
// await shot("admin-fee-tools", "admin", "/app/admin/fee-tools", DESK, click(/Statements/, "tab"));
// await shot("admin-whatsapp", "admin", "/app/admin/whatsapp", DESK);
// teachers
await shot("teacher-dashboard", "teacher", "/app/teacher/dashboard", DESK);
if (courseId) await shot("teacher-gradebook", "teacher", `/app/teacher/gradebook/${courseId}`, DESK);
await shot("teacher-planning", "teacher", "/app/teacher/planning", DESK, click(/Lesson plans/, "tab"));
await shot("teacher-qbank", "teacher", "/app/teacher/question-bank", DESK);
await shot("teacher-class-phone", "teacher", "/app/teacher/class", PHONE);
// learners
await shot("learner-dashboard", "learner", "/app/learner/dashboard", PHONE);
await shot("learner-homework", "learner", "/app/learner/homework", PHONE);
await shot("learner-grades", "learner", "/app/learner/grades", PHONE);
await shot("learner-exams", "learner", "/app/learner/exams", PHONE);
await shot("learner-fees", "learner", "/app/learner/fees", PHONE);
// parents
await shot("guardian-dashboard", "guardian", "/app/guardian/dashboard", PHONE);
await shot("guardian-paynow", "guardian", "/app/guardian/dashboard", PHONE, async (p) => { await p.getByRole("button", { name: /^Pay now/ }).first().click(); await p.waitForTimeout(1200); const f = p.locator("app-modal button.flex").first(); if (await f.count()) await f.click(); await p.waitForTimeout(800); });
await shot("guardian-forms", "guardian", "/app/guardian/forms", PHONE);
// everyone: the demo role picker
await shot("login-demo", null, "/login", PHONE);
await shot("login-demo-desktop", null, "/login", DESK);
await shot("welcome", null, "/welcome", DESK);
await b.close();
