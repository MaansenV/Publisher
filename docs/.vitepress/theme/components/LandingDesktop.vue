<script setup>
import '../landing.css'
import { computed, nextTick, ref } from 'vue'
import { withBase } from 'vitepress'
import VPSwitchAppearance from 'vitepress/dist/client/theme-default/components/VPSwitchAppearance.vue'

const assetStoreUrl = 'https://assetstore.unity.com/packages/tools/game-toolkits/easy-fp-full-body-controller-357454'

const tabs = [
  {
    id: 'overview',
    label: 'Overview',
    detail: 'A first-person and third-person full-body controller for Unity URP projects.',
    proof: 'Real package · v1.1.0',
    previewTag: 'OVERVIEW',
    previewColor: 'cobalt',
    previewImg: '/fp-movement.png',
    previewAlt: 'Easy FP Full Body Controller: full-body movement states (idle, walk, sprint, crouch)',
  },
  {
    id: 'features',
    label: 'Features',
    detail: 'Procedural IK, dynamic items, FPCutter mesh cutting, and an extensible event API.',
    proof: 'Documented against shipped source',
    previewTag: 'CAPABILITIES',
    previewColor: 'vermilion',
    previewImg: '/fp-body-awareness.png',
    previewAlt: 'Easy FP Full Body Controller: true FPS body awareness in-game view',
  },
  {
    id: 'integrations',
    label: 'Integrations',
    detail: 'Built for Unity 6.5+ with URP, Cinemachine, and the Input System.',
    proof: 'Requirements shown before setup',
    previewTag: 'REQUIREMENTS',
    previewColor: 'yellow',
    previewImg: '/fp-integrations.png',
    previewAlt: 'Easy FP Full Body Controller: Setup Wizard steps 1-3, select player root, assign model, find bones',
  },
  {
    id: 'setup',
    label: 'Setup',
    detail: 'A guided 7-step Setup Wizard takes the project from blank scene to configured controller.',
    proof: 'Quick Start verified for v1.1.0',
    previewTag: 'SETUP WIZARD',
    previewColor: 'cobalt',
    previewImg: '/fp-setup.png',
    previewAlt: 'Easy FP Full Body Controller: Setup Wizard steps 4-6, add player scripts, setup helpers, connect systems',
  },
]

const activeTabId = ref(tabs[0].id)
const activeTab = computed(() => tabs.find((t) => t.id === activeTabId.value))

const tabRefs = ref([])
const contactForm = ref(null)
const contactState = ref('idle')
const contactMessage = ref('')
const isContactSending = computed(() => contactState.value === 'sending')
const fieldErrors = ref({})
const validationAttempted = ref(false)
const fieldLabels = {
  name: 'Name',
  email: 'Email',
  subject: 'Subject',
  message: 'Message',
}

function fieldError(field) {
  if (field.validity.valueMissing) return `${fieldLabels[field.name]} is required.`
  if (field.validity.typeMismatch) return 'Enter a valid email address.'
  return `Check ${fieldLabels[field.name].toLowerCase()}.`
}

function setFieldError(field) {
  const nextErrors = { ...fieldErrors.value }
  if (field.validity.valid) {
    delete nextErrors[field.name]
  } else {
    nextErrors[field.name] = fieldError(field)
  }
  fieldErrors.value = nextErrors
}

function handleInvalid(event) {
  validationAttempted.value = true
  setFieldError(event.target)
}

function handleFieldInput(event) {
  if (validationAttempted.value && event.target.matches('.field-input')) setFieldError(event.target)
}

function clearFieldErrors() {
  fieldErrors.value = {}
  validationAttempted.value = false
}


function setTabRef(element, index) {
  if (element) tabRefs.value[index] = element
}

function selectTab(id) {
  activeTabId.value = id
}

function focusTab(index) {
  const nextIndex = (index + tabs.length) % tabs.length
  activeTabId.value = tabs[nextIndex].id
  nextTick(() => tabRefs.value[nextIndex]?.focus())
}

function onTabKeydown(event, index) {
  if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
    event.preventDefault()
    focusTab(index + 1)
  } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
    event.preventDefault()
    focusTab(index - 1)
  } else if (event.key === 'Home') {
    event.preventDefault()
    focusTab(0)
  } else if (event.key === 'End') {
    event.preventDefault()
    focusTab(tabs.length - 1)
  }
}

async function submitContact() {
  const form = contactForm.value
  if (!form || isContactSending.value) return
  if (!form.checkValidity()) {
    validationAttempted.value = true
    form.querySelectorAll('.field-input').forEach((field) => {
      if (!field.validity.valid) setFieldError(field)
    })
    await nextTick()
    const firstInvalid = form.querySelector('.field-input[aria-invalid="true"]')
    if (firstInvalid) firstInvalid.focus()
    return
  }

  const formData = new FormData(form)
  if (String(formData.get('_honey') || '').trim()) {
    contactState.value = 'success'
    contactMessage.value = 'Message sent. We will get back to you soon.'
    form.reset()
    clearFieldErrors()
    return
  }

  contactState.value = 'sending'
  contactMessage.value = 'Sending your message…'

  try {
    const response = await fetch('https://formsubmit.co/ajax/dinlinwin@gmail.com', {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: formData,
    })

    if (!response.ok) throw new Error('Contact request failed')

    contactState.value = 'success'
    contactMessage.value = 'Message sent. We will get back to you soon.'
    form.reset()
    clearFieldErrors()
  } catch {
    contactState.value = 'error'
    contactMessage.value = 'Could not send your message. Please try again or email dinlinwin@gmail.com directly.'
  }
}
</script>

<template>
  <div id="vedaloiv-landing">
    <a class="skip-link" href="#main-content">Skip to content</a>

    <nav class="nav" aria-label="Primary navigation">
      <a href="#top" class="nav-brand" aria-label="vedaloiv home">
        <span class="brand-mark" aria-hidden="true"></span>
        <span>vedaloiv</span>
      </a>
      <div class="nav-links">
        <a href="#assets">Assets</a>
        <a href="#contact">Contact</a>
        <a href="easy-fp-full-body-controller/">Docs</a>
      </div>
      <VPSwitchAppearance class="nav-appearance" />
      <a class="nav-cta" :href="assetStoreUrl" target="_blank" rel="noopener" aria-label="Get it on the Asset Store">
        <span class="nav-cta-label">Get it on the Asset Store</span>
        <span aria-hidden="true">↗</span>
      </a>
    </nav>

    <main id="main-content" tabindex="-1">
      <section id="top" class="hero">
        <div class="hero-copy">
          <h1 class="hero-title">
            Full-body<br />
            <span class="hero-accent">control</span><br />
            for Unity<span class="hero-dot">.</span>
          </h1>
          <p class="hero-sub">
            Easy FP Full Body Controller brings guided setup, procedural IK, and documented character control to Unity URP projects.
          </p>
          <div class="hero-actions">
            <a class="btn btn--primary" :href="assetStoreUrl" target="_blank" rel="noopener">Get it on the Asset Store <span aria-hidden="true">↗</span></a>
            <a class="btn btn--outline" href="easy-fp-full-body-controller/">Read the docs <span aria-hidden="true">→</span></a>
          </div>
          <p class="hero-note">
            <span class="status-mark" aria-hidden="true"></span>
            On-site publisher: vedaloiv · v1.1.0
          </p>
        </div>

        <aside id="assets" class="asset-dossier" aria-label="Selected asset">
          <div class="dossier-topline">
            <span>ASSET CATALOG / 1 OF 1</span>
            <span class="dossier-status">ACTIVE · v1.1.0</span>
          </div>
          <div class="dossier-heading">
            <div class="asset-glyph" aria-hidden="true">EF</div>
            <div>
              <h2>Easy FP Full Body Controller</h2>
              <p>site: vedaloiv · <span class="dossier-listing">listing: Maansen</span> · <span>v1.1.0</span> · <strong>URP demo + FPCutter shader</strong> · docs verified 2026-07</p>
            </div>
          </div>
          <div class="dossier-preview" :data-accent="activeTab.previewColor">
            <span class="preview-accent" :data-accent="activeTab.previewColor" aria-hidden="true"></span>
            <img
              :src="withBase(activeTab.previewImg)"
              :alt="activeTab.previewAlt"
              decoding="async"
            />
            <span class="preview-label">{{ activeTab.previewTag }}</span>
          </div>
          <div class="dossier-tabs" role="tablist" aria-label="Asset details">
            <button
              v-for="(tab, index) in tabs"
              :id="`tab-${tab.id}`"
              :key="tab.id"
              :ref="(element) => setTabRef(element, index)"
              class="dossier-tab"
              :class="{ 'is-active': activeTabId === tab.id }"
              type="button"
              role="tab"
              :tabindex="activeTabId === tab.id ? 0 : -1"
              :aria-selected="activeTabId === tab.id"
              :aria-controls="`panel-${tab.id}`"
              @click="selectTab(tab.id)"
              @keydown="onTabKeydown($event, index)"
            >
              {{ tab.label }}
            </button>
          </div>
          <div
            v-for="tab in tabs"
            v-show="activeTabId === tab.id"
            :id="`panel-${tab.id}`"
            :key="`panel-${tab.id}`"
            class="dossier-panel"
            role="tabpanel"
            :aria-labelledby="`tab-${tab.id}`"
            aria-live="polite"
          >
            <div class="dossier-panel-copy">
              <span class="panel-label">{{ tab.proof }}</span>
              <p>{{ tab.detail }}</p>
            </div>
          </div>
          <div class="dossier-tags" aria-label="Compatibility">
            <span>URP demo + FPCutter</span><span>Unity 6.5+</span><span>Cinemachine</span><span>Input System</span>
          </div>
          <div class="dossier-actions">
            <a class="dossier-action dossier-action--primary" :href="assetStoreUrl" target="_blank" rel="noopener">
              Get it on the Asset Store <span aria-hidden="true">↗</span>
            </a>
            <a class="dossier-action" href="easy-fp-full-body-controller/">Read the docs <span aria-hidden="true">→</span></a>
          </div>
        </aside>
      </section>


      <section id="contact" class="section contact-section">
        <div class="section-inner contact-layout">
          <div class="contact-copy">
            <h2 class="section-title">Need a hand<span class="hero-dot">?</span></h2>
            <p>Questions, support, or feedback about Easy FP Full Body Controller or future vedaloiv tools. Write to us.</p>
            <span class="contact-stamp">SUPPORT / PUBLISHER / 2026</span>
          </div>
          <form
            ref="contactForm"
            class="contact-form"
            action="https://formsubmit.co/dinlinwin@gmail.com"
            method="POST"
            :aria-busy="isContactSending"
            @submit.prevent="submitContact"
            @invalid.capture="handleInvalid"
            @input="handleFieldInput"
          >
            <input type="hidden" name="_subject" value="New message from vedaloiv publisher page" />
            <input type="hidden" name="_template" value="table" />
            <input type="hidden" name="_next" value="https://maansenv.github.io/Publisher/" />
            <input class="field-honeypot" type="text" name="_honey" tabindex="-1" autocomplete="off" aria-hidden="true" />
            <div class="field">
              <label class="field-label" for="c-name">Name</label>
              <input
                class="field-input"
                id="c-name"
                name="name"
                type="text"
                placeholder="Your name"
                required
                :aria-invalid="fieldErrors.name ? 'true' : 'false'"
                aria-describedby="c-name-error"
              />
              <p id="c-name-error" class="field-error" aria-live="polite">{{ fieldErrors.name }}</p>
            </div>
            <div class="field">
              <label class="field-label" for="c-email">Email</label>
              <input
                class="field-input"
                id="c-email"
                name="email"
                type="email"
                placeholder="your@email.com"
                required
                :aria-invalid="fieldErrors.email ? 'true' : 'false'"
                aria-describedby="c-email-error"
              />
              <p id="c-email-error" class="field-error" aria-live="polite">{{ fieldErrors.email }}</p>
            </div>
            <div class="field">
              <label class="field-label" for="c-subject">Subject</label>
              <input
                class="field-input"
                id="c-subject"
                name="subject"
                type="text"
                placeholder="Message subject"
                maxlength="140"
                required
                :aria-invalid="fieldErrors.subject ? 'true' : 'false'"
                aria-describedby="c-subject-error"
              />
              <p id="c-subject-error" class="field-error" aria-live="polite">{{ fieldErrors.subject }}</p>
            </div>
            <div class="field">
              <label class="field-label" for="c-message">Message</label>
              <textarea
                class="field-input field-textarea"
                id="c-message"
                name="message"
                rows="4"
                placeholder="Your message"
                maxlength="5000"
                required
                :aria-invalid="fieldErrors.message ? 'true' : 'false'"
                aria-describedby="c-message-error"
              ></textarea>
              <p id="c-message-error" class="field-error" aria-live="polite">{{ fieldErrors.message }}</p>
            </div>
            <button class="btn btn--primary contact-send" type="submit" :disabled="isContactSending">
              {{ isContactSending ? 'Sending…' : 'Send message' }}
            </button>
            <p v-if="contactState !== 'idle'" class="contact-feedback" :class="`contact-feedback--${contactState}`" :role="contactState === 'error' ? 'alert' : 'status'" aria-live="polite">
              {{ contactMessage }}
            </p>
          </form>
        </div>
      </section>
    </main>

    <footer class="footer">
      <div class="footer-inner">
        <div class="footer-brand">
          <span class="brand-mark" aria-hidden="true"></span>
          <div>
            <p class="footer-title">© 2026 vedaloiv · Unity Asset Store Publisher</p>
            <p class="footer-note">Site: vedaloiv · Asset Store listing: Maansen</p>
          </div>
        </div>
        <nav class="footer-links" aria-label="Footer navigation">
          <a href="#assets">Assets</a>
          <a href="easy-fp-full-body-controller/">Docs</a>
          <a href="#contact">Contact</a>
          <a href="https://github.com/MaansenV" target="_blank" rel="noopener">GitHub <span aria-hidden="true">↗</span></a>
          <a href="#top">Back to top <span aria-hidden="true">↑</span></a>
        </nav>
        <a class="btn btn--primary footer-cta" :href="assetStoreUrl" target="_blank" rel="noopener">
          Get it on the Asset Store <span aria-hidden="true">↗</span>
        </a>
      </div>
    </footer>
  </div>
</template>
