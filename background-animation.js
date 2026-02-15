/**
 * Antigravity-style Animated Background
 * Uses Three.js to create a flow-field particle system.
 */

class BackgroundAnimation {
    constructor() {
        this.canvas = document.getElementById('bg-canvas');
        if (!this.canvas) return;

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            alpha: true,
            antialias: true
        });

        this.particlesCount = window.innerWidth < 768 ? 800 : 2000;
        this.positions = new Float32Array(this.particlesCount * 3);
        this.colors = new Float32Array(this.particlesCount * 3);

        this.init();
        this.animate();
        this.addEventListeners();
    }

    init() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.camera.position.z = 5;

        const geometry = new THREE.BufferGeometry();

        // Define colors (Indigo, Sky, Violet)
        const palette = [
            new THREE.Color('#4f46e5'), // Indigo
            new THREE.Color('#0ea5e9'), // Sky
            new THREE.Color('#8b5cf6')  // Violet
        ];

        for (let i = 0; i < this.particlesCount; i++) {
            // Random positions within a cube
            this.positions[i * 3] = (Math.random() - 0.5) * 15;
            this.positions[i * 3 + 1] = (Math.random() - 0.5) * 15;
            this.positions[i * 3 + 2] = (Math.random() - 0.5) * 10;

            // Pick a random color from palette
            const color = palette[Math.floor(Math.random() * palette.length)];
            this.colors[i * 3] = color.r;
            this.colors[i * 3 + 1] = color.g;
            this.colors[i * 3 + 2] = color.b;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(this.positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(this.colors, 3));

        // Create a custom shader or just use PointsMaterial with vertex colors
        const material = new THREE.PointsMaterial({
            size: window.innerWidth < 768 ? 0.08 : 0.05,
            vertexColors: true,
            transparent: true,
            opacity: window.innerWidth < 768 ? 0.6 : 0.4,
            sizeAttenuation: true
        });

        this.points = new THREE.Points(geometry, material);
        this.scene.add(this.points);
    }

    addEventListeners() {
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);

            // Adjust size on resize
            if (this.points.material) {
                this.points.material.size = window.innerWidth < 768 ? 0.08 : 0.05;
                this.points.material.opacity = window.innerWidth < 768 ? 0.6 : 0.4;
            }
        });
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));

        const positions = this.points.geometry.attributes.position.array;
        const time = Date.now() * 0.0001;

        for (let i = 0; i < this.particlesCount; i++) {
            const ix = i * 3;
            const iy = i * 3 + 1;
            const iz = i * 3 + 2;

            // Flow field-like movement using sine and cosine
            positions[ix] += Math.sin(time + positions[iy] * 0.5) * 0.005;
            positions[iy] += Math.cos(time + positions[ix] * 0.5) * 0.005;
            positions[iz] += Math.sin(time + positions[ix] * 0.2) * 0.002;

            // Bound checking - wrap around
            if (positions[ix] > 10) positions[ix] = -10;
            if (positions[ix] < -10) positions[ix] = 10;
            if (positions[iy] > 10) positions[iy] = -10;
            if (positions[iy] < -10) positions[iy] = 10;
        }

        this.points.geometry.attributes.position.needsUpdate = true;

        // Gentle rotation
        this.points.rotation.z += 0.0005;

        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    new BackgroundAnimation();

    // Dynamic Age Calculation
    const calculateAge = (birthDate) => {
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        return age;
    };

    const ageDisplay = document.getElementById('age-display');
    if (ageDisplay) {
        ageDisplay.textContent = calculateAge('1996-08-14');
    }
});
