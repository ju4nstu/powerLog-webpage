const btn = document.getElementById('settings-button')
const popover = document.getElementById('settings-popover')
const mainMenu = document.getElementById('settings-menu')

const parents = [
    { button: document.getElementById('unit-parent'), submenu: document.getElementById('unit-submenu') },
     { button: document.getElementById('theme-parent'), submenu: document.getElementById('theme-submenu') }
]

function openMain() {
    popover.hidden = false
    btn.setAttribute('aria-expanded', 'true')
    document.addEventListener('pointerdown', onDocPointerDown)
    document.addEventListener('keydown', onDocKeyDown)
}

function closeMain() {
    popover.hidden = true;
    btn.setAttribute('aria-expanded', 'false');
    document.removeEventListener('pointerdown', onDocPointerDown);
    document.removeEventListener('keydown', onDocKeyDown);
}

function toggleMain() {
    if (popover.hidden) {
        openMain();
    } else {
        closeMain();
    }
}

function onDocPointerDown(e) {
    if (!popover.contains(e.target) && e.target !== btn) {
        closeMain()
    }
}

function onDocKeyDown(e) {
    if (e.key === 'Escape') {
        closeMain()
    }
}

btn.addEventListener('click', toggleMain)

// hover to open submenus; leave to close
parents.forEach(({button, submenu}) => {
    button.addEventListener('mouseenter', () => { 
        if (popover.hidden) return
        parents.forEach(p => {p.submenu.hidden = true; p.button.setAttribute('aria-expanded', 'false')})
        submenu.hidden = false
        button.setAttribute('aria-expanded', 'true') 
    })
    // keep submenu open if hovering submenu
    submenu.addEventListener('mouseenter', () => {
        if (popover.hidden) return
        submenu.hidden = false
        button.setAttribute('aria-expanded', 'true')
    })
    // close submenu when leaving both parent and submenu
    const closeIfOutside = (event) => {
        const related = event.relatedTarget
        if (!button.contains(related) && !submenu.contains(related)) {
            submenu.hidden = true
            button.setAttribute('aria-expanded', 'false')
        }
    }
    button.addEventListener('mouseleave', closeIfOutside)
    submenu.addEventListener('mouseleave', closeIfOutside)
})

// Click on a radio option updates aria-checked and visual checkmark
mainMenu.addEventListener('click', (e) => {
    const option = e.target.closest('[role="menuitemradio"]')
    if (!option) return

    const setting = option.dataset.setting // "unit" or "theme"
    const value = option.dataset.value

    // within the same submenu, uncheck others and check this one
    const submenu = option.closest('[role="menu"]')
    submenu.querySelectorAll('[role="menuitemradio"]').forEach(item => {
        item.setAttribute('aria-checked', String(el == option))
    })
    const label = item.textContent.replace(/^✓\s*/,'').trim()
    item.textContent = (item === option ? `✓ ${label}` : label)
})

// TODO: here you can persist the setting (e.g., localStorage, apply theme, convert units)
    // Example:
    /*if (setting === 'theme') {
      document.documentElement.dataset.theme = value; // e.g., [data-theme="dark"]
    } else if (setting === 'unit') {
      document.documentElement.dataset.unit = value;  // e.g., [data-unit="kg"]
    }*/



