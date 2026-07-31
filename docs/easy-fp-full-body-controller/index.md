---
title: Easy FP Full Body Controller
description: "Easy FP Full Body Controller: a first-person full-body character controller for Unity URP by vedaloiv. 7-step setup wizard, procedural IK, FPCutter mesh-cutting, item system, extensible event API."
---

# Easy FP Full Body Controller

A first-person **and** third-person full-body character controller for Unity. The runtime API is render-pipeline-agnostic; the demo scene and FPCutter shader require URP. It renders and animates a full body in first person using procedural IK, ships with a guided 7-step Setup Wizard, includes the **FPCutter** mesh-cutting tool for hiding body parts in FP view, a dynamic item system, and an extensible event API.

::: tip Verified against v1.1.0
This documentation reflects the shipped **v1.1.0** package source (read directly from `Assets/FBSystem/`). Signatures below are real, not estimates.
:::

## Features

- **Full-body first / third person** with procedural hand & head IK and spine stabilization.
- **7-step Setup Wizard**: menu `Tools ▸ First Person ▸ Setup Wizard` walks you from root to validation.
- **FPCutter**: segments the character mesh and hides body parts (e.g. the head) in first person while still casting shadows.
- **Dynamic item system**: equip/unequip, per-item hold data, shareable IK presets, scroll-wheel / number-key switching.
- **Extensible event API**: C# events + `UnityEvent`s + auto-discovered listener interfaces, each fired once per transition from a single canonical chokepoint.
- **Cinemachine**-based FPS camera with a stable anchor target.
- **Unity Input System** integration (shipped `FBInputActions` asset).

## Requirements

| Requirement | Version | Source |
| --- | --- | --- |
| Unity | 6000.5.0f1 (Unity 6.5) or newer | `ProjectSettings/ProjectVersion.txt` |
| Render Pipeline | URP 17.5.0 (demo + FPCutter shader) | `Packages/manifest.json` |
| Cinemachine | 3.1.7 | `Packages/manifest.json` |
| Input System | 1.19.0 | `Packages/manifest.json` |
| Character model | imported as **Humanoid** | Setup Wizard step 2 requires it |

## Listing facts

| Field | Value |
| --- | --- |
| Asset | Easy FP Full Body Controller |
| Publisher | vedaloiv (listed as Maansen) |
| Store page | [assetstore.unity.com](https://assetstore.unity.com/packages/tools/game-toolkits/easy-fp-full-body-controller-357454) |
| Price | ~~€36.79~~ €18.39 |
| Version | 1.1.0 |
| Unity | 6000.5.0+ |
| Render pipeline | URP (demo + FPCutter) |
| Package size | 185.2 MB |
| Released | 2026-07-28 (v1.0), v1.1.0 on 2026-07-30 |

## Quick start

Run the **7-step Setup Wizard** (`Tools ▸ First Person ▸ Setup Wizard`), cut your mesh with **FPCutter**, and press Play. Full steps: [Quick Start](./quick-start).

<div style="position:relative;max-width:640px;aspect-ratio:16/9;margin:24px 0;border:2px solid var(--vp-c-divider);border-radius:4px;overflow:hidden;">
<iframe style="position:absolute;inset:0;width:100%;height:100%;border:0;" src="https://www.youtube-nocookie.com/embed/_X0HWXqQ3_k" title="FBSystem Quick Start Guide" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>

_Walkthrough by **aloiV**. Covers the 7-step Setup Wizard, FPCutter mesh optimization, and the dynamic Item Usage system._

## Next steps

- [Quick Start](./quick-start): import, wizard, FPCutter, input, play.
- [Interfaces](./interfaces): the runtime API: `PlayerController` hub, item system, and the full event catalog.

## Changelog highlights

- **v1.1.0 (2026-07-30)**: Extensible Event API: triple mechanism (C# `event` + `UnityEvent` + auto-discovered listener interfaces) on `HandItemSocket` and `PlayerLocomotion`, fired once per transition. `HandItemSocket` is now the canonical equip-event owner; `ItemContainer` is pure orchestration.
- **v1.0.0**: initial release: FP/TP full-body controller, procedural IK, setup-wizard onboarding, FPCutter mesh-cutting, demo scene with item pickup/drop.

Full changelog ships in the package at `Assets/FBSystem/CHANGELOG.md`.

## Get it

<a href="https://assetstore.unity.com/packages/tools/game-toolkits/easy-fp-full-body-controller-357454" target="_blank" rel="noopener" class="btn-primary">View on Asset Store ↗</a>
