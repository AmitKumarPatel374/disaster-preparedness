import React, { useEffect, useRef } from "react"
import Phaser from "phaser"
import { saveGameResult } from "../utils/games"

export default function FloodSimulation() {
  const gameRef = useRef(null)

  useEffect(() => {
    if (gameRef.current) return

    class FloodScene extends Phaser.Scene {
      constructor() { super('FloodScene') }

      create() {
        this.width = 800; this.height = 600
        this.add.rectangle(400, 300, 760, 560, 0xe6f2ff).setStrokeStyle(2, 0x93c5fd)

        // High ground platform (safe zone)
        this.safe = this.add.rectangle(700, 180, 160, 80, 0x16a34a, 0.15).setStrokeStyle(2, 0x16a34a)
        this.add.text(630, 140, 'High Ground', { color: '#065f46', fontSize: '14px' })

        // Player
        this.player = this.add.circle(80, 520, 16, 0x1d4ed8)
        this.physics.add.existing(this.player)
        this.player.body.setCollideWorldBounds(true)

        // Rising water
        this.waterLevel = 600
        this.water = this.add.rectangle(400, this.waterLevel/2, 760, this.waterLevel, 0x60a5fa, 0.6)

        this.cursors = this.input.keyboard.createCursorKeys()
        this.wasd = this.input.keyboard.addKeys({
          up: Phaser.Input.Keyboard.KeyCodes.W,
          left: Phaser.Input.Keyboard.KeyCodes.A,
          down: Phaser.Input.Keyboard.KeyCodes.S,
          right: Phaser.Input.Keyboard.KeyCodes.D
        })

        this.timer = 0
        this.elapsed = 0
        this.status = this.add.text(20, 20, 'Get to high ground before water rises!', { color:'#111', fontSize:'16px' })

        // Camera subtle shake to convey urgency
        this.time.addEvent({ delay: 4000, loop: true, callback: ()=> this.cameras.main.shake(200, 0.002) })
      }

      async gameOver(win) {
        this.scene.pause()
        const msg = win ? '✅ Safe! You reached high ground.' : '❌ You were caught by the flood.'
        this.add.text(200, 260, msg, { color: win ? '#065f46' : '#991b1b', fontSize:'20px' })
        try { await saveGameResult('flood', win ? 100 : 0, { timeSec: Math.round(this.elapsed) }) } catch {}
      }

      update(time, delta) {
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

        // Raise water over time
        this.elapsed += delta/1000
        this.timer += delta
        if (this.timer > 700) {
          this.timer = 0
          this.waterLevel -= 6 // water rises
          if (this.waterLevel < 0) this.waterLevel = 0
          this.water.setSize(760, 600 - this.waterLevel)
          this.water.setPosition(400, (600 - (600 - this.waterLevel))/2)
        }

        // If player below water -> lose
        const playerSubmerged = this.player.y > this.waterLevel
        if (playerSubmerged) return this.gameOver(false)

        // If player inside safe zone (top area) -> win
        const inSafe = Phaser.Geom.Rectangle.Contains(this.safe.getBounds(), this.player.x, this.player.y)
        if (inSafe) return this.gameOver(true)
      }
    }

    const config = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      backgroundColor: '#e0f2fe',
      physics: { default: 'arcade', arcade: { debug: false } },
      scene: [FloodScene],
      parent: 'flood-container'
    }
    gameRef.current = new Phaser.Game(config)
    return () => { gameRef.current.destroy(true); gameRef.current = null }
  }, [])

  return (
    <div>
      <h2 className="page-title">Flood Escape Challenge</h2>
      <div id="flood-container" tabIndex={0} style={{border:'1px solid var(--border)', borderRadius:10, width:800, height:600, boxShadow:'0 4px 12px rgba(0,0,0,0.08)'}}></div>
      <p className="page-subtle" style={{marginTop:8}}>Tip: Use Arrow/WASD keys. Reach the green high ground before the water rises.</p>
    </div>
  )
}


