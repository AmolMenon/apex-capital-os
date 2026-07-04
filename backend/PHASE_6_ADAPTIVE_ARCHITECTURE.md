# Phase 6: Adaptive Decision Intelligence Architecture

## Overview
Apex Capital has transitioned from a rigid, monolithic multi-agent deliberation matrix into a dynamic, **Adaptive Decision Intelligence Architecture**. 

Instead of unconditionally executing a multi-agent debate (which consumes ~3.9x tokens without guaranteed semantic gain), the new `ADAPTIVE` topology evaluates evidence via a single, rapid baseline pass. It then utilizes a deterministic rules engine (`EscalationPolicyService`) to surgically escalate and challenge only the specific components of a decision that require deeper scrutiny, followed by a Lossless Synthesis pass that guarantees preservation of all edge-case risks.

## Components

### 1. Escalation Signals & Challenge Tasks
- **EscalationSignal**: A persisted, deterministic trigger generated when evidence or base reasoning violates specific domain policies (e.g., `HIGH` severity unresolved evidence conflicts, critical assumptions).
- **ChallengeTask**: An actionable, targeted query constructed from an `EscalationSignal`. It bypasses persona-driven debate and issues a highly specific query to the `TargetedChallengeEngine`.

### 2. Escalation Policy Service
A deterministic rules engine that acts as the intelligence gateway between base analysis and advanced reasoning.
- Operates on: Base Analysis Output + Evidence Knowledge Graph
- Domain Modularity: Injectable policies per domain (`Venture Capital`, `Corporate Strategy`, `Operations`).

### 3. Adaptive Reasoning Controller
The orchestrator of the `ADAPTIVE` reasoning path:
1. **Base Analysis**: Executes a rapid single-agent evaluation.
2. **Signal Detection**: Invokes the `EscalationPolicyService`.
3. **Targeted Challenge**: Invokes the `TargetedChallengeEngine` for precise falsifications.
4. **Lossless Synthesis**: Merges all findings into a final recommendation.
5. **Synthesis Preservation Validator**: A fail-safe that raises `SYNTHESIS_PRESERVATION_FAILURE` if critical minority insights or challenge findings are truncated by the LLM synthesis.

### 4. Decision Economics & Telemetry
Every decision now maintains a detailed reasoning ledger embedded directly in the `Decision` model:
- `base_analysis_calls`
- `challenge_calls`
- `synthesis_calls`
- Token, Latency, and avoided deliberation estimates.

### 5. Adaptive Timeline UI
The frontend Decision Workspace has been upgraded with an `Adaptive Timeline View`. It explicitly charts:
- The initial baseline pass.
- The exact escalation triggers activated.
- The outcome of the surgical challenges (including assumption state changes).

## Execution Guarantees
By combining granular `ChallengeTasks` with the `SynthesisPreservationValidator`, the architecture guarantees that Apex Capital spends intelligence precisely where the evidence demands it, while completely eliminating the risk of LLM "compression blindness" masking critical risks.
