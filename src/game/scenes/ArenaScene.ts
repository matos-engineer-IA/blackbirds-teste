import Phaser from "phaser";
import { Dummy } from "../entities/Dummy";
import { Player } from "../entities/Player";
import { Projectile } from "../entities/Projectile";
import { palette } from "../palette";
import { unlockAudio } from "../utils/audio";
import { GAME, SCENE } from "../utils/constants";
import { GROUND } from "../utils/scale";
import { bodyBounds } from "../utils/footAnchor";

export class ArenaScene extends Phaser.Scene {
  private player!: Player;
  private dummies!: Phaser.Physics.Arcade.Group;
  private shots!: Phaser.Physics.Arcade.Group;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private keys!: Record<string, Phaser.Input.Keyboard.Key>;
  private jumpWasDown = false;
  private meleeWasDown = false;
  private fireWasDown = false;
  private ammoText!: Phaser.GameObjects.Text;

  constructor() {
    super(SCENE.arena);
  }

  create(): void {
    this.jumpWasDown = this.meleeWasDown = this.fireWasDown = false;
    unlockAudio();
    this.add.tileSprite(GAME.width / 2, 140, GAME.width, 250, "bg-mid");
    this.add.text(16, 12, "Campo de provas", {
      fontFamily: "Georgia, serif",
      fontSize: "11px",
      color: "#c4a36a",
    }).setScrollFactor(0);
    this.ammoText = this.add.text(16, 28, "", { fontFamily: "Georgia, serif", fontSize: "11px", color: "#efe4d0" }).setScrollFactor(0);
    this.add.text(16, GAME.height - 16, "J/Z soco  ·  K/X revolver  ·  R recarregar  ·  ESC menu", {
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
    this.physics.add.overlap(this.shots, this.dummies, (shot, dummy) => {
      (dummy as Dummy).hit(1);
      (shot as Projectile).destroy();
    });
    this.physics.world.setBounds(0, 0, GAME.width, GAME.height);
    this.cameras.main.setBackgroundColor(palette.charcoal);
    this.cameras.main.startFollow(this.player, true, 0.12, 0.12);
    this.cameras.main.setBounds(0, 0, GAME.width, GAME.height);

    this.cursors = this.input.keyboard!.createCursorKeys();
    this.keys = this.input.keyboard!.addKeys("A,D,W,J,K,Z,X,R,ESC,SPACE") as Record<string, Phaser.Input.Keyboard.Key>;
    this.input.keyboard?.on("keydown-ESC", () => {
      this.scene.stop(SCENE.ui);
      this.scene.start(SCENE.menu);
    });
  }

  update(_time: number, delta: number): void {
    const jumpDown = this.cursors.up.isDown || this.keys.W.isDown || this.keys.SPACE.isDown;
    const meleeDown = this.keys.Z.isDown || this.keys.J.isDown;
    const fireDown = this.keys.X.isDown || this.keys.K.isDown;
    const ammoBefore = this.player.ammo;
    this.player.updatePlayer(
      {
        left: this.cursors.left.isDown || this.keys.A.isDown,
        right: this.cursors.right.isDown || this.keys.D.isDown,
        jump: jumpDown,
        jumpPressed: jumpDown && !this.jumpWasDown,
        melee: meleeDown && !this.meleeWasDown,
        fire: fireDown && !this.fireWasDown,
        reload: Phaser.Input.Keyboard.JustDown(this.keys.R),
      },
      delta,
    );
    if (this.player.ammo < ammoBefore) {
      new Projectile(this, this.player.x + this.player.facing * 22, this.player.y - 44, this.player.facing, this.shots);
    }
    this.jumpWasDown = jumpDown;
    this.meleeWasDown = meleeDown;
    this.fireWasDown = fireDown;
    if (this.player.meleeActive) {
      const box = this.player.attackHitbox();
      this.dummies.getChildren().forEach((child) => {
        const dummy = child as Dummy;
        if (dummy.active && Phaser.Geom.Intersects.RectangleToRectangle(box, bodyBounds(dummy)) && this.player.consumeMeleeHit(dummy)) {
          dummy.hit(this.player.lastMeleeDamage());
        }
      });
    }
    this.ammoText.setText(`Munição ${this.player.ammo}/${6}`);
  }
}
