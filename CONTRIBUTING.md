# 🤝 Contributing to ATLAS

Hvala što želiš da doprineseseš ATLAS projektu! 🎉

## 📋 Sadržaj

- [Code of Conduct](#-code-of-conduct)
- [Kako mogu pomoći?](#-kako-mogu-pomoi)
- [Development Setup](#-development-setup)
- [Coding Guidelines](#-coding-guidelines)
- [Commit Guidelines](#-commit-guidelines)
- [Pull Request Process](#-pull-request-process)
- [Bug Reports](#-bug-reports)
- [Feature Requests](#-feature-requests)

---

## 📜 Code of Conduct

- Budi profesionalan i respektfull
- Prihvataj konstruktivnu kritiku
- Fokusiraj se na ono što je najbolje za zajednicu
- Pokaži empatiju prema drugim članovima

---

## 💡 Kako mogu pomoći?

### 🐛 Bug Fixes
Pronašli ste bug? Super!
1. Provjeri da već nije prijavljen u [Issues](https://github.com/flashboy-max/ATLAS_Operateri/issues)
2. Kreiraj novi issue sa detaljima
3. Ako možeš, submit-uj PR sa fix-om

### ✨ New Features
Imaš ideju za novu funkcionalnost?
1. Otvori [Discussion](https://github.com/flashboy-max/ATLAS_Operateri/discussions)
2. Objasni feature i use case
3. Čekaj feedback prije nego počneš raditi

### 📚 Documentation
Dokumentacija je uvijek dobrodošla:
- Ispravljanje typo-a
- Dodavanje primjera
- Prevod na druge jezike
- Poboljšanje objašnjenja

### 🎨 Design
- UI/UX poboljšanja
- Novi dizajn komponenti
- Accessibility improvements

---

## 🔧 Development Setup

### 1. Fork & Clone

```bash
# Fork na GitHub-u, zatim:
git clone https://github.com/YOUR_USERNAME/ATLAS_Operateri.git
cd ATLAS_Operateri
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Create Branch

```bash
git checkout -b feature/amazing-feature
# ili
git checkout -b fix/bug-description
```

### 4. Make Changes

- Prati coding guidelines
- Dodaj komentare gdje je potrebno
- Testiraj promjene

### 5. Test

```bash
# Pokreni server
npm run server

# Testiraj u browseru
# http://localhost:3000

# Provijeri različite user role
# - SUPERADMIN
# - ADMIN
# - KORISNIK
```

### 6. Commit

```bash
git add .
git commit -m "feat: add amazing feature"
```

### 7. Push & PR

```bash
git push origin feature/amazing-feature
# Idi na GitHub i open Pull Request
```

---

## 📝 Coding Guidelines

### JavaScript Style

```javascript
// ✅ GOOD - Descriptive names, clear logic
function getUserById(userId) {
    if (!userId) {
        throw new Error('User ID is required');
    }
    
    const user = users.find(u => u.id === userId);
    
    if (!user) {
        throw new Error(`User not found: ${userId}`);
    }
    
    return user;
}

// ❌ BAD - Unclear names, no validation
function getU(id) {
    return users.find(u => u.id === id);
}
```

### CSS Style

```css
/* ✅ GOOD - BEM-like naming, clear structure */
.user-card {
    display: flex;
    gap: var(--spacing-md);
}

.user-card__avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
}

.user-card__name {
    font-weight: 600;
    color: var(--text-primary);
}

/* ❌ BAD - Generic names, magic numbers */
.card {
    display: flex;
    gap: 12px;
}

.img {
    width: 40px;
}
```

### HTML Style

```html
<!-- ✅ GOOD - Semantic, accessible -->
<section class="operators-list" aria-label="Lista operatera">
    <h2 class="section-title">Operateri</h2>
    
    <button 
        class="btn btn-primary" 
        aria-label="Dodaj novog operatera"
        onclick="openAddOperatorModal()">
        <i class="fas fa-plus" aria-hidden="true"></i>
        Dodaj operatera
    </button>
</section>

<!-- ❌ BAD - Non-semantic, not accessible -->
<div class="list">
    <div class="title">Operateri</div>
    <div onclick="openModal()">Dodaj</div>
</div>
```

### Best Practices

- ✅ Koristi `const` i `let`, ne `var`
- ✅ Async/await umjesto callback hell-a
- ✅ Error handling sa try/catch
- ✅ Validate user input
- ✅ Comment complex logic
- ✅ Use CSS variables za boje i spacing
- ✅ Mobile-first responsive design
- ✅ Accessibility (ARIA labels, keyboard navigation)

---

## 📋 Commit Guidelines

Koristi [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat**: Nova funkcionalnost
- **fix**: Bug fix
- **docs**: Dokumentacija
- **style**: Formatting, missing semi-colons, etc
- **refactor**: Refactoring koda
- **test**: Dodavanje testova
- **chore**: Maintenance taskovi

### Examples

```bash
# Nova funkcionalnost
git commit -m "feat(auth): add 2FA support"

# Bug fix
git commit -m "fix(operators): resolve duplicate entries"

# Dokumentacija
git commit -m "docs(readme): update installation steps"

# Style promjene
git commit -m "style(dashboard): improve card spacing"

# Refactoring
git commit -m "refactor(api): simplify user validation"

# Maintenance
git commit -m "chore(deps): update express to 4.18.2"
```

### Commit Message Rules

- ✅ Use present tense ("add feature" not "added feature")
- ✅ Use imperative mood ("move cursor to..." not "moves cursor to...")
- ✅ Limit first line to 72 characters
- ✅ Reference issues: "fix(auth): resolve login bug (#123)"
- ✅ Add body for complex changes

---

## 🔄 Pull Request Process

### PR Checklist

- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex logic
- [ ] Documentation updated
- [ ] No merge conflicts
- [ ] Tested locally
- [ ] All user roles tested (if applicable)

### PR Template

```markdown
## 📋 Description
Brief description of changes

## 🎯 Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Code refactoring

## 🧪 Testing
- [ ] Tested as SUPERADMIN
- [ ] Tested as ADMIN
- [ ] Tested as KORISNIK
- [ ] Tested on mobile
- [ ] Tested in multiple browsers

## 📸 Screenshots
(if applicable)

## 🔗 Related Issues
Fixes #123
Related to #456
```

### Review Process

1. Maintainer-i će review-ati PR
2. Moguće su izmjene/komentari
3. Nakon approval-a, PR će biti merged
4. Your contribution će biti navedena u Changelog

---

## 🐛 Bug Reports

Koristi [Issue Template](https://github.com/flashboy-max/ATLAS_Operateri/issues/new):

```markdown
## 🐛 Bug Description
Clear and concise description

## 🔄 Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

## ✅ Expected Behavior
What should happen

## ❌ Actual Behavior
What actually happens

## 📸 Screenshots
(if applicable)

## 🖥️ Environment
- Browser: Chrome 120.0
- OS: Windows 11
- User Role: ADMIN
- Version: 3.0.0

## 📝 Additional Context
Any other relevant info
```

---

## ✨ Feature Requests

```markdown
## 💡 Feature Description
Clear description of the feature

## 🎯 Problem it Solves
What problem does this solve?

## 💭 Proposed Solution
How should this work?

## 🎨 Alternatives Considered
Other ways to solve this

## 📊 Priority
- [ ] Critical
- [ ] High
- [ ] Medium
- [ ] Low

## 👥 Who Benefits?
- [ ] SUPERADMIN
- [ ] ADMIN
- [ ] KORISNIK
- [ ] All users

## 📸 Mockups/Examples
(if applicable)
```

---

## 🏗️ Project Structure

```
src/
├── client/          # Frontend code
│   ├── pages/       # HTML pages
│   ├── styles/      # CSS files
│   └── scripts/     # JS files
├── server/          # Backend code
│   ├── routes/      # API routes
│   └── middleware/  # Express middleware
├── data/            # Data storage
└── docs/            # Documentation
```

---

## 🧪 Testing Guidelines

### Manual Testing

1. **Authentication Flow**
   - Login sa različitim rolama
   - Logout
   - Session expiration
   - Invalid credentials

2. **CRUD Operations**
   - Create operatera
   - Read operatera
   - Update operatera
   - Delete operatera

3. **Permissions**
   - SUPERADMIN access
   - ADMIN limitations
   - KORISNIK restrictions

4. **UI/UX**
   - Mobile responsive
   - Keyboard navigation
   - Form validation
   - Error messages

### Browser Testing

Test u minimum 2 browsera:
- Chrome
- Firefox
- Safari (ako imaš macOS)
- Edge

---

## 📞 Questions?

- 💬 [GitHub Discussions](https://github.com/flashboy-max/ATLAS_Operateri/discussions)
- 🐛 [GitHub Issues](https://github.com/flashboy-max/ATLAS_Operateri/issues)
- 📧 Email: support@atlas-project.ba

---

## 🙏 Thank You!

Svaki doprinos je cijenjen! 

- ⭐ Star projekat ako ti se sviđa
- 🔗 Share sa drugima
- 📢 Raspravlja o projektu
- 👨‍💻 Contribut-uj

---

<div align="center">

**Happy Coding! 🎉**

Made with ❤️ by ATLAS Project Team

</div>
