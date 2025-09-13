import React, { useEffect, useRef } from "react"
import Phaser from "phaser"
import { saveGameResult } from "../utils/games"

export default function FireSimulation() {
  const gameRef = useRef(null)

  useEffect(() => {
    if (gameRef.current) return

    class FireScene extends Phaser.Scene {
      constructor() { super('FireScene') }

      create() {
        this.add.rectangle(400, 300, 760, 560, 0xfffbeb).setStrokeStyle(2, 0xfcd34d)
        // Exits
        this.exitLeft = this.add.rectangle(40, 300, 40, 120, 0x065f46, 0.2).setStrokeStyle(2, 0x10b981)
        this.exitRight = this.add.rectangle(760, 300, 40, 120, 0x065f46, 0.2).setStrokeStyle(2, 0x10b981)
        this.add.text(18, 250, 'EXIT', { color:'#065f46', fontSize:'12px' })
        this.add.text(735, 250, 'EXIT', { color:'#065f46', fontSize:'12px' })

        // Smoke zones
        this.smokes = [
          this.add.rectangle(300, 340, 180, 60, 0x6b7280, 0.25),
          this.add.rectangle(480, 260, 180, 60, 0x6b7280, 0.25),
        ]

        // Player
        this.player = this.add.triangle(120, 520, 0, 30, 30, 0, 60, 30, 0x1d4ed8)
        this.physics.add.existing(this.player)
        this.player.body.setCollideWorldBounds(true)

        this.cursors = this.input.keyboard.createCursorKeys()
        this.wasd = this.input.keyboard.addKeys({
          up: Phaser.Input.Keyboard.KeyCodes.W,
          left: Phaser.Input.Keyboard.KeyCodes.A,
          down: Phaser.Input.Keyboard.KeyCodes.S,
          right: Phaser.Input.Keyboard.KeyCodes.D
        })

        this.status = this.add.text(20, 20, 'Avoid smoke (stay low) and reach an EXIT.', { color:'#111', fontSize:'16px' })
      }

      async done(win) {
        this.scene.pause()
        const msg = win ? '✅ Safe! You exited the building.' : '❌ You inhaled too much smoke.'
        this.add.text(200, 260, msg, { color: win ? '#065f46' : '#991b1b', fontSize:'20px' })
        try { 
          await saveGameResult('fire', win ? 100 : 0, {})
          
          // Track simulation completion in student stats
          if (win) {
            const currentStats = JSON.parse(localStorage.getItem('student_stats') || '{"completedQuizzes":0,"completedSimulations":0,"awarenessModules":0}')
            currentStats.completedSimulations += 1
            localStorage.setItem('student_stats', JSON.stringify(currentStats))
          }
        } catch {}
      }

      update() {
        const speed = 220
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

        // If player intersects smoke zones -> lose
        for (const s of this.smokes) {
          if (Phaser.Geom.Intersects.RectangleToRectangle(this.player.getBounds(), s.getBounds())) {
            return this.done(false)
          }
        }

        // If reaches an exit -> win
        if (Phaser.Geom.Intersects.RectangleToRectangle(this.player.getBounds(), this.exitLeft.getBounds()) ||
            Phaser.Geom.Intersects.RectangleToRectangle(this.player.getBounds(), this.exitRight.getBounds())) {
          return this.done(true)
        }
      }
    }

    const config = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      backgroundColor: '#fff7ed',
      physics: { default: 'arcade', arcade: { debug: false } },
      scene: [FireScene],
      parent: 'fire-container'
    }
    gameRef.current = new Phaser.Game(config)
    return () => { gameRef.current.destroy(true); gameRef.current = null }
  }, [])

  return (
    <div>
      <h2 className="page-title">Fire Drill Game</h2>
      <div id="fire-container" tabIndex={0} style={{border:'1px solid var(--border)', borderRadius:10, width:800, height:600, boxShadow:'0 4px 12px rgba(0,0,0,0.08)'}}></div>
      <p className="page-subtle" style={{marginTop:8}}>Tip: Avoid gray smoke areas and reach green EXIT zones. Arrow/WASD keys.</p>
    </div>
  )
}


