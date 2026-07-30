---
title: Interfaces
description: Public runtime API of Easy FP Full Body Controller — PlayerController hub, item system, FPCutter, and the extensible event API.
---

# Interfaces

The public runtime API for integrating with the controller. All runtime types are in namespace `Player`. This page covers the **integration surface** — demo scripts, editor inspectors, and internal tuning fields are omitted (see source under `Assets/FBSystem/`).

::: tip Verified against v1.1.0 source
Signatures below are read from the shipped package.
:::

## PlayerController — the hub

Central `MonoBehaviour`. Auto-finds every sub-component in `Awake` if you leave them unassigned, so external code only needs one reference.

**Subsystem accessors**

| Property | Type | Subsystem |
| --- | --- | --- |
| `Settings` | `PlayerSettings` | global config asset |
| `Input` | `PlayerInputHandler` | input state |
| `Locomotion` | `PlayerLocomotion` | movement & physics |
| `CameraController` | `PlayerCameraController` | FPS camera |
| `AnimatorController` | `PlayerAnimatorController` | animation + item layers |
| `HeadIK` | `PlayerHeadIK` | head look-at IK |
| `HandIK` | `PlayerHandIK` | hand IK |
| `SpineStabilizer` | `PlayerSpineStabilizer` | spine yaw |
| `HandItemSocket` | `HandItemSocket` | item equip |

**State (read-only):** `IsGrounded`, `IsSprinting`, `MoveInput`, `LookInput`, `FlashlightTriggered`, `CurrentSpeed`, `MaxSpeed`.

**Control methods** (menus / cutscenes / pausing):

- `SetInputEnabled(bool)`, `SetMovementEnabled(bool)`, `SetCameraEnabled(bool)`
- `SetHeadIKEnabled(bool)`, `SetHandIKEnabled(bool)`, `SetSpineStabilizationEnabled(bool)`
- `SetCursorLocked(bool)`
- `EnableAllControls()` / `DisableAllControls()`

```csharp
var player = GetComponent<PlayerController>();
player.DisableAllControls();   // enter cutscene / menu
// ...
player.EnableAllControls();    // resume gameplay
```

## Configuration — PlayerSettings

`ScriptableObject` (Create ▸ **Player ▸ Settings**). Referenced by most components, so it's the single place to tune feel. `beginnerMode` toggles a simplified inspector view.

Key fields: `walkSpeed`, `sprintSpeed`, `crouchSpeed`, `crouchHeight`, `standHeight`, `crouchTransitionSpeed`, `jumpHeight`, `gravity`, `groundCheckDistance`, `groundedVelocityReset`, `inputDeadzone`, `animationSmoothTime`, `sprintAnimMultiplier`, `defaultHeadHeight`, `lookTargetDistance`, `cameraFallbackHeadHeight`, `verticalLookLimit`, `handVerticalLimitUpper` / `Lower`.

## Input — PlayerInputHandler

Reads the Unity Input System asset (`inputActions`, `actionMapName = "Player"`). Per-frame state (read-only): `MoveInput` (`Vector2`), `LookInput` (`Vector2`), `IsSprinting`, `JumpTriggered`, `IsCrouching`, `FlashlightTriggered`. Methods: `LockCursor()`, `UnlockCursor()`.

Player action map (`FBInputActions`): `Move`, `Look`, `Attack`, `Interact`, `Crouch`, `Jump`, `Previous`, `Next`, `Sprint`, `Flashlight`.

## Locomotion — PlayerLocomotion

`[RequireComponent(typeof(CharacterController))]`. Configurable fields: `walkSpeed`, `sprintSpeed`, `jumpHeight`, `gravity`, `crouchSpeed`, `crouchHeight`, `standHeight`, `crouchTransitionSpeed`, `groundCheckDistance`, `groundLayers`, `inputDeadzone`. State: `IsGrounded`, `IsSprinting`, `CurrentSpeed`, `MaxSpeed`. Fires the locomotion events listed below.

## Camera — PlayerCameraController

Cinemachine-based. Configurable: `eyeOffset`, `crouchEyeOffset`, `lookSensitivity`, `verticalLookLimit`. Public: `CameraTarget`, `Pitch`, `Yaw`, `GetLookAngles() → Vector2`, `SetLookDirection(float yaw, float pitch)`, `SyncCameraTargetToHead()`, `SetVerticalLimitOverride(float upper, float lower)`.

## Items

### HandItemSocket — canonical equip event source

The single owner of equip/unequip events. Properties: `CurrentItem`, `HasItem`, `Socket` (`Transform`), `Locomotion`. Methods: `AttachItem(GameObject, Vector3? pos, Vector3? rot)`, `AttachItem(GameObject, ItemAttachmentData)`, `EquipFromContainer(GameObject, int slotIndex = -1)`, `UseCurrentItem()` (triggered by the `Flashlight`/Use input). Events: see [Event API](#event-api).

### ItemContainer — orchestration

Manages a list of items and equips them **through** the socket (it no longer emits its own equip events). Properties: `CurrentItem`, `HasEquippedItem`, `CurrentIndex`, `ItemCount`, `HandSocket`. Methods: `EquipItem(int)`, `EquipItemById(string)`, `EquipItem(GameObject)`, `UnequipCurrent()`, `EquipNext()`, `EquipPrevious()`, `GetItem(int)`, `GetItemById(string)`, `AddItem(GameObject)`, `RemoveItem(GameObject) → bool`. Event: `OnContainerChanged` (fires when the item list itself changes — add/remove).

### ItemHoldData — per-item config & reactions

Attach to item `GameObject`s. Identity: `itemId`. **Item-local events** (fire alongside the system events): `OnEquip`, `OnUnequip`, `OnUse` (`UnityEvent`). Config: `attachmentData` (`ItemAttachmentData`), `worldItemPrefab` (should carry a `WorldItem` component). Properties: `ItemId`, `AttachmentData`, `WorldItemPrefab`.

### ItemAttachmentData — hold & IK config

`[Serializable]`. `animatorLayerIndex`, `holdStyle` (`OneHandedRight` | `TwoHanded`), `gripPositionOffset`, `gripRotationOffset`, plus standing/crouching hand and elbow IK overrides. Tune live via the item's `debugMode` / `tuneGripMode` in the editor (editor-only).

### ItemIKPreset — share IK config

`ScriptableObject` (Create ▸ **Player ▸ Item IK Preset**). `CaptureFromScene()` / `ApplyToScene()` (context menu) copy IK config between items.

## Event API — PlayerEventAPI {#event-api}

Three complementary mechanisms, each fired **once per transition** from a single canonical chokepoint:

| Mechanism | For |
| --- | --- |
| C# `event Action<TArgs>` | code subscribers (struct args, no per-call allocation) |
| `UnityEvent` | Inspector / no-code wiring |
| Listener interfaces | full extension / structured contract — **auto-discovered** |

### Event payloads

- **`ItemEquipArgs`** — `Item` (`GameObject`), `SlotIndex` (`int`, `-1` if equipped outside a container), `HoldData` (`ItemHoldData`), `FromContainer` (`bool`).
- **`LandArgs`** — `ImpactVelocity` (`float`), `FallDistance` (`float`).

### Item events — `HandItemSocket`

C#: `ItemEquipped`, `ItemUnequipped` (`event Action<ItemEquipArgs>`). Inspector: `OnItemEquipped`, `OnItemUnequipped` (`ItemEvent : UnityEvent<GameObject>`). Fire for **every** socket-backed equip/unequip (manual attach, container equip, detach).

### Locomotion events — `PlayerLocomotion`

C#: `Jumped`, `Landed` (`Action<LandArgs>`), `CrouchStarted`, `CrouchEnded`, `SprintStarted`, `SprintEnded`, `GroundedChanged` (`Action<bool>`). Inspector `UnityEvent` mirrors: `OnJumped`, `OnLanded`, `OnCrouchStarted`, `OnCrouchEnded`, `OnSprintStarted`, `OnSprintEnded`.

### Listener interfaces

Implement on any `MonoBehaviour` under the player — it's found at startup automatically. Unhandled methods are no-ops; override only what you need.

```csharp
using Player;

public class MyListener : MonoBehaviour, IItemEventListener, ILocomotionEventListener
{
    public void OnItemEquipped(ItemEquipArgs args) => Debug.Log($"equipped {args.Item.name}");
    public void OnItemUnequipped(ItemEquipArgs args) { }
    public void OnLanded(LandArgs args) => Debug.Log($"landed at {args.ImpactVelocity}");
    // OnJumped, OnCrouchStarted/Ended, OnSprintStarted/Ended, OnGroundedChanged default to no-op
}
```

Runtime-added listeners: `locomotion.RegisterListener(ILocomotionEventListener)` / `socket.RegisterListener(IItemEventListener)` (with matching `UnregisterListener(...)`).

### Subscribe in code

```csharp
player.Locomotion.Jumped += () => Debug.Log("jumped");
player.HandItemSocket.ItemEquipped += args =>
    Debug.Log($"equipped {args.Item.name} from slot {args.SlotIndex}");
```

::: warning Event contract
- Each transition fires its C# event, its `UnityEvent`, and every discovered listener **once**, in that order, from one private notify method.
- Equip/unequip events require a connected `HandItemSocket` — the socket is the source. A container without a socket emits **no** equip event.
- Dispatch is best-effort: a handler that throws interrupts the remaining handlers for that transition. Keep handlers exception-free.
:::

## FPCutter — FPCutterController

Hides body parts in first person (default: `Head`) while keeping shadow casting. Generated by the FPCutter Wizard. Methods: `SetFirstPerson()`, `SetThirdPerson()`, `HidePart(BodyPart)`, `ShowPart(BodyPart)`. Config: `HideInFirstPerson` (`List<BodyPart>`), `invisibleMaterial` (uses the `FPCutter_Invisible` shader). The `BodyPart` enum is defined in `FPCutterData`.

## Animator — PlayerAnimatorController

Drives animator parameters and item animation layers. Methods: `SetItemLayer(int)`, `SetFlashlightActive(bool)`, `ToggleFlashlight()`, `TriggerAnimation(string)`, `GetAnimator() → Animator`. Property: `IsFlashlightActive`.

## Procedural IK (advanced)

Tuned by the Setup Wizard; adjust only for advanced customization.

- **PlayerHeadIK** — `Weight` (get/set), `SetWeight(float)`, `SetWeights(body, head, eyes, clamp)`, `SetEnabled(bool)`.
- **PlayerHandIK** — `IKPositionWeight` (get/set), `SetEnabled(bool)`.
- **PlayerSpineStabilizer** — `[RequireComponent(typeof(Animator))]`; aligns spine yaw to the camera.

---

::: details Demo & Editor code (not part of the runtime API)
**Demo** (`Project/Scripts/Player/Demo/`): `PlayerEventLogger` (implements both listener interfaces — copy it as a template), `PlayerDropSystem`, `PlayerInventory`, `PlayerInteraction`, `WorldItem`. **Editor**: custom inspectors plus the setup wizards — `Tools ▸ First Person ▸ Setup Wizard`, the Item Container setup, and the FPCutter Wizard.
:::
