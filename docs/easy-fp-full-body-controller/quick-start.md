---
title: Quick Start
description: Get a first-person full-body character running with Easy FP Full Body Controller — the 7-step Setup Wizard, FPCutter, and input setup.
---

# Quick Start

::: tip Verified against v1.1.0 source
Steps reflect the shipped `FirstPersonSetupWizard` and `FBInputActions` asset.
:::

## Requirements

A URP project on **Unity 6.5 (6000.5.0f1)+**, and a character model imported as **Humanoid**. See [Overview](./) for the full dependency list.

## 1. Import the asset

Import Easy FP Full Body Controller from the [Asset Store](https://assetstore.unity.com/packages/tools/game-toolkits/easy-fp-full-body-controller-357454) into your URP project. The asset lives under `Assets/FBSystem/`.

## 2. Prepare a Humanoid model

Select your character FBX → **Inspector ▸ Rig ▸ Animation Type: Humanoid** → Apply. The Setup Wizard requires a Humanoid rig for IK and animation to work.

## 3. Run the 7-step Setup Wizard

Menu: **`Tools ▸ First Person ▸ Setup Wizard`**. Navigate with `Next >` / `< Back` / `Finish Setup`.

1. **Select Player Root** — the container that holds the character's logic and movement. Create or assign one.
2. **Assign Model** — assign the character's `Animator` (the Humanoid rig from step 2).
3. **Bone Detection** — auto-detects the head, spine, and right-hand bones. Override manually if your rig is non-standard.
4. **Add Components** — adds the player scripts (movement, animation, logic).
5. **Create Hierarchy** — creates the camera target and item sockets.
6. **Wiring** — automatically finds and connects every reference between components.
7. **Validation** — runs a final health check. Green → **Finish Setup**.

## 4. Cut the mesh with FPCutter

So the character's head (and any other parts) hide in first person without vanishing from shadows:

1. Run the **FPCutter Wizard** (menu `Tools ▸ FPCutter Wizard`) on your character's `SkinnedMeshRenderer` to segment it into body parts.
2. The generated `FPCutterController` hides the parts listed in **Hide In First Person** (default: `Head`).
3. Toggle at runtime via `SetFirstPerson()` or `SetThirdPerson()`, or the component's context menu (`View ▸ Set First Person`).

## 5. Wire input

The asset ships `FBInputActions` (a Unity Input System asset) with a **Player** action map. `PlayerInputHandler` references it (`actionMapName = "Player"`). The Player actions:

| Action | Used by |
| --- | --- |
| `Move`, `Look` | `PlayerInputHandler` → locomotion & camera |
| `Sprint`, `Jump`, `Crouch` | `PlayerInputHandler` → locomotion |
| `Flashlight` | triggers the current item's **Use** (`HandItemSocket.UseCurrentItem()`) |
| `Previous`, `Next` | `ItemSwitcher` (number keys / scroll wheel) |
| `Attack`, `Interact` | defined in the action map; consumed by the demo scripts |

Assign the `FBInputActions` asset to the `PlayerInputHandler` if the wizard didn't.

## 6. Press Play

Enter Play mode. You should see a full body in first person with working locomotion, look, and the held item. Verify events with the demo `PlayerEventLogger` (it logs every transition to the Console).

## Video walkthrough

<div style="position:relative;max-width:640px;aspect-ratio:16/9;margin:24px 0;border:2px solid var(--vp-c-divider);border-radius:4px;overflow:hidden;">
<iframe style="position:absolute;inset:0;width:100%;height:100%;border:0;" src="https://www.youtube-nocookie.com/embed/_X0HWXqQ3_k" title="FBSystem Quick Start Guide" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>

## Troubleshooting

| Symptom | Fix |
| --- | --- |
| IK / animation broken | Model must be **Humanoid** (Rig ▸ Animation Type). Re-run the wizard's Assign Model step. |
| Pink materials | Project must be **URP**. Convert/reimport materials to URP shaders. |
| Camera clips into the head | Adjust `eyeOffset` or `crouchEyeOffset` on `PlayerCameraController`, and ensure FPCutter hides the head. |
| Item won't equip | `HandItemSocket` must be assigned; the item needs an `ItemHoldData` component. |
| Look feels off | Tune `lookSensitivity` or `verticalLookLimit` (or the same fields on the `PlayerSettings` asset). |
