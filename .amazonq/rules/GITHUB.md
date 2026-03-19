# 📦 GitHub RULES

## 🚫 DO NOT PUSH

* Never run `git push`
* Only stage and commit locally

---

## ✅ Always Stage Everything

Before committing, always run:

```bash
git add .
```

---

## 🧠 Commit Message Rules (VERY IMPORTANT)

Your commit message **must reflect actual changes in the codebase**.

### Format:

```bash
<type>: <short description>
```

### Allowed Types:

* `feat:` → New feature
* `fix:` → Bug fix
* `refactor:` → Code cleanup / restructuring (no behavior change)
* `style:` → UI / CSS / design changes
* `docs:` → Documentation only
* `chore:` → Config, build setup, dependencies

---

## ✍️ Examples

### New feature

```bash
feat: add expense category filtering
```

### Bug fix

```bash
fix: resolve NaN issue in total balance calculation
```

### UI update

```bash
style: improve dark mode card contrast
```

### Refactor

```bash
refactor: simplify transaction state management
```

### Config / deployment

```bash
chore: update netlify.toml build settings
```

---

## ❌ Avoid These

* ❌ update
* ❌ changes
* ❌ fix stuff
* ❌ final commit
* ❌ empty messages

---

## 🧩 Smart Commit Rule

Before writing a commit message, ask:

> “What actually changed?”

Then summarize it in **one clear line**.

---

## ⚙️ Full Workflow (Your Setup)

1. Make changes
2. Stage files

   ```bash
   git add .
   ```
3. Commit with proper message

   ```bash
   git commit -m "feat: add monthly expense chart"
   ```
4. ❌ Do NOT push

---

## 🔥 Pro Tip

If multiple things changed, **prioritize the main change**:

```bash
feat: add budget alerts and improve dashboard layout
```
