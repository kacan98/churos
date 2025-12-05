import './style.css'
import confetti from 'canvas-confetti'
import { renderChurroIcon } from './churro'

const CHURROS_HOUR = 13
const CHURROS_MINUTE = 15

let hasReachedZero = false
let celebrationTriggered = false

function init() {
    createParticles()
    createFallingChurrosContainer()
    initChurroIcon()
    requestNotificationPermission()
    updateCountdown()
    setInterval(updateCountdown, 1000)
}

function requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission()
    }
}

function sendNotification() {
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('The prophecy is fulfilled.', {
            body: 'The churros have arrived. Join us.',
            icon: import.meta.env.BASE_URL + 'churro.png',
            requireInteraction: true
        })
    }
}

function createParticles() {
    const particlesContainer = document.querySelector('.particles')
    if (!particlesContainer) return

    for (let i = 0; i < 15; i++) {
        const particle = document.createElement('div')
        particle.className = 'particle'
        particle.style.left = `${Math.random() * 100}vw`
        particle.style.animationDelay = `${Math.random() * 15}s`
        particle.style.animationDuration = `${15 + Math.random() * 10}s`
        particlesContainer.appendChild(particle)
    }
}

const pageOpenedAt = Date.now()

function createFallingChurrosContainer() {
    const container = document.createElement('div')
    container.className = 'falling-churros'
    container.id = 'fallingChurros'
    document.body.appendChild(container)

    // Start spawning churros
    setInterval(spawnChurros, 2000)
}

function addFallingChurro() {
    const container = document.getElementById('fallingChurros')
    if (!container) return

    const churro = document.createElement('img')
    churro.className = 'falling-churro'
    churro.src = import.meta.env.BASE_URL + 'churro-fall.png'
    churro.alt = ''
    churro.style.left = `${Math.random() * 100}vw`
    churro.style.animationDelay = `${Math.random() * 2}s`
    churro.style.animationDuration = `${8 + Math.random() * 6}s`
    churro.style.width = `${30 + Math.random() * 40}px`
    churro.style.opacity = `${0.4 + Math.random() * 0.4}`
    container.appendChild(churro)

    setTimeout(() => churro.remove(), 16000)
}

function spawnChurros() {
    const secondsOpen = (Date.now() - pageOpenedAt) / 1000
    const churrosToAdd = Math.min(Math.floor(secondsOpen * 5), 300)

    for (let i = 0; i < churrosToAdd; i++) {
        addFallingChurro()
    }
}

function initChurroIcon() {
    renderChurroIcon('churroIcon')
}

function triggerCelebration() {
    if (celebrationTriggered) return
    celebrationTriggered = true

    document.body.classList.add('celebrating')
    document.getElementById('churroIcon')?.classList.add('celebrating')

    // Fire confetti multiple times for epic effect
    const duration = 5000
    const end = Date.now() + duration

    const colors = ['#D2691E', '#8B4513', '#FFD700', '#FF8C00', '#FFA500']

    const frame = () => {
        confetti({
            particleCount: 3,
            angle: 60,
            spread: 55,
            origin: { x: 0, y: 0.7 },
            colors: colors
        })
        confetti({
            particleCount: 3,
            angle: 120,
            spread: 55,
            origin: { x: 1, y: 0.7 },
            colors: colors
        })

        if (Date.now() < end) {
            requestAnimationFrame(frame)
        }
    }
    frame()

    // Big burst in the center
    confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 },
        colors: colors
    })

    // Play celebration sound
    playCelebrationSound()

    // Say churros phrases
    sayChurrosPhrases()

    // Send browser notification
    sendNotification()
}

function playCelebrationSound() {
    // Create a fun celebration sound using Web Audio API
    const audioContext = new (window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()

    // Play a cheerful arpeggio
    const notes = [523.25, 659.25, 783.99, 1046.5] // C5, E5, G5, C6
    const startTime = audioContext.currentTime

    notes.forEach((freq, index) => {
        const oscillator = audioContext.createOscillator()
        const gainNode = audioContext.createGain()

        oscillator.connect(gainNode)
        gainNode.connect(audioContext.destination)

        oscillator.type = 'sine'
        oscillator.frequency.value = freq

        gainNode.gain.setValueAtTime(0.3, startTime + index * 0.15)
        gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + index * 0.15 + 0.5)

        oscillator.start(startTime + index * 0.15)
        oscillator.stop(startTime + index * 0.15 + 0.5)
    })

    // Add a fun "ding" sound
    setTimeout(() => {
        const oscillator = audioContext.createOscillator()
        const gainNode = audioContext.createGain()

        oscillator.connect(gainNode)
        gainNode.connect(audioContext.destination)

        oscillator.type = 'triangle'
        oscillator.frequency.value = 880

        gainNode.gain.setValueAtTime(0.4, audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1)

        oscillator.start()
        oscillator.stop(audioContext.currentTime + 1)
    }, 600)
}

function sayChurrosPhrases() {
    if (!('speechSynthesis' in window)) return

    const phrases = [
        'The prophecy is fulfilled.',
        'They are here.',
        'You cannot escape the churro.',
        'Join us.'
    ]

    let delay = 1000 // Start after the sound effect

    phrases.forEach((phrase) => {
        setTimeout(() => {
            const utterance = new SpeechSynthesisUtterance(phrase)
            utterance.rate = 0.7
            utterance.pitch = 0.6
            window.speechSynthesis.speak(utterance)
        }, delay)
        delay += 3000
    })
}

function updateCountdown() {
    const now = new Date()
    const target = new Date()
    target.setHours(CHURROS_HOUR, CHURROS_MINUTE, 0, 0)

    const titleEl = document.getElementById('title')
    const subtitleEl = document.getElementById('subtitle')
    const messageEl = document.getElementById('waitMessage')
    const hoursEl = document.getElementById('hours')
    const minutesEl = document.getElementById('minutes')
    const secondsEl = document.getElementById('seconds')

    if (!titleEl || !subtitleEl || !messageEl || !hoursEl || !minutesEl || !secondsEl) return

    if (now >= target) {
        // Trigger celebration once when we first reach zero
        if (!hasReachedZero) {
            hasReachedZero = true
            triggerCelebration()
        }

        titleEl.textContent = 'Churros Time!'
        subtitleEl.textContent = 'Time since churros...'
        messageEl.textContent = 'Hope you enjoyed them!'

        const diff = now.getTime() - target.getTime()

        const hours = Math.floor(diff / (1000 * 60 * 60))
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((diff % (1000 * 60)) / 1000)

        hoursEl.textContent = hours.toString().padStart(2, '0')
        minutesEl.textContent = minutes.toString().padStart(2, '0')
        secondsEl.textContent = seconds.toString().padStart(2, '0')
        return
    }

    const diff = target.getTime() - now.getTime()

    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((diff % (1000 * 60)) / 1000)

    hoursEl.textContent = hours.toString().padStart(2, '0')
    minutesEl.textContent = minutes.toString().padStart(2, '0')
    secondsEl.textContent = seconds.toString().padStart(2, '0')

    // Update message based on time remaining
    if (hours === 0 && minutes < 5) {
        messageEl.textContent = 'Almost there! Get ready!'
        messageEl.style.fontWeight = '600'
    } else if (hours === 0 && minutes < 30) {
        messageEl.textContent = 'Not long now...'
    } else {
        messageEl.textContent = 'Almost there...'
    }
}

// Start the app
init()
