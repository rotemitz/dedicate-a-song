/**
 * Confetti Animation Module
 * Creates a celebratory confetti explosion effect
 */

class ConfettiAnimation {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.isRunning = false;
        this.animationId = null;
        
        // Configuration
        this.config = {
            particleCount: 150,
            colors: [
                '#e85d75', // Primary pink
                '#ff7b93', // Light pink
                '#f9a825', // Gold
                '#ffd95a', // Light gold
                '#ffffff', // White
                '#64b5f6', // Light blue
                '#ba68c8', // Purple
            ],
            gravity: 0.3,
            friction: 0.99,
            duration: 4000, // ms
        };
        
        this.resize();
        window.addEventListener('resize', () => this.resize());
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    createParticle(x, y) {
        const angle = Math.random() * Math.PI * 2;
        const velocity = 8 + Math.random() * 8;
        
        return {
            x: x,
            y: y,
            vx: Math.cos(angle) * velocity,
            vy: Math.sin(angle) * velocity - 5,
            color: this.config.colors[Math.floor(Math.random() * this.config.colors.length)],
            size: 4 + Math.random() * 6,
            rotation: Math.random() * 360,
            rotationSpeed: (Math.random() - 0.5) * 10,
            shape: Math.random() > 0.5 ? 'rect' : 'circle',
            opacity: 1,
        };
    }
    
    burst(x = this.canvas.width / 2, y = this.canvas.height / 2) {
        this.particles = [];
        
        for (let i = 0; i < this.config.particleCount; i++) {
            this.particles.push(this.createParticle(x, y));
        }
        
        if (!this.isRunning) {
            this.isRunning = true;
            this.animate();
        }
        
        // Auto-stop after duration
        setTimeout(() => {
            this.stop();
        }, this.config.duration);
    }
    
    animate() {
        if (!this.isRunning) return;
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach((p, index) => {
            // Update physics
            p.vy += this.config.gravity;
            p.vx *= this.config.friction;
            p.vy *= this.config.friction;
            p.x += p.vx;
            p.y += p.vy;
            p.rotation += p.rotationSpeed;
            
            // Fade out particles near the end
            if (p.y > this.canvas.height * 0.8) {
                p.opacity -= 0.02;
            }
            
            // Draw particle
            if (p.opacity > 0) {
                this.ctx.save();
                this.ctx.translate(p.x, p.y);
                this.ctx.rotate((p.rotation * Math.PI) / 180);
                this.ctx.globalAlpha = p.opacity;
                this.ctx.fillStyle = p.color;
                
                if (p.shape === 'rect') {
                    this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
                } else {
                    this.ctx.beginPath();
                    this.ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
                    this.ctx.fill();
                }
                
                this.ctx.restore();
            }
        });
        
        // Remove dead particles
        this.particles = this.particles.filter(p => p.opacity > 0 && p.y < this.canvas.height + 50);
        
        if (this.particles.length > 0) {
            this.animationId = requestAnimationFrame(() => this.animate());
        } else {
            this.stop();
        }
    }
    
    stop() {
        this.isRunning = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

// Export for use in app.js
window.ConfettiAnimation = ConfettiAnimation;
