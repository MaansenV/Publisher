Stop being a floating camera. Start being a character.<br><br>

Easy FP Full Body Controller is a first-person and third-person character controller for Unity, built for games where body awareness matters.<br><br>

Unlike standard FPS controllers that hide the character mesh, it works with full-body animations while solving two common True First Person problems: camera jitter and mesh clipping.<br><br>

📹 <b>Stable Anchor Camera</b><br><br>

Attaching a camera to an animated head bone transfers every small animation movement to the player's view.<br><br>

The Stable Anchor system follows the character's eye position frame by frame while keeping camera rotation independent.<br><br>

The result is a visible full body with the smooth and precise aiming of a traditional FPS controller.<br><br>

✂️ <b>FPCutter: The Mesh Solution</b><br><br>

FPCutter prepares characters for True First Person without requiring a manually edited headless model.<br><br>

• <b>Automatic slicing:</b> Separates the head using bone-weight data.<br>
• <b>Non-destructive:</b> Creates a separate _FPCut variant. Original assets stay untouched.<br>
• <b>Shadow preservation:</b> Hidden head geometry still casts shadows.<br>
• <b>Adjustable thresholds:</b> Preview and fine-tune cuts before generation.<br><br>

⚡ <b>Key Features</b><br><br>

• <b>Procedural IK:</b> Hand, head, and spine alignment.<br>
• <b>Full locomotion:</b> Idle, walk, sprint, jump, and crouch.<br>
• <b>First and third person:</b> Switch perspectives using the same controller.<br>
• <b>Modular architecture:</b> Components are automatically discovered and connected.<br>
• <b>Unity 6 ready:</b> Supports Cinemachine 3.x and the Unity Input System.<br>
• <b>Flexible input:</b> Keyboard, mouse, and gamepad support.<br>
• <b>Pipeline-independent runtime:</b> The demo scene and FPCutter shader require URP.<br><br>

🛠️ <b>Setup and Tools</b><br><br>

• <b>Setup Wizard:</b> Configure a playable character in seven guided steps. <a href="https://maansenv.github.io/Publisher/easy-fp-full-body-controller/quick-start">Quick Start guide</a><br>
• <b>FPCutter Wizard:</b> Preview and generate mesh cuts visually.<br>
• <b>Item System:</b> Attach items with custom hold positions and reusable IK presets.<br><br>

📖 <b>Documentation</b><br><br>

Full setup guides and API documentation are available online, verified against the shipped v1.1.0 source.<br><br>

• <a href="https://maansenv.github.io/Publisher/easy-fp-full-body-controller/">Overview and requirements</a><br>
• <a href="https://maansenv.github.io/Publisher/easy-fp-full-body-controller/quick-start">Quick Start guide</a><br>
• <a href="https://maansenv.github.io/Publisher/easy-fp-full-body-controller/interfaces">Runtime API and interfaces</a><br><br>

🔧 <b>Planned for future updates</b><br><br>

• <b>Advanced Foot IK:</b> Predictive foot placement for slopes, stairs, and uneven terrain.<br>
• <b>Procedural Item Sway:</b> Dynamic weapon inertia and rotational sway to simulate weight.
