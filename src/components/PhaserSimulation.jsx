// src/components/PhaserSimulation.jsx
import React, { useEffect, useRef } from "react"
import Phaser from "phaser"

export default function PhaserSimulation() {
    const gameRef = useRef(null)

    useEffect(() => {
        if (gameRef.current) return // Prevent multiple Phaser instances

        class DrillScene extends Phaser.Scene {
            constructor() {
                super("DrillScene")
            }

            preload() {}

            create() {
                const bg = this.add.rectangle(400, 300, 760, 560, 0xe6f2ff)
                bg.setStrokeStyle(2, 0xbcd7ff)

                // Create "table" and an invisible safe zone under it
                this.table = this.add.rectangle(600, 420, 160, 60, 0x8b5cf6)
                this.safeZone = this.add.rectangle(600, 450, 160, 40)
                this.safeZone.isStroked = true
                this.safeZone.setStrokeStyle(2, 0x10b981)
                this.safeZone.setFillStyle(0x10b981, 0.08)

                // Player
                this.player = this.add.circle(200, 420, 18, 0x2563eb)

                // Enable simple arcade physics on player
                this.physics.add.existing(this.player)
                this.player.body.setCollideWorldBounds(true)

                // Boundaries inside the room
                this.roomBounds = new Phaser.Geom.Rectangle(20, 20, 760, 560)

                // Instructions and status
                this.title = this.add.text(20, 20, "Earthquake Drill", { fontSize: "20px", color: "#111" })
                this.instruction = this.add.text(
                    20,
                    48,
                    "Arrow/WASD keys दबाएँ। लक्ष्य: मेज़ के नीचे सुरक्षित क्षेत्र (हरा)।",
                    { fontSize: "16px", color: "#111", wordWrap: { width: 760 } }
                )
                this.status = this.add.text(20, 76, "Status: Moving...", { fontSize: "16px", color: "#374151" })

                // Input
                this.cursors = this.input.keyboard.createCursorKeys()
                this.wasd = this.input.keyboard.addKeys({
                    up: Phaser.Input.Keyboard.KeyCodes.W,
                    left: Phaser.Input.Keyboard.KeyCodes.A,
                    down: Phaser.Input.Keyboard.KeyCodes.S,
                    right: Phaser.Input.Keyboard.KeyCodes.D
                })

                // Simulate periodic quake camera shake
                this.time.addEvent({
                    delay: 3000,
                    loop: true,
                    callback: () => this.cameras.main.shake(250, 0.002)
                })

                // Restart button
                const btn = this.add.text(650, 24, "Restart", { fontSize: "14px", color: "#1d4ed8" })
                    .setInteractive({ useHandCursor: true })
                    .on('pointerdown', () => this.scene.restart())
            }

            update() {
                if (!this.player) return

                const speed = 200
                const body = this.player.body
                body.setVelocity(0)

                const left = this.cursors.left.isDown || this.wasd.left.isDown
                const right = this.cursors.right.isDown || this.wasd.right.isDown
                const up = this.cursors.up.isDown || this.wasd.up.isDown
                const down = this.cursors.down.isDown || this.wasd.down.isDown

                if (left) body.setVelocityX(-speed)
                if (right) body.setVelocityX(speed)
                if (up) body.setVelocityY(-speed)
                if (down) body.setVelocityY(speed)

                // Keep inside the room bounds
                const p = this.player
                p.x = Phaser.Math.Clamp(p.x, this.roomBounds.left + 10, this.roomBounds.right - 10)
                p.y = Phaser.Math.Clamp(p.y, this.roomBounds.top + 10, this.roomBounds.bottom - 10)

                // Check if inside safe zone
                const inSafe = Phaser.Geom.Rectangle.Contains(this.safeZone.getBounds(), p.x, p.y)
                if (inSafe) {
                    this.status.setText("Status: ✅ Safe! आप मेज़ के नीचे सुरक्षित हैं।")
                    this.safeZone.setStrokeStyle(2, 0x16a34a)
                    
                    // Track simulation completion
                    if (!this.completed) {
                        this.completed = true
                        const currentStats = JSON.parse(localStorage.getItem('student_stats') || '{"completedQuizzes":0,"completedSimulations":0,"awarenessModules":0}')
                        currentStats.completedSimulations += 1
                        localStorage.setItem('student_stats', JSON.stringify(currentStats))
                        
                        // Show completion message
                        this.add.text(400, 100, "🎉 Simulation Completed!", { 
                            fontSize: "24px", 
                            color: "#16a34a",
                            fontStyle: "bold"
                        }).setOrigin(0.5)
                    }
                } else {
                    this.status.setText("Status: Move to the green safe zone under the table.")
                    this.safeZone.setStrokeStyle(2, 0x10b981)
                }
            }
        }

        const config = {
            type: Phaser.AUTO,
            width: 800,
            height: 600,
            backgroundColor: "#dff6ff",
            physics: { default: "arcade", arcade: { debug: false } },
            scene: [DrillScene],
            parent: "phaser-container"
        }

        gameRef.current = new Phaser.Game(config)

        return () => {
            gameRef.current.destroy(true)
            gameRef.current = null
        }
    }, [])

    return (
        <div>
            <h2 className="page-title">Earthquake Drill Simulation</h2>
            <div
                id="phaser-container"
                tabIndex={0}
                style={{border:'1px solid var(--border)', borderRadius:10, width:800, height:600, boxShadow:'0 4px 12px rgba(0,0,0,0.08)'}}
                onMouseEnter={(e)=> e.currentTarget.focus()}
                onFocus={(e)=> e.currentTarget.focus()}
            ></div>
            <p className="page-subtle" style={{marginTop:8}}>Tip: Click/tap the area above to focus, then use arrow keys.</p>
        </div>
    )
}
