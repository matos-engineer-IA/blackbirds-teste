import Phaser from "phaser";
import { Dummy } from "../entities/Dummy";
import { Player } from "../entities/Player";
import { Projectile } from "../entities/Projectile";
import { palette } from "../palette";
import { setAudioRegion, unlockAudio } from "../utils/audio";
import { GAME, SCENE } from "../utils/constants";
import { GROUND } from "../utils/scale";
import { hurtBounds } from "../utils/footAnchor";
import { ActionInput } from "../systems/actionInput";
import { ArenaLifecycle } from "../systems/arenaLifecycle";
import { keyFor } from "../systems/settings";

export class ArenaScene extends Phaser.Scene {
  private player!: Player;
  private dummies!: Phaser.Physics.Arcade.Group;
  private shots!: Phaser.Physics.Arcade.Group;
  private actions!: ActionInput;
  private lifecycle!: ArenaLifecycle;
  private ammoText!: Phaser.GameObjects.Text;

  constructor() {
    super(SCENE.arena);
  }

  create(): void {
    unlockAudio();
    setAudioRegion("arena");
    this.actions = new ActionInput(this);
    this.lifecycle = new ArenaLifecycle(this, this.actions);
    this.add.tileSprite(GAME.width / 2, 140, GAME.width, 250, "bg-mid");
    this.add.image(0, GROUND.y, "worker-street-1").setOrigin(0, 1).setDepth(1).setTint(0xb5a99a);
    this.add.text(16, 12, "Campo de provas", {
      fontFamily: "Georgia, serif",
      fontSize: "11px",
      color: "#c4a36a",
    }).setScrollFactor(0);
    this.ammoText = this.add.text(16, 28, "", { fontFamily: "Georgia, serif", fontSize: "11px", color: "#efe4d0" }).setScrollFactor(0);
    this.add.text(16, GAME.height - 16, `${keyFor("melee")} soco · ${keyFor("fire")} revólver · ${keyFor("reload")} recarga · ${keyFor("dodge")} esquiva · ${keyFor("pause")} pausa`, {
      fontFamily: "Georgia, serif",
      fontSize: "10px",
      color: "#9a8770",
    }).setScrollFactor(0);

    const floor = this.physics.add.staticGroup();
    const ground = this.add.rectangle(GAME.width / 2, GROUND.y + 12, GAME.width, 24, 0x2b2118, 1);
    this.physics.add.existing(ground, true);
    floor.add(ground);
    this.add.tileSprite(0, GROUND.y, GAME.width, 36, "cobble").setOrigin(0, 0).setDepth(3);

    this.player = new Player(this, 80, GROUND.y);
    this.player.combatEnabled = true;
    this.dummies = this.physics.add.group();
    this.shots = this.physics.add.group();
    this.dummies.add(new Dummy(this, 280, GROUND.y));
    this.dummies.add(new Dummy(this, 400, GROUND.y));
    this.dummies.add(new Dummy(this, 520, GROUND.y));

    this.physics.add.collider(this.player, floor);
    this.physics.add.collider(this.dummies, floor);
    this.physics.add.collider(this.shots, floor, shot => (shot as Projectile).destroy());
    this.physics.world.setBounds(0, 0, GAME.width, GAME.height);
    this.cameras.main.setBackgroundColor(palette.charcoal);
    this.cameras.main.startFollow(this.player, true, 0.12, 0.12);
    this.cameras.main.setBounds(0, 0, GAME.width, GAME.height);

  }

  update(_time: number, delta: number): void {
    const input = this.actions.sample();
    if (input.pressed.pause) { this.lifecycle.pause(); return; }
    const shotBefore = this.player.shotSerial;
    this.player.updatePlayer(
      {
        left: input.down.left, right: input.down.right, jump: input.down.jump,
        jumpPressed: input.pressed.jump, melee: input.pressed.melee, fire: input.pressed.fire,
        reload: input.pressed.reload, dodgePressed: input.pressed.dodge,
      },
      delta,
    );
    if (this.player.shotSerial !== shotBefore) {
      new Projectile(this, Phaser.Math.Clamp(this.player.x + this.player.facing * 72, 6, this.physics.world.bounds.width - 6), this.player.y - 64, this.player.facing, this.shots, this.player.x + this.player.facing * 18);
    }
    this.shots.getChildren().forEach(child => {
      const shot = child as Projectile;
      const target = this.dummies.getChildren().find(dummy => (dummy as Dummy).active && Phaser.Geom.Intersects.RectangleToRectangle(shot.sweptBounds(), hurtBounds(dummy as Dummy))) as Dummy | undefined;
      if (target) { target.hit(1); shot.destroy(); } else shot.recordStep();
    });
    if (this.player.meleeActive) {
      const box = this.player.attackHitbox();
      this.dummies.getChildren().forEach((child) => {
        const dummy = child as Dummy;
        if (dummy.active && Phaser.Geom.Intersects.RectangleToRectangle(box, hurtBounds(dummy)) && this.player.consumeMeleeHit(dummy)) {
          dummy.hit(this.player.lastMeleeDamage());
        }
      });
    }
    this.ammoText.setText(`Munição ${this.player.ammo}/6 · Reserva ${this.player.reserveAmmo}`);
    if (this.dummies.countActive() === 0) this.lifecycle.pause("Treino concluído", true);
  }
}
