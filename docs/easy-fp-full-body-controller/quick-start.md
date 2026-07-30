---
title: Quick Start
description: Quick start outline for Easy FP Full Body Controller. Placeholder steps pending verification against the asset.
---

# Quick Start

::: warning Outline only — verify before following
The steps below are a **placeholder structure** for the quick-start guide. They describe the *shape* of a typical Unity asset setup (import → add to scene → configure → play) but the exact menu paths, prefab names, and component fields have **not yet been checked against the shipped package**. Each step marked `[to verify]` must be confirmed against the real asset before this guide is accurate.
:::

## Requirements

- Unity **6000.5.0** or newer *(verified from the store listing)*.
- A project using the **Universal Render Pipeline (URP)** *(verified — URP only)*.
- The Easy FP Full Body Controller package, imported from the Asset Store.

## 1. Import the package

`[to verify]` Open the Asset Store listing, add the asset to your account, and import it into your URP project via the Package Manager. Confirm whether it imports as a UPM package or Asset Store legacy content.

## 2. Add the controller to a scene

`[to verify]` Locate the controller prefab shipped with the asset and add it to your scene. The exact prefab path and name will be documented here once verified.

## 3. Configure input

`[to verify]` The controller expects input bindings for movement, look, and interaction. Whether it uses Unity's new Input System, the legacy Input Manager, or its own binding layer will be confirmed here.

## 4. Configure the camera

`[to verify]` Attach/assign the first-person camera and confirm any URP-specific camera or volume setup the asset requires.

## 5. Press Play

`[to verify]` Enter Play mode and verify the full body renders in first person with working locomotion.

## Troubleshooting

`[to verify]` Common issues (pink materials / missing URP, input not bound, camera clipping) and their fixes will be listed here once the asset's actual failure modes are known.

---

::: details Why this page is a placeholder
This documentation frontend is built and live, but the **content** for each asset must be written from the real package so it never documents a wrong menu path or class name. This outline exists so the structure is ready to fill in.
:::
