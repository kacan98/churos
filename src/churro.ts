export function renderChurroIcon(containerId: string): void {
    const container = document.getElementById(containerId)
    if (container) {
        const img = document.createElement('img')
        img.src = import.meta.env.BASE_URL + 'churro.png'
        img.alt = 'Churro'
        img.className = 'churro-image'
        container.appendChild(img)
    }
}
